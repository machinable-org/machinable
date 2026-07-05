"""One-shot, in-place store upgrade to format v1 (``machinable migrate``).

A tool, not a compatibility mode: after running it, every reader, in every
language, sees only format v1 (``id.json`` header + ``updated_at`` marker;
``hidden`` folded into the index's private overlay and removed from disk).

Key ordering constraint: a pre-v1 index database holds the *authoritative*
identity/predicate keys, but opening it through :func:`machinable.index.load`
performs the destructive schema bump (drops the tables for a rebuild). So the
upgrade reads the old database **raw** first, writes ``id.json`` from the
harvested rows (recomputing keys in Python only for directories the old index
did not know), and only then opens the index normally (triggering the schema
bump) and reindexes, re-applying the hidden overlay.
"""

from __future__ import annotations

import os
import sqlite3

from machinable import schema
from machinable.utils import is_machinable_directory, load_file, walk_markers


def _harvest_legacy_rows(database: str) -> dict[str, dict]:
    """Read record keys from a pre-v1 index database without migrating it."""
    if not os.path.isfile(database):
        return {}
    rows: dict[str, dict] = {}
    try:
        db = sqlite3.connect(database)
        db.row_factory = sqlite3.Row
        try:
            for row in db.execute(
                "SELECT record_id, kind, identity_key, predicate_key,"
                " parent_id, hidden, updated_at_ns FROM 'index'"
            ):
                rows[row["record_id"]] = {
                    "kind": row["kind"],
                    "identity_key": row["identity_key"],
                    "predicate_key": row["predicate_key"],
                    "parent": row["parent_id"],
                    "hidden": bool(row["hidden"]),
                    "updated_at_ns": int(row["updated_at_ns"]),
                }
        finally:
            db.close()
    except sqlite3.Error:
        # no readable legacy catalog, so fall back to per-directory recompute
        return {}
    return rows


def _legacy_keys_for(model) -> tuple[str, str]:
    """Recompute identity/predicate keys the way the pre-v1 ingest did.

    The Python-semantic fallback for directories the old index did not know.
    """
    from machinable.config import canonical_identity_key
    from machinable.index import _identity_exclude_for_model
    from machinable.interface import _config_layers_from_model
    from machinable.utils import object_hash, sanitize_filename

    layers = _config_layers_from_model(model)
    exclude = _identity_exclude_for_model(model)
    identity_key = sanitize_filename(
        canonical_identity_key(model.module, layers.resolved, layers.default, exclude),
        max_len=128,
    )
    predicate = dict(model.predicate or {})
    # Executions key their run-record by the dispatch timestamp (see
    # Execution.compute_predicate_key); everything else hashes the predicate.
    if model.kind == "Execution" and predicate.get("started_at"):
        predicate_key = str(predicate["started_at"])
    else:
        predicate_key = object_hash(predicate)[:32]
    return identity_key, predicate_key


def _nearest_parent_uuid(directory: str) -> str | None:
    """Legacy parent recovery: uuid of the nearest ancestor record directory."""
    current = os.path.dirname(os.path.abspath(directory))
    while current and current != os.path.dirname(current):
        if is_machinable_directory(current):
            pdata = load_file([current, "model.json"], None)
            return pdata.get("uuid") if pdata else None
        current = os.path.dirname(current)
    return None


def _record_updated_at_ns(directory: str) -> int:
    """Best available 'last changed' for a pre-v1 record.

    The newest mtime of its own files (top level only, as artifacts subdirs can
    be huge).
    """
    newest = os.path.getmtime(directory)
    try:
        for name in os.listdir(directory):
            path = os.path.join(directory, name)
            if os.path.isfile(path):
                newest = max(newest, os.path.getmtime(path))
    except OSError:
        pass
    return int(newest * 1e9)


def migrate_store(directory: str = "./storage", project_dir: str | None = None) -> dict:
    """Upgrade every record directory under ``directory`` to format v1.

    Rebuilds the index afterwards. Idempotent: directories that already carry
    ``id.json`` are left untouched. Returns a summary dict.

    Project roots are re-keyed: legacy roots had random, per-index record ids
    (and location-dependent identity); format v1 derives a deterministic root
    id from the project's location-free identity, so migrate remaps every
    legacy root uuid referenced as an ``id.json`` parent onto the new root.
    """
    import arrow

    from machinable.format import (
        bump_updated_at,
        read_id,
        write_id,
    )
    from machinable.index import Index
    from machinable.project import Project

    directory = os.path.abspath(os.path.expanduser(directory))
    if project_dir is None:
        project_dir = os.path.dirname(directory)
    database = os.path.join(directory, ".machinable.sqlite")
    legacy = _harvest_legacy_rows(database)

    # deterministic root id under the new (location-free) project identity;
    # every legacy Project-kind row maps onto it
    new_root_id = Project(project_dir).compute_record_id()
    legacy_roots = {
        record_id for record_id, row in legacy.items() if row.get("kind") == "Project"
    }

    def _remap_parent(parent: str | None) -> str | None:
        return new_root_id if parent in legacy_roots else parent

    upgraded: list[str] = []
    skipped: list[str] = []
    hidden: dict[str, str] = {}  # record_id -> reason

    for record_dir in walk_markers(directory):
        if read_id(record_dir) is not None:
            skipped.append(record_dir)
            continue
        data = load_file([record_dir, "model.json"], None)
        if data is None:
            skipped.append(record_dir)
            continue
        model = getattr(schema, data.get("kind", "Interface"), schema.Interface)(**data)
        uuid = str(model.uuid)
        row = legacy.get(uuid)
        if row is not None:
            identity_key = row["identity_key"]
            predicate_key = row["predicate_key"]
            parent = _remap_parent(row["parent"])
            if row["hidden"]:
                hidden.setdefault(uuid, "user")
        else:
            identity_key, predicate_key = _legacy_keys_for(model)
            parent = _nearest_parent_uuid(record_dir)
            if parent is None and model.kind != "Project":
                # top-level records scope under the project root (matches the
                # legacy ingest semantics, at the new deterministic root)
                parent = new_root_id
        write_id(
            record_dir,
            uuid=uuid,
            kind=model.kind,
            identity_key=identity_key,
            predicate_key=predicate_key,
            parent=parent,
        )
        ns = (
            row["updated_at_ns"]
            if row is not None
            else _record_updated_at_ns(record_dir)
        )
        bump_updated_at(record_dir, arrow.get(ns / 1e9))
        # fold the legacy hidden marker file into the overlay and remove it
        hidden_file = os.path.join(record_dir, "hidden")
        if os.path.isfile(hidden_file):
            reason = load_file(hidden_file, "user")
            hidden[uuid] = str(reason).strip() or "user"
            os.remove(hidden_file)
        upgraded.append(record_dir)

    # Now open the index normally: the schema bump drops the old tables and
    # the walk re-ingests every (now v1) directory as a pure copy. Entering
    # the Project also materializes the new deterministic root, so the
    # remapped parent references resolve immediately (they would otherwise be
    # legal forward references).
    from machinable.storage import Storage

    with Project(project_dir) as project, Storage(directory), Index() as index:
        project.ensure_project_root()
        ingested = []
        for record_dir in walk_markers(directory):
            record_id = index.ingest_directory(record_dir)
            if record_id is not None:
                ingested.append(record_id)
        for record_id, reason in hidden.items():
            index.hide(record_id)
            index.set_private(record_id, {"hidden_reason": reason})

    return {
        "directory": directory,
        "upgraded": len(upgraded),
        "already_v1": len(skipped),
        "reindexed": len(ingested),
        "hidden": len(hidden),
    }
