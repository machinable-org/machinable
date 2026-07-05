"""The Index: a rebuildable SQLite catalog over the record directories."""

import base64
import copy
import json
import os
import re
import shutil
import sqlite3
import time
from collections.abc import Callable, Iterator
from contextlib import contextmanager
from contextvars import ContextVar
from functools import partial
from typing import Any, cast

from pydantic import BaseModel

try:
    import sqlean as sqlite3  # ty: ignore[unresolved-import]  # type: ignore[no-redef]

    sqlite3.extensions.enable_all()
except ModuleNotFoundError:
    import sqlite3

from machinable import schema
from machinable.api.models import (
    ConfigLayer,
    ConfigLayers,
    FindRequest,
    FindResponse,
    IndexEntry,
    IndexEntrySummary,
    MaterializeKeys,
    MaterializeResponse,
    VerifyReport,
)
from machinable.interface import Interface, get_inherits
from machinable.types import VersionType
from machinable.utils import (
    id_from_uuid,
    load_file,
    normjson,
    object_hash,
    path_to_uri,
    random_str,
    sanitize_filename,
    uri_to_path,
    walk_markers,
)

SCHEMA_VERSION = 11

_CONFIG_COLUMNS = {
    ConfigLayer.default: "config_default_json",
    ConfigLayer.version: "config_version_json",
    ConfigLayer.update: "config_update_json",
    ConfigLayer.resolved: "config_resolved_json",
}

# binary comparison operators for config-path filters (range + equality)
_CONFIG_OPERATORS = {
    "eq": "=",
    "ne": "!=",
    "lt": "<",
    "lte": "<=",
    "gt": ">",
    "gte": ">=",
}

# columns a search may sort by (config-path sorts go through json_extract instead)
_SORTABLE_COLUMNS = {
    "created_at_ns",
    "updated_at_ns",
    "created_by",
    "label",
    "module",
    "kind",
}

_CURRENT_ENTRY: ContextVar[IndexEntry | None] = ContextVar(
    "machinable_current_index_entry", default=None
)


def migrate(db: sqlite3.Connection) -> bool:
    """Bring the schema up to ``SCHEMA_VERSION``.

    Returns ``True`` when it performed a
    **destructive reset** (dropped a populated catalog on a version bump) so the caller
    can rebuild the cache from the storage directories; the index is not the source of
    truth (see docs/design/storage.md).
    """
    cur = db.cursor()
    version = cur.execute("PRAGMA user_version;").fetchone()[0]
    did_reset = False
    if version < SCHEMA_VERSION:
        if version > 0:
            cur.execute("DROP TABLE IF EXISTS relations")
            cur.execute("DROP TABLE IF EXISTS 'index'")
            did_reset = True
        cur.execute(
            """CREATE TABLE 'index' (
                record_id TEXT PRIMARY KEY,
                kind TEXT NOT NULL,
                module TEXT,
                identity_key TEXT NOT NULL,
                predicate_json TEXT NOT NULL,
                predicate_key TEXT NOT NULL,
                parent_id TEXT REFERENCES 'index' (record_id),
                config_default_json TEXT NOT NULL DEFAULT '{}',
                config_version_json TEXT NOT NULL DEFAULT '[]',
                config_update_json TEXT NOT NULL DEFAULT '{}',
                config_resolved_json TEXT NOT NULL DEFAULT '{}',
                inherits_json TEXT NOT NULL DEFAULT '[]',
                context_json TEXT NOT NULL DEFAULT '[]',
                storage_uri TEXT NOT NULL,
                local_uri TEXT,
                storage_id TEXT,
                hidden INTEGER NOT NULL DEFAULT 0,
                bytes_missing INTEGER NOT NULL DEFAULT 0,
                created_at_ns INTEGER NOT NULL,
                updated_at_ns INTEGER NOT NULL,
                created_by TEXT,
                label TEXT,
                extra_json TEXT NOT NULL DEFAULT '{}',
                private_json TEXT NOT NULL DEFAULT '{}'
            )"""
        )
        cur.execute("CREATE INDEX idx_index_module ON 'index'(module)")
        cur.execute("CREATE INDEX idx_index_parent ON 'index'(parent_id)")
        cur.execute("CREATE INDEX idx_index_predicate_key ON 'index'(predicate_key)")
        cur.execute(
            """CREATE INDEX idx_index_identity ON 'index'(
                parent_id, identity_key, predicate_key
            )"""
        )
        cur.execute(
            """CREATE TABLE relations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                relation TEXT NOT NULL,
                record_id TEXT NOT NULL REFERENCES 'index' (record_id),
                related_id TEXT NOT NULL REFERENCES 'index' (record_id),
                priority INTEGER NOT NULL DEFAULT 0,
                created_at_ns INTEGER NOT NULL,
                UNIQUE (record_id, related_id, relation)
            )"""
        )
        cur.execute(f"PRAGMA user_version = {SCHEMA_VERSION};")
        db.commit()
    cur.close()
    return did_reset


# Databases whose catalog a destructive migration just dropped; the owning Index
# rebuilds each from its storage directories on first read
# (see Index._rebuild_if_pending).
_PENDING_REINDEX: set[str] = set()
# Databases whose schema version has already been checked this process, so the one-time
# migrate-open in _rebuild_if_pending runs at most once per path (not on every read).
_MIGRATION_CHECKED: set[str] = set()


def load(database: str, create=False) -> sqlite3.Connection:
    """Open (or create) the index database with the pinned connection profile."""
    if database.startswith("sqlite:///"):
        database = database[10:]
    if ":memory:" not in database:
        database = os.path.expanduser(database)
        if not os.path.isfile(database):
            if not create:
                raise FileNotFoundError(f"Could not find index database at {database}")
            parent = os.path.dirname(database)
            if parent:
                os.makedirs(parent, exist_ok=True)
    db = sqlite3.connect(database)
    db.row_factory = sqlite3.Row
    # Concurrency profile (see docs/design/format.md): WAL gives single-writer/
    # multi-reader across processes (UI + detached runs + server sharing one
    # cache); busy_timeout absorbs writer overlap instead of SQLITE_BUSY.
    # foreign_keys stays OFF by design: relation/parent rows may forward-
    # reference records that ingest later (order-independent reindex).
    if ":memory:" not in database:
        db.execute("PRAGMA journal_mode=WAL")
    db.execute("PRAGMA busy_timeout=5000")
    db.execute("PRAGMA synchronous=NORMAL")
    if migrate(db):
        _PENDING_REINDEX.add(database)
    return db


@contextmanager
def db(database: str, create=False) -> "Iterator[sqlite3.Connection | None]":
    """Context-managed connection; yields ``None`` when absent and not created."""
    try:
        connection = load(database, create)
        yield connection
        connection.close()
    except FileNotFoundError:
        yield None


def _row_to_entry(row: sqlite3.Row) -> IndexEntry:
    return IndexEntry(
        record_id=row["record_id"],
        kind=row["kind"],
        module=row["module"],
        identity_key=row["identity_key"],
        predicate_key=row["predicate_key"],
        predicate=json.loads(row["predicate_json"]),
        parent_id=row["parent_id"],
        storage_uri=row["storage_uri"],
        local_uri=row["local_uri"] or None,
        storage_id=row["storage_id"],
        hidden=bool(row["hidden"]),
        bytes_missing=bool(row["bytes_missing"]),
        config=ConfigLayers(
            default=json.loads(row["config_default_json"]),
            version=json.loads(row["config_version_json"]),
            update=json.loads(row["config_update_json"]),
            resolved=json.loads(row["config_resolved_json"]),
        ),
        inherits=json.loads(row["inherits_json"]),
        context=json.loads(row["context_json"]),
        created_at_ns=int(row["created_at_ns"]),
        updated_at_ns=int(row["updated_at_ns"]),
        created_by=row["created_by"],
        label=row["label"],
        extra=json.loads(row["extra_json"] or "{}"),
        private=json.loads(row["private_json"] or "{}"),
    )


def _entry_to_summary(entry: IndexEntry) -> IndexEntrySummary:
    return IndexEntrySummary(
        record_id=entry.record_id,
        kind=entry.kind,
        module=entry.module,
        identity_key=entry.identity_key,
        predicate_key=entry.predicate_key,
        parent_id=entry.parent_id,
        storage_uri=entry.storage_uri,
        local_uri=entry.local_uri,
        storage_id=entry.storage_id,
        hidden=entry.hidden,
        bytes_missing=entry.bytes_missing,
        created_at_ns=entry.created_at_ns,
        created_by=entry.created_by,
        label=entry.label,
    )


def _extra_from_model(model: schema.Interface) -> dict[str, Any]:
    extra = dict(model.extra())
    dump = getattr(model, "_dump", None)
    if dump is not None:
        extra["_dump"] = base64.b64encode(dump).decode("ascii")
    return extra


def _identity_exclude_for_model(model: schema.Interface) -> set[str]:
    """Re-import a record's Config to recover its ``identifying=False`` fields.

    Reindex derives ``identity_key`` from ``model.json``, but the exclude set lives
    in the Config class, so it must be re-imported (the design's "reindex re-imports
    Config"). Best-effort: any failure falls back to ``set()``, the over-narrow,
    never-wrong-merge direction. Module imports are ``sys.modules``-cached.
    """
    from machinable.config import identity_exclude

    try:
        module = model.module
        if not module:
            return set()
        if module.startswith("__session__"):
            dump = getattr(model, "_dump", None)
            if not dump:
                return set()
            import dill  # cloudpickle dumps are dill/pickle-loadable

            cls = dill.loads(dump)
        else:
            import importlib

            from machinable.interface import Interface
            from machinable.utils import find_subclass_in_module

            cls = find_subclass_in_module(importlib.import_module(module), Interface)
        return identity_exclude(getattr(cls, "Config", None))
    except Exception:
        return set()


def materialize_keys_from_model(
    model: schema.Interface,
    *,
    parent_id: str | None,
    identity_key: str,
    predicate: dict[str, Any],
    predicate_key: str | None = None,
    record_id: str | None = None,
    storage_id: str | None = None,
    storage_uri: str | None = None,
    local_uri: str | None = None,
) -> MaterializeKeys:
    """Build MaterializeKeys from a schema model (capturing the creator once)."""
    from machinable.interface import _config_layers_from_model

    # capture the creator once, at first materialization; loaded models (reindex)
    # already carry it, so the original creator is preserved across moves/ingest.
    if model.created_by is None:
        import getpass

        from machinable.project import Project

        model.created_by = (
            Project.get().username if Project.is_connected() else getpass.getuser()
        )

    return MaterializeKeys(
        identity_key=sanitize_filename(identity_key, max_len=128),
        predicate_key=predicate_key or object_hash(predicate)[:32],
        predicate=predicate,
        parent_id=parent_id,
        kind=model.kind,
        module=model.module,
        config=_config_layers_from_model(model),
        inherits=list(model.inherits),
        context=list(model.context),
        extra=_extra_from_model(model),
        record_id=record_id or model.uuid,
        storage_id=storage_id,
        storage_uri=storage_uri,
        local_uri=local_uri,
        created_by=model.created_by,
        created_at_ns=model.created_at_ns,
        label=model.label,
    )


def entry_to_model(entry: IndexEntry) -> schema.Interface:
    """Rebuild a schema model from an index entry."""
    model_cls = getattr(schema, entry.kind, schema.Interface)
    config = copy.deepcopy(entry.config.resolved)
    config["_default_"] = copy.deepcopy(entry.config.default)
    config["_version_"] = copy.deepcopy(entry.config.version)
    config["_update_"] = copy.deepcopy(entry.config.update)
    extra = copy.deepcopy(entry.extra)
    dump = extra.pop("_dump", None)
    model = model_cls(
        uuid=entry.record_id,
        kind=entry.kind,
        module=entry.module,
        config=config,
        version=entry.config.version,
        predicate=copy.deepcopy(entry.predicate),
        inherits=tuple(entry.inherits),
        context=copy.deepcopy(entry.context),
        created_at_ns=entry.created_at_ns,
        created_by=entry.created_by,
        label=entry.label,
        **extra,
    )
    if dump is not None:
        model._dump = base64.b64decode(dump)
    return model


def materialize_model(
    index: "Index",
    model: schema.Interface,
    *,
    parent_id: str | None = None,
    identity_key: str | None = None,
) -> bool:
    """Materialize a bare schema model; returns whether a row was created."""
    predicate = dict(model.predicate or {})
    if model.module and "module" not in predicate:
        predicate = {**predicate, "module": model.module}
    if identity_key is None:
        # call-stable fallback: the uuid must not participate (it is None on the
        # first call and set on repeat calls; a uuid-derived identity would then
        # differ between calls and trip the materialize collision guard).
        identity_key = model.module or model.kind
    keys = materialize_keys_from_model(
        model,
        parent_id=parent_id,
        identity_key=identity_key,
        predicate=predicate,
        record_id=model.uuid,
    )
    response = index.materialize(keys)
    model.uuid = response.entry.record_id
    model.created_at_ns = response.entry.created_at_ns
    return response.created


def _bind_value(value: Any) -> str | int | float:
    if isinstance(value, bool):
        return normjson(value)
    if isinstance(value, str | int | float):
        return value
    return normjson(value)


_JSON_PATH_PART = re.compile(r"^[A-Za-z0-9_\-\[\]]+$")


def _json_path(path: str) -> str:
    """Build a SQLite JSON path (``$.a.b``) from a dotted user path.

    Rejects segments that aren't plain identifiers/indices. The value is
    *bound* as a parameter by callers, so this is defense-in-depth, not the
    injection guard.
    """
    parts = [p for p in path.split(".") if p]
    for part in parts:
        if not _JSON_PATH_PART.match(part):
            raise ValueError(f"Invalid config path segment '{part}'")
    return "$" + "".join(f".{part}" for part in parts)


def _json_path_clause(column: str, path: str) -> tuple[str, str]:
    """Return ``(sql_expr, path_param)`` with the JSON path as a bound parameter.

    ``column`` is an internal, fixed identifier (never user input); the path
    is bound (``json_extract(col, ?)``) to prevent SQL injection.
    """
    return f"json_extract({column}, ?)", _json_path(path)


def _build_find_sql(req: FindRequest) -> tuple[str, str, list[Any], list[Any]]:
    clauses: list[str] = []
    params: list[Any] = []

    if req.module is not None:
        clauses.append("module = ?")
        params.append(req.module)
    if req.kind is not None:
        clauses.append("kind = ?")
        params.append(req.kind)
    if req.created_by is not None:
        clauses.append("created_by = ?")
        params.append(req.created_by)
    if req.label is not None:
        clauses.append("label = ?")
        params.append(req.label)
    if req.parent_id is not None:
        clauses.append("parent_id = ?")
        params.append(req.parent_id)
    if req.identity_key is not None:
        clauses.append("identity_key = ?")
        params.append(req.identity_key)
    if req.predicate_key is not None:
        clauses.append("predicate_key = ?")
        params.append(req.predicate_key)
    if req.predicate:
        for key, value in req.predicate.items():
            clauses.append("json_extract(predicate_json, ?) = ?")
            params.append(_json_path(key))
            if isinstance(value, bool):
                params.append(int(value))
            else:
                params.append(_bind_value(value))
    if req.config is not None:
        column = _CONFIG_COLUMNS[req.config.layer]
        for f in req.config.filters:
            expr, path_param = _json_path_clause(column, f.path)
            op = f.op.value if hasattr(f.op, "value") else f.op
            if op in _CONFIG_OPERATORS:
                clauses.append(f"{expr} {_CONFIG_OPERATORS[op]} ?")
                params.extend([path_param, _bind_value(f.value)])
            elif op == "in":
                values = f.value if isinstance(f.value, list) else [f.value]
                if not values:
                    clauses.append("0=1")
                    continue
                placeholders = ",".join("?" for _ in values)
                clauses.append(f"{expr} IN ({placeholders})")
                params.append(path_param)
                params.extend(_bind_value(v) for v in values)
            elif op == "contains":
                clauses.append(f"{expr} LIKE ?")
                params.extend([path_param, f"%{f.value}%"])
            else:
                raise ValueError(f"Unsupported config operator '{op}'")
    if not req.include_hidden:
        clauses.append("hidden = 0")
    if not req.include_bytes_missing:
        clauses.append("bytes_missing = 0")
    if req.record_id_suffix is not None:
        clauses.append("record_id LIKE ?")
        params.append(f"%{req.record_id_suffix}")

    where = " AND ".join(clauses) if clauses else "1=1"
    count_params = list(params)

    order_terms: list[str] = []
    for spec in req.sort or []:
        direction = "ASC" if str(spec.direction).lower() == "asc" else "DESC"
        if spec.config_layer is not None:
            col = _CONFIG_COLUMNS[spec.config_layer]
            expr, path_param = _json_path_clause(col, spec.by)
            order_terms.append(f"{expr} {direction}")
            params.append(path_param)
        else:
            if spec.by not in _SORTABLE_COLUMNS:
                raise ValueError(f"Cannot sort by column '{spec.by}'")
            order_terms.append(f"{spec.by} {direction}")
    order_sql = ", ".join(order_terms) if order_terms else "created_at_ns DESC"

    sql = f"SELECT * FROM 'index' WHERE {where} ORDER BY {order_sql} LIMIT ? OFFSET ?"
    params.extend([req.limit, req.offset])
    count_sql = f"SELECT COUNT(*) FROM 'index' WHERE {where}"
    return sql, count_sql, params, count_params


class Index(Interface):
    """The SQLite catalog mapping identities to locations.

    A rebuildable cache over the record directories, which remain the source
    of truth. The database lives at ``<project>/.machinable.sqlite``
    (overridable with the ``MACHINABLE_INDEX`` environment variable); where
    records live is the :class:`~machinable.storage.Storage`'s business.
    """

    kind = "Index"
    _ambient = True
    default = None

    class Config(BaseModel):
        """Internal/tooling override of the database location."""

        database: str | None = None

    def __init__(self, version: VersionType = None):
        super().__init__(version=version)
        self.__model__ = schema.Index(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            inherits=get_inherits(self),
        )

    def _storage_root(self) -> str:
        """The connected (or default) Storage's root directory."""
        from machinable.storage import Storage

        return Storage.get().root()

    def _rebuild_if_pending(self) -> None:
        """Rebuild the catalog from storage after a destructive schema migration.

        The index is a cache, not the source of truth (docs/design/storage.md),
        so a version bump that drops the tables is repaired by re-ingesting
        the ``.machinable`` directories under the storage root, since
        automatically, on the first read, exactly once per database per
        process.
        """
        from machinable.project import Project

        database = self._resolved_database()
        # Ensure the schema has been migrated first: migrate() runs on db open and is
        # what flags a destructive reset, so the pending check must come after an open
        # (otherwise the very first read checks before the reset is recorded). Do this
        # one-time open at most once per database per process, off the hot read path.
        if database not in _MIGRATION_CHECKED:
            _MIGRATION_CHECKED.add(database)
            with db(database, create=False):
                pass
        if database not in _PENDING_REINDEX:
            return
        root = self._storage_root()
        markers = list(walk_markers(root)) if os.path.isdir(root) else []
        if not markers and not Project.is_connected():
            # Before a Project is connected, _storage_root() anchors to the cwd,
            # which may not be where the runs live. Defer without discarding so a
            # later read inside a connected Project rebuilds from the right root.
            return
        # discard before ingesting so ingest's own db access does not re-enter this path
        _PENDING_REINDEX.discard(database)
        for directory in markers:
            try:
                self.ingest_directory(directory)
            except Exception:  # noqa: BLE001 - a bad directory must not abort the rebuild
                continue

    def _resolved_database(self) -> str:
        database = self.config.database or os.environ.get("MACHINABLE_INDEX")
        if not database:
            from machinable.project import Project

            base = (
                os.path.expanduser(Project.get().config.directory)
                if Project.is_connected()
                else os.getcwd()
            )
            return os.path.join(base, ".machinable.sqlite")
        if database.startswith("sqlite:///"):
            database = database[10:]
        return os.path.expanduser(database)

    def local_directory(  # ty: ignore[invalid-method-override]
        self, record_id: str, *append: str
    ) -> str:
        """Resolve the current local working directory for ``record_id``.

        Prefers the (rewritable) ``local_uri`` working copy, falling back to the
        durable ``storage_uri`` when it is locally resolvable (disk passthrough).
        """
        with db(self._resolved_database(), create=False) as _db:
            if _db:
                row = _db.execute(
                    "SELECT storage_uri, local_uri FROM 'index' WHERE record_id=?",
                    (record_id,),
                ).fetchone()
                if row is not None:
                    working = row["local_uri"] or row["storage_uri"]
                    base = uri_to_path(working)
                    return os.path.join(base, *append)
        return os.path.join(self._storage_root(), record_id, *append)

    def register_location(self, record_id: str, local_uri: str) -> None:
        """Record a rewrite of the working-copy location for ``record_id``.

        Called by ``Storage.pull`` after fetching a remote directory, or by an
        ``Execution`` that relocates the working copy (e.g. Slurm scratch).
        """
        with db(self._resolved_database(), create=True) as _db:
            assert _db is not None
            _db.execute(
                "UPDATE 'index' SET local_uri=?, updated_at_ns=? WHERE record_id=?",
                (local_uri, time.time_ns(), record_id),
            )
            _db.commit()

    def set_storage(
        self, record_id: str, storage_uri: str, storage_id: str | None = None
    ) -> None:
        """Record or relocate the durable home of ``record_id``.

        Used by upload and by reindex when a directory is found at a new
        location.
        """
        with db(self._resolved_database(), create=True) as _db:
            assert _db is not None
            _db.execute(
                "UPDATE 'index' SET storage_uri=?, storage_id=?, updated_at_ns=?"
                " WHERE record_id=?",
                (storage_uri, storage_id, time.time_ns(), record_id),
            )
            _db.commit()

    def set_label(  # ty: ignore[invalid-method-override]
        self, record_id: str, label: str | None
    ) -> bool:
        """Update the mutable ``label`` of an existing entry (FCFS / last-write- wins).

        Config and identity are untouched; only this metadata changes.
        """
        with db(self._resolved_database(), create=False) as _db:
            if not _db:
                return False
            cur = _db.execute(
                "UPDATE 'index' SET label=?, updated_at_ns=? WHERE record_id=?",
                (label, time.time_ns(), record_id),
            )
            _db.commit()
            return cur.rowcount > 0

    def set_updated_at(self, record_id: str, updated_at_ns: int) -> None:
        """Write-through of the record's ``updated_at`` sync marker.

        Updates the cache column; called by ``Interface.touch`` and by ingest.
        """
        with db(self._resolved_database(), create=False) as _db:
            if not _db:
                return
            _db.execute(
                "UPDATE 'index' SET updated_at_ns=? WHERE record_id=?",
                (updated_at_ns, record_id),
            )
            _db.commit()

    def get_private(self, record_id: str) -> dict:
        """The record's private overlay.

        This index owner's annotations *about* the record; never part of the
        record itself.
        """
        entry = self.get_by_id(record_id)
        return dict(entry.private) if entry is not None else {}

    def set_private(self, record_id: str, value: dict, *, merge: bool = True) -> dict:
        """Update the private overlay.

        ``merge=True`` (default) shallow-merges top-level keys (``None``
        deletes a key); ``merge=False`` replaces the object. Overlay writes
        never touch the record directory and never bump ``updated_at``.
        """
        current = self.get_private(record_id) if merge else {}
        for k, v in value.items():
            if v is None:
                current.pop(k, None)
            else:
                current[k] = v
        with db(self._resolved_database(), create=False) as _db:
            if not _db:
                return current
            _db.execute(
                "UPDATE 'index' SET private_json=? WHERE record_id=?",
                (normjson(current), record_id),
            )
            _db.commit()
        return current

    def refresh_entry(self, keys: MaterializeKeys) -> None:
        """Refresh an existing row's derived columns from its record directory.

        Preserves the private overlay and ``hidden``/``created_at_ns``.
        """
        with db(self._resolved_database(), create=False) as _db:
            if not _db:
                return
            _db.execute(
                """UPDATE 'index' SET
                    kind=?, module=?, predicate_json=?,
                    config_default_json=?, config_version_json=?,
                    config_update_json=?, config_resolved_json=?,
                    inherits_json=?, context_json=?, label=?, extra_json=?
                WHERE record_id=?""",
                (
                    keys.kind,
                    keys.module,
                    normjson(keys.predicate),
                    normjson(keys.config.default),
                    normjson(keys.config.version),
                    normjson(keys.config.update),
                    normjson(keys.config.resolved),
                    normjson(keys.inherits),
                    normjson(keys.context),
                    keys.label,
                    normjson(keys.extra),
                    keys.record_id,
                ),
            )
            _db.commit()

    def resolve(self, record_id: str) -> str | None:
        """Return the current local working directory, pulling from the home.

        Storage when the working copy is cold/remote. Returns None if unknown.

        For local (disk) storage this is a passthrough; remote schemes delegate
        to the connected Storage providers via :func:`machinable.storage.fetch`.
        """
        entry = self.get_by_id(record_id)
        if entry is None:
            return None
        for uri in (entry.local_uri, entry.storage_uri):
            if uri is None:
                continue
            try:
                path = uri_to_path(uri)
            except ValueError:
                continue  # remote scheme, needs a pull
            if os.path.isdir(path):
                return path
        # cold or remote: ask connected Storage providers to materialize a copy
        from machinable.storage import fetch

        target = os.path.join(self._storage_root(), record_id)
        if fetch(record_id, target):
            self.register_location(record_id, path_to_uri(target))
            return target
        return None

    @contextmanager
    def bind(self, entry: IndexEntry):
        """Context manager exposing ``entry`` as the current entry."""
        token = _CURRENT_ENTRY.set(entry)
        try:
            yield entry
        finally:
            _CURRENT_ENTRY.reset(token)

    def current_entry(self) -> IndexEntry | None:
        """The entry bound by :meth:`bind`, if any."""
        return _CURRENT_ENTRY.get()

    def materialize(  # ty: ignore[invalid-method-override]
        self, keys: MaterializeKeys, force: bool = False
    ) -> MaterializeResponse:
        """Create (or reuse) the index row for ``keys``, collision-guarded."""
        now = time.time_ns()
        # ingest preserves the record's true birth date (pure copy);
        # a fresh materialization mints it
        created_at_ns = keys.created_at_ns or now
        # 12-char base62: birthday-safe into billions of records, which
        # matters because ingesting foreign stores has no mint-time guard.
        record_id = keys.record_id or random_str(12)

        with db(self._resolved_database(), create=True) as _db:
            assert _db is not None
            parent_entry = None
            if keys.parent_id:
                row = _db.execute(
                    "SELECT * FROM 'index' WHERE record_id=?",
                    (keys.parent_id,),
                ).fetchone()
                if row is not None:
                    parent_entry = _row_to_entry(row)

            existing_record = _db.execute(
                "SELECT * FROM 'index' WHERE record_id=?",
                (record_id,),
            ).fetchone()
            if existing_record is not None:
                # Collision guard: reusing a
                # record_id is only legitimate for the *same* record. Differing
                # identity/predicate keys mean two distinct records claim one id
                # (e.g. ingesting a foreign store), so fail loudly, never merge.
                entry = _row_to_entry(existing_record)
                if (
                    entry.identity_key != keys.identity_key
                    or entry.predicate_key != keys.predicate_key
                ):
                    from machinable.errors import IndexCollision

                    raise IndexCollision(
                        f"record_id '{record_id}' already exists with different "
                        f"identity (existing {entry.identity_key}/"
                        f"{entry.predicate_key}, incoming "
                        f"{keys.identity_key}/{keys.predicate_key}); "
                        "two distinct records claim the same id, so relocate or "
                        "re-key one of them"
                    )
                return MaterializeResponse(entry=entry, created=False)

            if not force:
                existing = _db.execute(
                    """SELECT * FROM 'index' WHERE
                    (parent_id IS ? OR (parent_id IS NULL AND ? IS NULL))
                    AND identity_key=? AND predicate_key=?
                    LIMIT 1""",
                    (
                        keys.parent_id,
                        keys.parent_id,
                        keys.identity_key,
                        keys.predicate_key,
                    ),
                ).fetchone()
                if existing is not None and keys.record_id is None:
                    return MaterializeResponse(
                        entry=_row_to_entry(existing), created=False
                    )

            from machinable.project import Project

            project_directory = os.path.abspath(
                os.path.expanduser(
                    Project.get().config.directory
                    if Project.is_connected()
                    else os.getcwd()
                )
            )
            identity_key = keys.identity_key
            predicate_key = keys.predicate_key
            if keys.storage_uri is not None:
                # ingestion at an existing location (reindex of a moved/remote dir)
                storage_uri = keys.storage_uri
                local_uri = keys.local_uri
            elif keys.kind == "Project":
                # the project root entry is self-referential: it maps onto the
                # project directory itself (which already exists), making the
                # Project a first-class materialized interface and the parent
                # under which the project's interfaces are scoped.
                storage_uri = path_to_uri(project_directory)
                local_uri = storage_uri
            else:
                segments = (
                    sanitize_filename(identity_key),
                    sanitize_filename(predicate_key),
                )
                if parent_entry is None:
                    base = os.path.join(self._storage_root(), *segments)
                elif parent_entry.kind == "Project":
                    # top-level interfaces are scoped under their project's
                    # identity so that interfaces from different projects sharing
                    # one index do not collide on disk.
                    base = os.path.join(
                        self._storage_root(),
                        sanitize_filename(parent_entry.identity_key),
                        sanitize_filename(parent_entry.predicate_key),
                        *segments,
                    )
                else:
                    # run-records nest under their parent interface's directory
                    parent_path = uri_to_path(parent_entry.storage_uri)
                    base = os.path.join(parent_path, *segments)
                # durable home; for disk storage the runtime working copy is the
                # same path (passthrough), so local_uri mirrors storage_uri.
                storage_uri = path_to_uri(base)
                local_uri = storage_uri
                os.makedirs(uri_to_path(storage_uri), exist_ok=True)

            try:
                _db.execute(
                    """INSERT INTO 'index' (
                        record_id, kind, module, identity_key, predicate_json,
                        predicate_key, parent_id,
                        config_default_json, config_version_json,
                        config_update_json, config_resolved_json,
                        inherits_json, context_json, storage_uri, local_uri, storage_id,
                        hidden, bytes_missing,
                        created_at_ns, updated_at_ns, created_by, label, extra_json
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,0,?,?,?,?,?)""",
                    (
                        record_id,
                        keys.kind,
                        keys.module,
                        keys.identity_key,
                        normjson(keys.predicate),
                        keys.predicate_key,
                        keys.parent_id,
                        normjson(keys.config.default),
                        normjson(keys.config.version),
                        normjson(keys.config.update),
                        normjson(keys.config.resolved),
                        normjson(keys.inherits),
                        normjson(keys.context),
                        storage_uri,
                        local_uri,
                        keys.storage_id,
                        created_at_ns,
                        created_at_ns,
                        keys.created_by,
                        keys.label,
                        normjson(keys.extra),
                    ),
                )
                _db.commit()
            except sqlite3.IntegrityError:
                # lost a concurrent materialization race for the same
                # record_id (deterministic ids, e.g. project roots, make two
                # threads/processes mint identical ids by design): treat like
                # the step-1 hit, reusing the winner's row after the same
                # collision-guard key comparison.
                _db.rollback()
                row = _db.execute(
                    "SELECT * FROM 'index' WHERE record_id=?", (record_id,)
                ).fetchone()
                if row is None:
                    raise
                entry = _row_to_entry(row)
                if (
                    entry.identity_key != keys.identity_key
                    or entry.predicate_key != keys.predicate_key
                ):
                    from machinable.errors import IndexCollision

                    raise IndexCollision(
                        f"record_id '{record_id}' already exists with "
                        f"different identity (existing {entry.identity_key}/"
                        f"{entry.predicate_key}, incoming "
                        f"{keys.identity_key}/{keys.predicate_key})"
                    ) from None
                return MaterializeResponse(entry=entry, created=False)
            row = _db.execute(
                "SELECT * FROM 'index' WHERE record_id=?", (record_id,)
            ).fetchone()
            return MaterializeResponse(entry=_row_to_entry(row), created=True)

    def materialize_from(
        self,
        provider: Any,
        *,
        parent_id: str | None = None,
        force: bool = False,
        record_id: str | None = None,
    ) -> MaterializeResponse:
        """Materialize an index row from an interface provider."""
        from machinable.project import Project

        if Project.is_connected() and provider.kind != "Project":
            Project.get().ensure_project_root()

        if parent_id is None:
            parent = provider.parent
            parent_id = parent.record_id if parent is not None else None
        if record_id is None:
            record_id = (
                provider.__model__.uuid
                if getattr(provider, "is_materialized", lambda: False)()
                else None
            )
        if record_id is None:
            # providers may derive a deterministic record id (e.g. Project
            # roots, so every index mints the same root uuid; see
            # Project.compute_record_id); default is a random mint.
            compute = getattr(provider, "compute_record_id", None)
            if callable(compute):
                record_id = compute()
        keys = materialize_keys_from_model(
            provider.__model__,
            parent_id=parent_id,
            identity_key=provider.catalog_identity_key(),
            predicate=provider.predicate,
            predicate_key=provider.predicate_key,
            record_id=record_id,
        )
        response = self.materialize(keys, force=force)
        if not getattr(provider, "is_materialized", lambda: False)():
            provider.__model__.uuid = response.entry.record_id
        return response

    def get_entry(
        self,
        parent_id: str | None,
        identity_key: str,
        predicate_key: str,
    ) -> IndexEntry | None:
        """Look up an entry by its dedup triple (parent, identity, predicate)."""
        with db(self._resolved_database(), create=False) as _db:
            if not _db:
                return None
            row = _db.execute(
                """SELECT * FROM 'index' WHERE
                (parent_id IS ? OR (parent_id IS NULL AND ? IS NULL))
                AND identity_key=? AND predicate_key=? AND hidden=0
                LIMIT 1""",
                (parent_id, parent_id, identity_key, predicate_key),
            ).fetchone()
            if row is None:
                return None
            return _row_to_entry(row)

    def get_by_id(self, record_id: str) -> IndexEntry | None:
        """Look up an entry by record id (short ids supported)."""
        self._rebuild_if_pending()
        with db(self._resolved_database(), create=False) as _db:
            if not _db:
                return None
            if len(record_id) == 6:
                row = _db.execute(
                    "SELECT * FROM 'index' WHERE record_id=?",
                    (record_id,),
                ).fetchone()
                if row is not None:
                    return _row_to_entry(row)
                rows = _db.execute(
                    """SELECT * FROM 'index' WHERE record_id LIKE ?""",
                    (f"%{record_id[:2]}-{record_id[2:]}-%",),
                ).fetchall()
                for row in rows:
                    entry = _row_to_entry(row)
                    if id_from_uuid(entry.record_id) == record_id:
                        return entry
                return None
            row = _db.execute(
                "SELECT * FROM 'index' WHERE record_id=?",
                (record_id,),
            ).fetchone()
            if row is None:
                return None
            return _row_to_entry(row)

    def find(  # ty: ignore[invalid-method-override]
        self, request: FindRequest
    ) -> FindResponse:
        """Query entries with a :class:`FindRequest` (filters, sort, paging)."""
        self._rebuild_if_pending()
        sql, count_sql, params, count_params = _build_find_sql(request)
        with db(self._resolved_database(), create=False) as _db:
            if not _db:
                return FindResponse(items=[], total=0)
            total = _db.execute(count_sql, count_params).fetchone()[0]
            rows = _db.execute(sql, params).fetchall()
            items = [_entry_to_summary(_row_to_entry(r)) for r in rows]
            return FindResponse(items=items, total=total)

    def search(self, request: FindRequest) -> tuple[list[IndexEntry], int]:
        """Like :meth:`find` but returns full entries (config included) + total."""
        self._rebuild_if_pending()
        sql, count_sql, params, count_params = _build_find_sql(request)
        with db(self._resolved_database(), create=False) as _db:
            if not _db:
                return [], 0
            total = _db.execute(count_sql, count_params).fetchone()[0]
            rows = _db.execute(sql, params).fetchall()
            return [_row_to_entry(r) for r in rows], total

    def verify(
        self,
        parent_id: str | None = None,
        update_bytes_missing: bool = True,
    ) -> VerifyReport:
        """Check indexed records' availability, optionally flagging missing bytes."""
        find_req = FindRequest(
            parent_id=parent_id,
            include_hidden=False,
            include_bytes_missing=True,
            limit=10000,
        )
        entries = self.find(find_req).items
        missing: list[str] = []
        ok = 0
        for summary in entries:
            working = summary.local_uri or summary.storage_uri
            try:
                path = uri_to_path(working)
            except ValueError:
                # remote-only storage; treat as present (cannot stat locally)
                ok += 1
                continue
            exists = os.path.isdir(path) or os.path.isfile(path)
            if exists:
                ok += 1
                if summary.bytes_missing:
                    with db(self._resolved_database(), create=True) as _db:
                        assert _db is not None
                        _db.execute(
                            "UPDATE 'index' SET bytes_missing=0 WHERE record_id=?",
                            (summary.record_id,),
                        )
                        _db.commit()
            else:
                missing.append(summary.record_id)
                if update_bytes_missing:
                    with db(self._resolved_database(), create=True) as _db:
                        assert _db is not None
                        _db.execute(
                            "UPDATE 'index' SET bytes_missing=1 WHERE record_id=?",
                            (summary.record_id,),
                        )
                        _db.commit()
        return VerifyReport(checked=len(entries), missing=missing, ok=ok)

    def hide(self, record_id: str) -> None:
        """Hide ``record_id`` from queries (a per-person, index-only flag)."""
        with db(self._resolved_database(), create=True) as _db:
            assert _db is not None
            # an overlay write annotates the record rather than changing it,
            # so updated_at is deliberately not bumped
            _db.execute(
                "UPDATE 'index' SET hidden=1 WHERE record_id=?",
                (record_id,),
            )
            _db.commit()

    def unhide(self, record_id: str) -> None:
        """Undo :meth:`hide` for ``record_id``."""
        with db(self._resolved_database(), create=False) as _db:
            if not _db:
                return
            _db.execute(
                "UPDATE 'index' SET hidden=0 WHERE record_id=?",
                (record_id,),
            )
            _db.commit()

    def create_relation(
        self,
        relation: str,
        uuid: str,
        related_uuid: str | list[str],
        priority: int = 0,
        timestamp: int | None = None,
    ) -> None:
        """Insert a relation edge (idempotent)."""
        if isinstance(related_uuid, list | tuple):
            for r in related_uuid:
                self.create_relation(relation, uuid, r, priority, timestamp)
            return
        if timestamp is None:
            timestamp = time.time_ns()
        with db(self._resolved_database(), create=True) as _db:
            assert _db is not None
            if _db.execute(
                "SELECT id FROM relations"
                " WHERE record_id=? AND related_id=? AND relation=?",
                (uuid, related_uuid, relation),
            ).fetchone():
                return
            _db.execute(
                """INSERT INTO relations (
                    relation, record_id, related_id, priority, created_at_ns
                ) VALUES (?,?,?,?,?)""",
                (relation, uuid, related_uuid, priority, timestamp),
            )
            _db.commit()

    def find_related(
        self, relation: str, uuid: str, inverse: bool = False
    ) -> None | list[schema.Interface]:
        """Entries related to ``uuid`` through ``relation``."""
        self._rebuild_if_pending()
        with db(self._resolved_database(), create=False) as _db:
            if not _db:
                return None
            if not inverse:
                rows = _db.execute(
                    """SELECT * FROM 'index' WHERE record_id IN (
                        SELECT related_id FROM relations
                        WHERE record_id=? AND relation=?
                    ) ORDER BY created_at_ns DESC""",
                    (uuid, relation),
                ).fetchall()
            else:
                rows = _db.execute(
                    """SELECT * FROM 'index' WHERE record_id IN (
                        SELECT record_id FROM relations
                        WHERE related_id=? AND relation=?
                    ) ORDER BY created_at_ns DESC""",
                    (uuid, relation),
                ).fetchall()
            return [entry_to_model(_row_to_entry(r)) for r in rows or []]

    def import_directory(
        self,
        directory: str,
        relations: bool = True,
        file_importer: Callable[[str, str], None] = partial(
            shutil.copytree, symlinks=True
        ),
    ):
        """Copy an external format-v1 record directory into this store.

        Indexes it under its own identity (from ``id.json``): a pure copy,
        like :meth:`ingest_directory`, plus the file import.
        """
        from machinable.errors import MachinableError
        from machinable.format import read_id

        header = read_id(directory)
        if header is None:
            raise MachinableError(
                f"'{directory}' has no id.json, so it is not a format-v1 record "
                "directory; run `machinable migrate` on the source store"
            )
        data = load_file([directory, "model.json"])
        model = getattr(schema, data["kind"], schema.Interface)
        interface = model(**data)

        if relations:
            relations_data = load_file([directory, "related", "metadata.jsonl"], [])
        else:
            relations_data = []

        keys = materialize_keys_from_model(
            interface,
            parent_id=header.get("parent"),
            identity_key=header["identity_key"],
            predicate=dict(interface.predicate or {}),
            predicate_key=header["predicate_key"],
            record_id=interface.uuid,
        )
        self.materialize(keys)

        src = os.path.abspath(directory)
        dst = os.path.abspath(self.local_directory(cast(str, interface.uuid)))
        if src != dst:
            if os.path.isdir(dst):
                shutil.rmtree(dst)
            file_importer(src, dst)
        for r in relations_data:
            self.create_relation(r["name"], r["uuid"], r["related_uuid"])

    def ingest_directory(
        self,
        directory: str,
        *,
        storage_id: str | None = None,
        relations: bool = True,
    ) -> str | None:
        """Index a ``.machinable`` directory at its current location.

        A pure copy: identity comes from ``id.json``
        (keys + logical parent: no Config import, no hash recompute, no
        nesting walk), everything else from ``model.json`` / ``updated_at`` /
        ``related/metadata.jsonl``. Idempotent and order-independent: parent
        and edge references may point at records that have not been ingested
        yet (forward references); they resolve once the targets ingest.
        Re-ingesting an existing record refreshes the derived columns and
        preserves the private overlay.

        Returns the ingested ``record_id`` (uuid), ``None`` if the directory
        holds no ``.machinable`` sentinel; raises when the sentinel is present
        but the directory is not format-v1 (run ``machinable migrate``).
        """
        from machinable.errors import MachinableError
        from machinable.format import read_id, read_updated_at_ns
        from machinable.utils import is_machinable_directory

        if not is_machinable_directory(directory):
            return None
        header = read_id(directory)
        if header is None:
            raise MachinableError(
                f"'{directory}' has a .machinable sentinel but no id.json, so it is "
                "not a format-v1 record directory; run `machinable migrate` "
                "to upgrade the store"
            )
        data = load_file([directory, "model.json"], None)
        if data is None:
            raise MachinableError(
                f"'{directory}' has no model.json (corrupt record directory)"
            )
        if data.get("uuid") != header["uuid"]:
            raise MachinableError(
                f"'{directory}': id.json uuid '{header['uuid']}' does not match "
                f"model.json uuid '{data.get('uuid')}' (corrupt record directory)"
            )

        model = getattr(schema, data["kind"], schema.Interface)(**data)
        uri = path_to_uri(directory)
        keys = materialize_keys_from_model(
            model,
            parent_id=header.get("parent"),
            identity_key=header["identity_key"],
            predicate=dict(model.predicate or {}),
            predicate_key=header["predicate_key"],
            record_id=model.uuid,
            storage_uri=uri,
            local_uri=uri,
            storage_id=storage_id,
        )
        response = self.materialize(keys)
        if not response.created:
            # re-ingest: refresh derived columns from disk, overlay untouched
            self.refresh_entry(keys)
        # point the (possibly pre-existing) record at the directory's current
        # location, supporting reindex after a move or upload.
        uuid = cast(str, model.uuid)
        self.set_storage(uuid, uri, storage_id)
        self.register_location(uuid, uri)
        updated_at_ns = read_updated_at_ns(directory)
        if updated_at_ns is not None:
            self.set_updated_at(uuid, updated_at_ns)

        if relations:
            for r in load_file([directory, "related", "metadata.jsonl"], []):
                # UUID-keyed edge; forward references to not-yet-ingested
                # interfaces are tolerated and resolve at query time.
                self.create_relation(r["name"], r["uuid"], r["related_uuid"])

        return model.uuid

    def reindex(self, storage: Any = None, *, relations: bool = True) -> list[str]:
        """(Re)build index rows by walking a Storage for ``.machinable`` markers.

        Full scan. Idempotent and order-independent across directories and
        storages; the index is a cache that can always be rebuilt from the
        storage directories themselves. Returns the list of ingested uuids.
        """
        if storage is None:
            from machinable.storage import Storage

            storage = Storage.get()
        storage_id = getattr(storage, "id", None)
        ingested: list[str] = []
        for directory in storage.walk():
            uuid = self.ingest_directory(
                directory, storage_id=storage_id, relations=relations
            )
            if uuid is not None:
                ingested.append(uuid)
        return ingested
