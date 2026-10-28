"""Storage: durable homes for records, and the working copies runs write in."""

import builtins
import contextvars
import json
import os
import posixpath
import shutil
import threading
import time
from collections.abc import Iterable, Iterator
from typing import IO, TYPE_CHECKING, NamedTuple, Protocol, cast

from pydantic import BaseModel

from machinable import schema
from machinable.api.models import IndexEntry
from machinable.format import UPDATED_AT_FILENAME, is_later
from machinable.index import Index
from machinable.interface import Interface, get_inherits
from machinable.results import (
    RESULTS_FILENAME,
    ResultError,
    data_files,
    is_data_file,
    read_manifest,
    stale_files,
)
from machinable.types import VersionType
from machinable.utils import (
    MACHINABLE_MARKER,
    is_directory_version,
    load_file,
    path_to_uri,
    random_str,
    sanitize_filename,
    save_file,
    uri_to_path,
    walk_markers,
)

if TYPE_CHECKING:
    from machinable.claims import RunRecord

# (name relative to the listed location, size in bytes, the store's version)
Listing = list[tuple[str, int, str | None]]

CATALOG_DIRECTORY = ".catalog"
# a record's catalog files besides those up to ``catalog_max_bytes``
CATALOG_FILES = ("related/metadata.jsonl", RESULTS_FILENAME)
CATALOG_MAX_BYTES = 1024 * 1024
CATALOG_LOOKBACK_NS = 60 * 10**9
# pushed last, in this order: a home that has the results' manifest has the
# results it declares, and one that has finished_at has the rest of the run
LAST_FILES = (RESULTS_FILENAME, "finished_at")
UNLOGGED_FILES = ("heartbeat_at", UPDATED_AT_FILENAME)
_LOCAL_SCHEMES = ("file://", "scratch://")
_FETCHED: dict[str, set[str]] = {}


class RecordKeys(Protocol):
    """What a record's home is derived from: its identity and predicate keys."""

    @property
    def identity_key(self) -> str:
        """The record's identity key."""
        ...

    @property
    def predicate_key(self) -> str:
        """The record's predicate key."""
        ...


class Keys(NamedTuple):
    """The :class:`RecordKeys` of a record not in the index (yet)."""

    identity_key: str
    predicate_key: str


class Storage(Interface):
    """Durable home for records, and where results live.

    The base class is the local-filesystem storage rooted at ``./storage``
    under the project; connect ``Storage("/other/location")`` to relocate
    results. Another home (an object store) implements the file methods
    (:meth:`list`, :meth:`read`, :meth:`write`, :meth:`remove`, and for
    claims the two atomic operations) over its own URIs; everything else
    (where a record lives, commit, fetch, the working copy, the claim
    protocol's reads) is written once here over those methods.

    The innermost connected storage (``Storage.get()``) is the home new
    records are laid out in; storages connected around it are mirrors, which
    receive every commit and are read when the home lacks a record.
    """

    kind = "Storage"
    _ambient = True
    default = None
    # whether a listing of this store comes in time order; a store whose
    # listing is alphabetical (an object store) keeps a log of new records
    # (``.catalog/<time>-<uuid>``) for :meth:`sync` instead
    catalog_log = False

    class Config(BaseModel):
        """``directory`` locates the storage root (project-relative or absolute)."""

        directory: str = "./storage"

    def __init__(
        self,
        version: VersionType = None,
    ):
        if is_directory_version(version):
            # interpret as shortcut for directory
            version = {"directory": version}
        super().__init__(version=version)
        self.__model__ = schema.Storage(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            inherits=get_inherits(self),
        )
        self._entry: IndexEntry | None = None
        # (size, mtime) of each file last pushed, by its location here
        self._pushed: dict[str, tuple[int, int]] = {}
        # logged records a sync could not read (half-written): uuid -> location
        self._unread: dict[str, str] = {}
        # catalog-log entries read lately, so one listed late is read once
        self._logged: set[str] = set()

    def __enter__(self):
        super().__enter__()
        self._entry = None
        return self

    def ensure_materialized(self) -> IndexEntry:
        """Materialize this storage's own index entry once."""
        if self._entry is None:
            from machinable.project import Project

            project = Project.get()
            if project is not None:
                project.ensure_project_root()
            self._entry = Index.get().materialize_from(self).entry
        return self._entry

    @property
    def id(self) -> str:
        """Identifier for this storage provider."""
        return "storage"

    # -- locations -------------------------------------------------------------
    # A record's home is a URI this storage derives from the record's keys and
    # its parent's home; the index stores it and never derives one from another.

    def root(self) -> str:
        """Absolute path of this storage's local root (working copies live here)."""
        directory = os.path.expanduser(self.config.directory)
        if os.path.isabs(directory):
            return os.path.normpath(directory)
        from machinable.project import Project

        base = (
            os.path.expanduser(Project.get().config.directory)
            if Project.is_connected()
            else os.getcwd()
        )
        return os.path.abspath(os.path.join(base, directory))

    def root_uri(self) -> str:
        """URI of the root records are laid out under (disk: ``file://<root>``)."""
        return path_to_uri(self.root())

    def owns(self, uri: str | None) -> bool:
        """Whether ``uri`` is a home in this storage.

        The disk storage owns every local URI, wherever its directory is.
        """
        return uri is not None and _is_local(uri)

    def home(self, keys: RecordKeys, parent: IndexEntry | None = None) -> str:
        """The home URI of a new record with ``keys`` under ``parent``.

        The content-addressed layout: ``<identity>/<predicate>`` under the
        root, under the project's own keys for a project's top-level records,
        and under the parent's place in this storage for a nested record (a
        run-record under its interface).
        """
        segments = (
            sanitize_filename(keys.identity_key),
            sanitize_filename(keys.predicate_key),
        )
        if parent is None:
            return self.join(self.root_uri(), *segments)
        if parent.kind == "Project":
            # top-level interfaces are scoped under their project's identity
            # so that projects sharing one index do not collide in storage
            return self.join(
                self.root_uri(),
                sanitize_filename(parent.identity_key),
                sanitize_filename(parent.predicate_key),
                *segments,
            )
        return self.join(self.location(parent), *segments)

    def location(self, entry: IndexEntry) -> str:
        """Where ``entry``'s record is here: its home, or its place in a mirror."""
        if self.owns(entry.storage_uri):
            return entry.storage_uri
        parent = Index.get().get_by_id(entry.parent_id) if entry.parent_id else None
        return self.home(entry, parent)

    def local_path(self, uri: str) -> str:
        """The working directory of the record whose home is ``uri``.

        For a local home, the home itself; for a remote one, the same layout
        under :meth:`root`.
        """
        if _is_local(uri):
            return _path(uri)
        root = self.root_uri().rstrip("/")
        if uri != root and not uri.startswith(root + "/"):
            raise ValueError(f"'{uri}' is not a location in this storage ({root})")
        relative = uri[len(root) :].strip("/")
        return os.path.join(self.root(), *[p for p in relative.split("/") if p])

    def join(self, location: str, *names: str) -> str:
        """Join names onto a location (a path, or a URI with ``/``)."""
        names = tuple(n for n in names if n)
        if "://" in location:
            return posixpath.join(location, *names)
        return os.path.join(location, *names)

    def handle(self, uri: str) -> str:
        """The location the file methods take for ``uri`` (a path when local)."""
        return _path(uri) if _is_local(uri) else uri

    def is_remote(self, entry: IndexEntry) -> bool:
        """Whether ``entry``'s place in this storage is not a local directory."""
        return not _is_local(self.location(entry))

    # -- files -----------------------------------------------------------------
    # The methods another home implements (with the two atomic operations
    # below, for claims). Locations are what :meth:`handle` returns; names are
    # relative to them, ``/``-separated.

    def list(self, location: str, recursive: bool = True) -> Listing:
        """The files under ``location``: ``(name, size, version)``, sorted.

        With ``recursive=False``, the entries directly under it, directories
        as ``name/`` (size 0). Nothing there: an empty listing.
        """
        base = _path(location)
        listing: Listing = []
        if not recursive:
            try:
                with os.scandir(base) as entries:
                    for e in entries:
                        if e.is_dir(follow_symlinks=False):
                            listing.append((e.name + "/", 0, None))
                        elif e.is_file():
                            listing.append((e.name, e.stat().st_size, None))
            except OSError:
                return []
            return sorted(listing)
        for dirpath, _, filenames in os.walk(base, followlinks=False):
            relative = os.path.relpath(dirpath, base)
            parts = [] if relative == "." else relative.split(os.sep)
            for name in filenames:
                try:
                    size = os.stat(os.path.join(dirpath, name)).st_size
                except OSError:
                    continue
                listing.append(("/".join([*parts, name]), size, None))
        return sorted(listing)

    def read(self, location: str, name: str) -> bytes | Iterable[bytes] | None:
        """File ``name`` at ``location``, as bytes or chunks; None if absent."""
        try:
            with open(os.path.join(_path(location), *name.split("/")), "rb") as f:
                return f.read()
        except (FileNotFoundError, NotADirectoryError, IsADirectoryError):
            return None

    def write(self, location: str, name: str, data: bytes | IO[bytes]) -> None:
        """Write file ``name`` at ``location`` whole (bytes or a binary stream)."""
        path = os.path.join(_path(location), *name.split("/"))
        directory = os.path.dirname(path)
        os.makedirs(directory, exist_ok=True)
        temporary = os.path.join(directory, f".tmp-{random_str(12)}")
        with open(temporary, "wb") as f:
            if isinstance(data, bytes | bytearray | memoryview):
                f.write(data)
            else:
                shutil.copyfileobj(data, f)
        os.replace(temporary, path)

    def remove(self, location: str, name: str) -> None:
        """Remove file ``name`` at ``location`` (nothing if absent)."""
        _unlink(os.path.join(_path(location), *name.split("/")))

    # -- the two atomic operations (claims) --------------------------------------

    def exclusive_claims(self) -> bool:
        """Whether this storage's two atomic operations are exclusive."""
        return True

    def read_versioned(self, location: str) -> tuple[bytes, str | None] | None:
        """Read the file at ``location`` with this store's version of it.

        Returns ``None`` when nothing is there. The disk storage has no
        version of its own (``None``): the claim's generation is its version.
        """
        try:
            with open(_path(location), "rb") as f:
                return f.read(), None
        except (FileNotFoundError, NotADirectoryError):
            return None

    def create_if_absent(self, location: str, data: bytes) -> bool:
        """Write ``data`` at ``location`` only if nothing is there."""
        location = _path(location)
        directory = os.path.dirname(location)
        os.makedirs(directory, exist_ok=True)
        temporary = _write_temporary(directory, data)
        try:
            os.link(temporary, location)
        except FileExistsError:
            if not _linked(temporary):
                return False
        finally:
            _unlink(temporary)
        return True

    def replace_if_unchanged(self, location: str, data: bytes, version: str) -> bool:
        """Replace the file at ``location`` only if it is still ``version``."""
        try:
            generation = int(version)
        except (TypeError, ValueError):
            return False
        location = _path(location)
        directory = os.path.dirname(location)
        successor = f"{location}.{generation + 1}"
        temporary: str | None = _write_temporary(directory, data)
        try:
            try:
                os.link(temporary, successor)
            except FileExistsError:
                if not _linked(temporary):
                    self._complete_stalled_replace(location, successor, generation)
                    return False
            os.replace(temporary, location)
            temporary = None
        finally:
            if temporary is not None:
                _unlink(temporary)
        return True

    def _complete_stalled_replace(
        self, location: str, successor: str, generation: int
    ) -> None:
        """Finish a replace whose writer linked its generation and then died."""
        try:
            age = time.time() - os.stat(successor).st_mtime
        except OSError:
            return
        if age < STALLED_REPLACE_SECONDS:
            return
        from machinable.claims import Claim

        current = self.read_versioned(location)
        claim = Claim.from_bytes(current[0]) if current is not None else None
        if claim is None or claim.generation != generation:
            return
        directory = os.path.dirname(location)
        temporary = os.path.join(directory, f".tmp-{random_str(12)}")
        try:
            os.link(successor, temporary)
            os.replace(temporary, location)
        except OSError:
            _unlink(temporary)

    # -- records, over the file methods ------------------------------------------

    def read_bytes(self, location: str, name: str) -> bytes | None:
        """:meth:`read`, joined into bytes."""
        data = self.read(location, name)
        if data is None or isinstance(data, bytes):
            return data
        return b"".join(bytes(chunk) for chunk in data)

    def read_json(self, location: str, name: str) -> dict | None:
        """A JSON object file at ``location``, or None."""
        data = self.read_bytes(location, name)
        if data is None:
            return None
        try:
            value = json.loads(data.decode("utf-8"))
        except (UnicodeDecodeError, ValueError):
            return None
        return value if isinstance(value, dict) else None

    def record_files(self, location: str) -> dict[str, tuple[int, str | None]]:
        """A record's own files at ``location``: name -> (size, version).

        Without the records nested in it, claims and temporary files.
        """
        listing = self.list(location)
        nested = {
            name[: -len(MACHINABLE_MARKER) - 1]
            for name, _, _ in listing
            if name.endswith("/" + MACHINABLE_MARKER)
        }
        files = {}
        for name, size, version in listing:
            parts = name.split("/")
            if parts[-1].startswith(".tmp-") or ".claims" in parts[:-1]:
                continue
            if any("/".join(parts[:i]) in nested for i in range(1, len(parts))):
                continue
            files[name] = (size, version)
        return files

    def markers(self, location: str) -> dict[str, str]:
        """The run-status markers of the record at ``location``."""
        from machinable.claims import RUN_MARKERS

        present = {name for name, _, _ in self.list(location, recursive=False)}
        markers = {}
        for marker in RUN_MARKERS:
            if marker not in present:
                continue
            value = self.read_bytes(location, marker)
            if value is not None:
                markers[marker] = value.decode("utf-8", "replace").strip()
        return markers

    def walk(  # ty: ignore[invalid-method-override]
        self, location: str | None = None
    ) -> Iterator[str]:
        """Yield the location of every record at or under ``location`` (the root).

        For reindex, which hands each to :meth:`ingest`.
        """
        base = location if location is not None else self.handle(self.root_uri())
        if _is_local(base):
            yield from walk_markers(_path(base))
            return
        for name, _, _ in self.list(base):
            if name.startswith(CATALOG_DIRECTORY + "/"):
                continue
            if name == MACHINABLE_MARKER:
                yield base
            elif name.endswith("/" + MACHINABLE_MARKER):
                yield self.join(base, name[: -len(MACHINABLE_MARKER) - 1])

    def ingest(self, location: str, *, relations: bool = True) -> str | None:
        """Index the record at ``location``; its uuid, None when none is there.

        A local record is indexed in place. A remote one is indexed
        catalog-first: its files up to ``catalog_max_bytes`` (and its edge
        log) come into its working copy, and it is ``bytes_missing`` until the
        rest is fetched (by a read of the file, or ``fetch()``).
        """
        index = Index.get()
        if _is_local(location):
            return index.ingest_directory(
                _path(location), storage_id=self.id, relations=relations
            )
        local = self.local_path(location)
        found, missing = self._download(
            location, local, max_bytes=self.catalog_max_bytes()
        )
        if not found:
            return None
        uuid = index.ingest_directory(
            local, storage_id=self.id, relations=relations, storage_uri=location
        )
        if uuid is not None:
            index.set_bytes_missing(uuid, missing)
            _FETCHED.pop(uuid, None)
        return uuid

    def catalog_max_bytes(self) -> int:
        """Files up to this size are a record's catalog, brought by ingest."""
        return int(getattr(self.config, "catalog_max_bytes", CATALOG_MAX_BYTES))

    def sync(self, since: str | None = None) -> tuple[builtins.list[str], str | None]:
        """Index what was added to or changed in this storage since ``since``.

        Returns the uuids ingested or refreshed and the position to pass next
        time. A store with a catalog log reads the log after ``since``: a
        record new to this index is ingested; one it has is refreshed
        (:meth:`refresh`), since writers log a record again when they change
        it. Runs indexed from here that are not finished are refreshed too, as
        their heartbeats are not logged; finished runs and records nobody
        logged cost no reads. Any other store is walked whole.
        """
        if not self.catalog_log:
            return [u for u in map(self.ingest, self.walk()) if u is not None], None
        index = Index.get()
        root = self.handle(self.root_uri())
        log = self.join(root, CATALOG_DIRECTORY)
        # an entry can be listed after a later one (another writer's clock, a
        # slow write): those up to CATALOG_LOOKBACK_NS before ``since`` are read
        # too, once each per storage instance
        earliest = _log_time(since) - CATALOG_LOOKBACK_NS if since else 0
        names = sorted(
            n
            for n, _, _ in self.list(log, recursive=False)
            if not n.endswith("/")
            and (
                since is None
                or n > since
                or (_log_time(n) > earliest and n not in self._logged)
            )
        )
        ingested: builtins.list[str] = []
        seen: set[str] = set()
        unread, self._unread = self._unread, {}
        # (uuid, its location if known, its log entry if any)
        logged: builtins.list[tuple[str, str | None, str | None]] = [
            (uuid, location, None) for uuid, location in unread.items()
        ]
        logged += [(name.partition("-")[2], None, name) for name in names]
        for uuid, location, name in logged:
            if uuid in seen:
                continue
            seen.add(uuid)
            entry = index.get_by_id(uuid) if uuid else None
            if entry is not None and os.path.isdir(index.working_directory(entry)):
                if self.owns(entry.storage_uri):
                    refreshed = self._refresh_logged(entry)
                    ingested.extend(u for u in refreshed if u not in ingested)
                    seen.update(refreshed)
                continue
            if location is None and name is not None:
                relative = self.read_bytes(log, name)
                if relative is None:
                    continue
                location = self.join(root, relative.decode("utf-8").strip())
            if location is not None and self._ingest_logged(uuid, location):
                ingested.append(uuid)
        for entry in index.entries_under(self.root_uri(), kind="Execution"):
            if entry.record_id in seen:
                continue
            directory = index.working_directory(entry)
            if not os.path.isdir(directory) or os.path.exists(
                os.path.join(directory, "finished_at")
            ):
                continue
            refreshed = self._refresh_logged(entry)
            ingested.extend(u for u in refreshed if u not in ingested)
            seen.update(refreshed)
        position = max([n for n in (since, *names) if n is not None], default=None)
        if position is not None:
            # what an entry listed late can still be weighed against
            latest = _log_time(position) - CATALOG_LOOKBACK_NS
            self._logged = {
                n for n in self._logged | set(names) if _log_time(n) > latest
            }
        return ingested, position

    def _ingest_logged(self, uuid: str, location: str) -> bool:
        """Ingest a logged record; one that cannot be read yet is read next sync."""
        try:
            return self.ingest(location) is not None
        except Exception:  # noqa: BLE001 - a half-written record is read next sync
            if uuid:
                self._unread[uuid] = location
            return False

    def _refresh_logged(self, entry: IndexEntry) -> builtins.list[str]:
        try:
            return self.refresh(entry)
        except Exception:  # noqa: BLE001 - a half-written record is read next sync
            self._unread[entry.record_id] = self.handle(entry.storage_uri)
            return []

    def refresh(self, entry: IndexEntry) -> builtins.list[str]:
        """Bring an indexed record of this home up to date with the home.

        Reads its ``updated_at`` there (the single writer's sync signal, one
        small read). When it is later than the working copy's, a run not
        finished there gets its status markers (no artifacts); a run finished
        there is adopted (:meth:`adopt`: its catalog and its interface's), and
        any other record is ingested again, catalog-first. Nothing for a
        working copy as current as the home (the writer's always is), a home
        that is local, or a record not here yet. Returns the uuids of the
        working copies that changed (an adopted run's interface with it).
        """
        uri = entry.storage_uri
        if _is_local(uri) or not self.owns(uri):
            return []
        directory = Index.get().working_directory(entry)
        if not os.path.isdir(directory):
            return []
        location = self.handle(uri)
        home = self.read_bytes(location, UPDATED_AT_FILENAME)
        if home is None:
            return []
        updated_at = home.decode("utf-8", "replace").strip()
        local = load_file([directory, UPDATED_AT_FILENAME], None)
        if local is not None and not is_later(updated_at, str(local)):
            return []
        if entry.kind == "Execution":
            from machinable.claims import RunRecord

            markers = self.markers(location)
            if "finished_at" in markers:
                if not self.adopt(RunRecord(entry.record_id, location, markers)):
                    return []
                return [
                    entry.record_id,
                    *([entry.parent_id] if entry.parent_id else []),
                ]
            for name, value in markers.items():
                if str(load_file([directory, name], "")).strip() != value:
                    save_file([directory, name], value)
            save_file([directory, UPDATED_AT_FILENAME], updated_at)
            return [entry.record_id]
        return [entry.record_id] if self.ingest(location) is not None else []

    def follow(self, interval: float = 15.0, since: str | None = None) -> "Following":
        """Keep this index current with this storage: :meth:`sync` every ``interval`` s.

        Syncs once now, then in a background thread with this context's
        connections (the project, storages and index connected here), until
        the returned :class:`Following` is stopped (or used as a context
        manager). A sync that fails (the store cannot be reached) is tried
        again at the next interval.
        """
        return Following(self, interval, since)

    def _log(self, location: str, uuid: str) -> None:
        """Add a new or changed record to the catalog log."""
        root = self.handle(self.root_uri()).rstrip("/")
        self.write(
            self.join(root, CATALOG_DIRECTORY),
            f"{time.time_ns():020d}-{uuid}",
            location[len(root) :].strip("/").encode("utf-8"),
        )

    def _download(
        self,
        location: str,
        directory: str,
        max_bytes: int | None = None,
    ) -> tuple[bool, bool]:
        """Bring the record at ``location`` into ``directory``.

        Its own files, or those up to ``max_bytes`` (and the edge log).
        Returns whether the record is there and whether a file was left out.
        """
        files = self.record_files(location)
        if MACHINABLE_MARKER not in files:
            return False, False
        missing = False
        manifest: bytes | None = None
        on_demand: builtins.list[str] = []
        if max_bytes is not None and RESULTS_FILENAME in files:
            # results read on demand (tables, arrays) are not the catalog, and
            # chunks of them here that the home's manifest outdated go
            manifest = self.read_bytes(location, RESULTS_FILENAME)
            new = _manifest(manifest)
            try:
                old = read_manifest(directory)
            except ResultError:
                old = None
            for name in stale_files(directory, old, new):
                _unlink(os.path.join(directory, *name.split("/")))
            on_demand = data_files(new)
        # updated_at last: a copy that has the home's has the rest of it
        for name, (size, _) in sorted(
            files.items(), key=lambda f: (f[0] == UPDATED_AT_FILENAME, f[0])
        ):
            if max_bytes is not None and (
                (size > max_bytes and name not in CATALOG_FILES)
                or is_data_file(name, on_demand)
            ):
                # a large file fetched before stays (the record is not missing it)
                if _size(os.path.join(directory, *name.split("/"))) != size:
                    missing = True
                continue
            if name == RESULTS_FILENAME and manifest is not None:
                _write_local(directory, name, manifest)
                continue
            self._download_file(location, name, directory)
        return True, missing

    def _download_file(self, location: str, name: str, directory: str) -> bool:
        data = self.read(location, name)
        if data is None:
            return False
        target = os.path.join(directory, *name.split("/"))
        os.makedirs(os.path.dirname(target), exist_ok=True)
        temporary = os.path.join(os.path.dirname(target), f".tmp-{random_str(12)}")
        with open(temporary, "wb") as f:
            for chunk in [data] if isinstance(data, bytes) else data:
                f.write(bytes(chunk))
        os.replace(temporary, target)
        return True

    def _upload_file(self, path: str, location: str, name: str) -> bool:
        """Write a working copy's file to ``location`` unless pushed unchanged."""
        try:
            stat = os.stat(path)
        except OSError:
            return False
        key = self.join(location, name)
        signature = (stat.st_size, stat.st_mtime_ns)
        if self._pushed.get(key) == signature:
            return False
        with open(path, "rb") as f:
            self.write(location, name, f)
        self._pushed[key] = signature
        return True

    @staticmethod
    def _local_files(directory: str) -> builtins.list[str]:
        """A working copy's own files (no nested records or claims), last ones last."""
        names = []
        for dirpath, dirnames, filenames in os.walk(directory, followlinks=False):
            dirnames[:] = [
                d
                for d in dirnames
                if d != ".claims"
                and not os.path.exists(os.path.join(dirpath, d, MACHINABLE_MARKER))
            ]
            relative = os.path.relpath(dirpath, directory)
            parts = [] if relative == "." else relative.split(os.sep)
            names.extend(
                "/".join([*parts, name])
                for name in filenames
                if not name.startswith(".tmp-")
            )
        return sorted(
            names, key=lambda n: (LAST_FILES.index(n) + 1 if n in LAST_FILES else 0, n)
        )

    # -- the working copy --------------------------------------------------------

    def pull(self, uuid: str, into: str | None = None) -> str | None:
        """Bring a record into a working copy and return its ``local_uri``.

        Into the record's working directory unless ``into`` is given; a local
        home is its own working copy (no copy).
        """
        index = Index.get()
        entry = index.get_by_id(uuid)
        if entry is None:
            return None
        uri = self.location(entry)
        target = into if into is not None else self.local_path(uri)
        if _is_local(uri) and _same(_path(uri), target):
            return path_to_uri(target) if os.path.isdir(target) else None
        if not self.retrieve(uuid, target):
            return None
        if into is None:
            index.register_location(uuid, path_to_uri(target))
        return path_to_uri(target)

    def push(self, local: str, uuid: str) -> str:
        """Persist a working copy into this storage; the record's URI here.

        Only the files changed since this storage last pushed them,
        ``finished_at`` last; nothing when the working copy is the place. A
        store with a catalog log logs the record when it is new or changed.
        """
        entry = Index.get().get_by_id(uuid)
        if entry is None:
            return ""
        uri = self.location(entry)
        location = self.handle(uri)
        source = _path(local) if "://" in str(local) else os.path.abspath(local)
        if not os.path.isdir(source) or (_is_local(uri) and _same(location, source)):
            return uri
        # a record new to a store with a catalog log is logged once pushed
        fresh = (
            self.catalog_log
            and self.join(location, MACHINABLE_MARKER) not in self._pushed
            and self.read_bytes(location, MACHINABLE_MARKER) is None
        )
        changed = False
        for name in self._local_files(source):
            path = os.path.join(source, *name.split("/"))
            if self._upload_file(path, location, name) and name not in UNLOGGED_FILES:
                changed = True
        if fresh or (self.catalog_log and changed):
            self._log(location, uuid)
        return uri

    def write_through(self, uuid: str, directory: str, names: Iterable[str]) -> None:
        """Write files of a working copy through to the record's place here.

        A file missing from the working copy is removed there. Nothing when
        the working copy is the place. A store with a catalog log logs the
        change, unless it is only a heartbeat.
        """
        entry = Index.get().get_by_id(uuid)
        if entry is None:
            return
        uri = self.location(entry)
        location = self.handle(uri)
        if _is_local(uri) and _same(location, directory):
            return
        changed = False
        for name in names:
            path = os.path.join(directory, *name.split("/"))
            if os.path.isfile(path):
                written = self._upload_file(path, location, name)
            else:
                self.remove(location, name)
                self._pushed.pop(self.join(location, name), None)
                written = True
            changed = changed or (written and name not in UNLOGGED_FILES)
        if self.catalog_log and changed:
            self._log(location, uuid)

    # -- provider methods --------------------------------------------------------

    def delete(self, uuid: str) -> bool:
        """Remove the record ``uuid`` (and those nested in it) from this storage."""
        entry = Index.get().get_by_id(uuid)
        if entry is None:
            return False
        location = self.handle(self.location(entry))
        if _is_local(location):
            if os.path.isdir(location):
                shutil.rmtree(location)
                return True
            return False
        listing = self.list(location)
        for name, _, _ in listing:
            self.remove(location, name)
            self._pushed.pop(self.join(location, name), None)
        return bool(listing)

    def upload(self, interface: "Interface", related: bool | int = True) -> None:
        """Commit or update a record (and optionally its relations) to this storage."""
        if self.contains(cast(str, interface.uuid)):
            self.update(interface)
        else:
            self.commit(interface)

        if related:
            for r in interface.related(deep=int(related) == 2).all():
                self.upload(r, related=False)

    def download(
        self,
        uuid: str,
        destination: str | None = None,
        related: bool | int = True,
    ) -> builtins.list[str]:
        """Retrieve a record (and optionally its relations) from this storage."""
        index = None
        if destination is None:
            index = Index.get()
            download_directory = index._storage_root()
        else:
            download_directory = destination

        retrieved = []

        local_directory = os.path.join(download_directory, uuid)
        if self.retrieve(uuid, local_directory):
            retrieved.append(local_directory)

        if related:
            related_uuids = set()
            for r in load_file([local_directory, "related", "metadata.jsonl"], []):
                related_uuids.add(r["uuid"])
                related_uuids.add(r["related_uuid"])

            for r in related_uuids:
                if r == uuid:
                    continue
                retrieved.extend(
                    self.download(
                        r,
                        destination,
                        related=2 if int(related) == 2 else False,
                    )
                )

        if index is not None:
            for directory in retrieved:
                index.import_directory(directory, relations=bool(related))

        return retrieved

    def commit(self, interface: "Interface") -> None:
        """Push a record's working copy here: into its home, or as a mirror."""
        index = Index.get()
        # an already-materialized record has its row (an execution's run-record
        # keys are minted at dispatch and cannot be re-derived afterwards)
        record_id = interface.__model__.uuid if interface.is_materialized() else None
        entry = index.get_by_id(record_id) if record_id else None
        if entry is None:
            entry = index.materialize_from(interface).entry
        src = interface.local_directory(create=False)
        if src and os.path.isdir(src):
            self.push(src, entry.record_id)

    def update(self, interface: "Interface") -> None:
        """Refresh a previously committed record (defaults to :meth:`commit`)."""
        return self.commit(interface)

    def contains(self, uuid: str) -> bool:
        """True when this storage holds the record ``uuid``."""
        entry = Index.get().get_by_id(uuid)
        if entry is None:
            return False
        location = self.handle(self.location(entry))
        return self.read_bytes(location, MACHINABLE_MARKER) is not None

    def retrieve(self, uuid: str, local_directory: str) -> bool:
        """Copy a record's own files from this storage into ``local_directory``."""
        entry = Index.get().get_by_id(uuid)
        if entry is None:
            return False
        location = self.handle(self.location(entry))
        if _is_local(location) and _same(location, local_directory):
            return os.path.isdir(local_directory)
        return self._download(location, local_directory)[0]

    def fetch_file(self, entry: IndexEntry, name: str, directory: str) -> bool:
        """Bring one file, or the files under ``name`` (a folder), into ``directory``.

        Only those not here at the home's size, so it is cheap to call again:
        once ``name`` is whole, later calls in this process read nothing
        (until the record is ingested again). Clears the record's
        ``bytes_missing`` once it is all there. Returns whether the home has
        ``name``.
        """
        location = self.handle(self.location(entry))
        if _is_local(location) and _same(location, directory):
            return False
        name = name.replace(os.sep, "/").strip("/")
        if not name:
            return False
        if name in _FETCHED.get(entry.record_id, ()) and os.path.exists(
            os.path.join(directory, *name.split("/"))
        ):
            return True
        files = self.record_files(location)
        names = [n for n in files if n == name or n.startswith(name + "/")]
        for n in names:
            if _size(os.path.join(directory, *n.split("/"))) != files[n][0]:
                self._download_file(location, n, directory)
        if names:
            _FETCHED.setdefault(entry.record_id, set()).add(name)
        max_bytes = self.catalog_max_bytes()
        if files and all(
            (local := _size(os.path.join(directory, *n.split("/")))) == size
            or (local is not None and size <= max_bytes)
            for n, (size, _) in files.items()
        ):
            Index.get().set_bytes_missing(entry.record_id, False)
        return bool(names)

    def fetch_files(
        self, entry: IndexEntry, names: Iterable[str], directory: str
    ) -> builtins.list[str]:
        """Bring files ``names`` into ``directory`` when they are not there.

        By name, without listing the record (a result's chunks), several at
        once. Returns the names the home has.
        """
        location = self.handle(self.location(entry))
        if _is_local(location) and _same(location, directory):
            return []
        names = builtins.list(dict.fromkeys(names))
        present = [
            n for n in names if os.path.isfile(os.path.join(directory, *n.split("/")))
        ]
        wanted = [n for n in names if n not in present]
        if len(wanted) > 1:
            from concurrent.futures import ThreadPoolExecutor

            with ThreadPoolExecutor(max_workers=min(8, len(wanted))) as pool:
                found = builtins.list(
                    pool.map(
                        lambda n: self._download_file(location, n, directory), wanted
                    )
                )
        else:
            found = [self._download_file(location, n, directory) for n in wanted]
        return present + [n for n, ok in zip(wanted, found) if ok]

    def search_for(self, interface: "Interface") -> builtins.list[str]:
        """Locate records for ``interface`` (remote backends implement this)."""
        raise NotImplementedError()

    # -- what the claim protocol reads -------------------------------------------

    def interface_location(self, interface: "Interface") -> str | None:
        """Where ``interface``'s record is in this storage, once it is indexed."""
        if not interface.is_materialized():
            return None
        entry = Index.get().get_by_id(cast(str, interface.uuid))
        if entry is None:
            return None
        try:
            return self.handle(self.location(entry))
        except ValueError:
            return None

    def run_records(self, interface: "Interface") -> builtins.list["RunRecord"]:
        """The run-records of ``interface`` in this storage, with their markers."""
        from machinable.claims import RunRecord

        location = self.interface_location(interface)
        if location is None:
            return []
        runs: list[RunRecord] = []
        for identity, _, _ in self.list(location, recursive=False):
            if not identity.endswith("/") or identity.startswith("."):
                continue
            identity_location = self.join(location, identity.rstrip("/"))
            for predicate, _, _ in self.list(identity_location, recursive=False):
                if not predicate.endswith("/") or predicate.startswith("."):
                    continue
                directory = self.join(identity_location, predicate.rstrip("/"))
                header = self.read_json(directory, "id.json")
                if header is None or header.get("kind") != "Execution":
                    continue
                runs.append(
                    RunRecord(header["uuid"], directory, self.markers(directory))
                )
        return runs

    def mark_run(self, run: "RunRecord", marker: str, value: str) -> None:
        """Write a status marker into a run-record another dispatcher made.

        Used for ``abandoned_at`` when a claim is taken over. A working copy
        of a remote run gets it too.
        """
        import arrow

        updated_at = str(arrow.now())
        self.write(run.location, marker, value.encode())
        self.write(run.location, UPDATED_AT_FILENAME, updated_at.encode())
        if self.catalog_log:
            self._log(run.location, run.record_id)
        if not _is_local(run.location):
            local = self.local_path(run.location)
            if os.path.isdir(local):
                save_file([local, marker], value)
                save_file([local, UPDATED_AT_FILENAME], updated_at)

    def adopt(self, run: "RunRecord") -> bool:
        """Index a run-record found by a look, so the local index knows it.

        Returns whether the index now holds it. A local record is ingested in
        place. A remote one is (re)ingested catalog-first, since an index may
        know it from before it finished, and its interface's catalog (its
        ``cached`` marker, its small results) is refreshed with it.
        """
        index = Index.get()
        local = _is_local(run.location)
        if local and index.get_by_id(run.record_id) is not None:
            return True
        try:
            if self.ingest(run.location) is None:
                return index.get_by_id(run.record_id) is not None
        except Exception:  # noqa: BLE001 - a half-written record is adopted next look
            return index.get_by_id(run.record_id) is not None
        entry = index.get_by_id(run.record_id)
        if not local and entry is not None and entry.parent_id:
            parent = index.get_by_id(entry.parent_id)
            if parent is not None:
                try:
                    self.ingest(self.handle(self.location(parent)))
                except Exception:  # noqa: BLE001 - its results are read on demand
                    pass
        return True


STALLED_REPLACE_SECONDS = 30.0


def _is_local(location: str) -> bool:
    """A location that is a local path (or a ``file://``/``scratch://`` URI)."""
    return location.startswith(_LOCAL_SCHEMES) or "://" not in location


def _path(location: str) -> str:
    return uri_to_path(location) if "://" in location else location


def _same(a: str, b: str) -> bool:
    return os.path.abspath(a) == os.path.abspath(b)


def _log_time(name: str) -> int:
    """The time (ns) of a catalog-log entry ``<time>-<uuid>``; 0 if unreadable."""
    try:
        return int(name.partition("-")[0])
    except ValueError:
        return 0


def _manifest(data: bytes | None) -> dict | None:
    try:
        manifest = json.loads(data.decode("utf-8")) if data is not None else None
    except (UnicodeDecodeError, ValueError):
        return None
    return manifest if isinstance(manifest, dict) else None


def _write_local(directory: str, name: str, data: bytes) -> None:
    target = os.path.join(directory, *name.split("/"))
    os.makedirs(os.path.dirname(target), exist_ok=True)
    temporary = os.path.join(os.path.dirname(target), f".tmp-{random_str(12)}")
    with open(temporary, "wb") as f:
        f.write(data)
    os.replace(temporary, target)


def _size(path: str) -> int | None:
    """The size of the file at ``path``; None when there is none."""
    try:
        return os.stat(path).st_size if os.path.isfile(path) else None
    except OSError:
        return None


class Following:
    """A storage followed in the background (:meth:`Storage.follow`).

    ``position`` is the catalog position reached, ``error`` the last sync's
    failure (None after a sync that worked). ``stop()`` ends it.
    """

    def __init__(self, storage: Storage, interval: float, since: str | None = None):
        self.storage = storage
        self.interval = interval
        self.error: Exception | None = None
        self.position = storage.sync(since)[1]
        self._stopped = threading.Event()
        context = contextvars.copy_context()
        self._thread = threading.Thread(
            target=context.run, args=(self._run,), name="machinable-follow", daemon=True
        )
        self._thread.start()

    def _run(self) -> None:
        while not self._stopped.wait(self.interval):
            try:
                self.position = self.storage.sync(self.position)[1]
                self.error = None
            except Exception as ex:  # noqa: BLE001 - the store cannot be read now
                self.error = ex

    def stop(self) -> None:
        """End following (after a sync in progress)."""
        self._stopped.set()
        if self._thread is not threading.current_thread():
            self._thread.join()

    def __enter__(self) -> "Following":
        return self

    def __exit__(self, *exc) -> None:
        self.stop()


def _write_temporary(directory: str, data: bytes) -> str:
    """Write ``data`` to a fresh temporary file in ``directory``."""
    os.makedirs(directory, exist_ok=True)
    path = os.path.join(directory, f".tmp-{random_str(12)}")
    with open(path, "xb") as f:
        f.write(data)
    return path


def _linked(temporary: str) -> bool:
    try:
        return os.stat(temporary).st_nlink == 2
    except OSError:
        return False


def _unlink(path: str | None) -> None:
    if path is None:
        return
    try:
        os.unlink(path)
    except OSError:
        pass


def claim_storages() -> list[Storage]:
    """The storages dispatch looks in: the home first, then the mirrors.

    The home is the innermost connected storage (``Storage.get()``), the
    mirrors those connected around it, from the inside out; the default
    storage when none is connected. The claim goes to the first of them that
    can claim exclusively.
    """
    connected = Storage.connected()
    return list(reversed(connected)) if connected else [Storage.get()]


# The least time between two syncs of one storage into one index by
# :func:`sync_homes`, so a lookup that misses in a loop is cheap.
SYNC_HOMES_SECONDS = 5.0
# (storage root, index database) -> (catalog position, monotonic time of the sync)
_HOMES_SYNCED: dict[tuple[str, str], tuple[str | None, float]] = {}


def sync_homes(force: bool = False) -> builtins.list[str]:
    """Index what was added to the claim storages since this process last looked.

    For a lookup by record id that misses (a run another machine made in the
    shared home): each claim storage is synced (:meth:`Storage.sync`) from the
    position this process reached in it for the connected index, at most every
    ``SYNC_HOMES_SECONDS`` unless ``force``. Only a storage with a catalog log
    (an object store), which reads its log since then; a storage without one
    would be walked whole, which is what an explicit ``storage.sync()`` is for.
    Returns the uuids ingested or refreshed; a storage that cannot be read now
    is skipped.
    """
    index = Index.get()
    database = str(index._resolved_database())
    now = time.monotonic()
    ingested: builtins.list[str] = []
    for storage in claim_storages():
        if not storage.catalog_log:
            continue
        key = (storage.root_uri(), database)
        position, last = _HOMES_SYNCED.get(key, (None, None))
        if not force and last is not None and now - last < SYNC_HOMES_SECONDS:
            continue
        try:
            found, position = storage.sync(position)
        except Exception:  # noqa: BLE001 - the store cannot be read now
            continue
        _HOMES_SYNCED[key] = (position, now)
        ingested.extend(u for u in found if u not in ingested)
    return ingested


def ingest_by_id(uuid: str) -> bool:
    """Index the record ``uuid`` from the claim storages; False when none has it.

    For a lookup by record id that misses because the record was made under
    another index over the same storage (another machine's). A storage with a
    catalog log (an object store) is synced (:func:`sync_homes`, now); one
    without is walked for the record's marker, which holds its uuid, and that
    record (with the records nested in it, its runs) is ingested as a reindex
    of it would. True at once when the index already has it.
    """
    index = Index.get()
    if index.get_by_id(uuid) is not None:
        return True
    sync_homes(force=True)
    if index.get_by_id(uuid) is not None:
        return True
    for storage in claim_storages():
        if storage.catalog_log:
            continue
        for location in storage.walk():
            marker = storage.read_bytes(location, MACHINABLE_MARKER)
            if marker is None or marker.decode("utf-8", "replace").strip() != uuid:
                continue
            for nested in storage.walk(location):
                storage.ingest(nested)
            return index.get_by_id(uuid) is not None
    return False


def storage_for(uri: str) -> Storage:
    """The storage that owns home ``uri``: the first of :func:`claim_storages`.

    A local URI no connected storage owns belongs to a disk storage.
    """
    for storage in claim_storages():
        if storage.owns(uri):
            return storage
    if _is_local(uri):
        return Storage()
    raise ValueError(f"No connected storage holds '{uri}'")


def remote_home(entry: IndexEntry | None) -> Storage | None:
    """The storage of ``entry``'s home when the home is not its working copy."""
    if entry is None or _is_local(entry.storage_uri):
        return None
    try:
        return storage_for(entry.storage_uri)
    except ValueError:
        return None


def fetch(uuid: str, directory: str) -> bool:
    """Retrieve ``uuid`` into ``directory``: from its home, else from a mirror."""
    index = Index.get()
    entry = index.get_by_id(uuid)
    storages = list(reversed(Storage.connected()))
    if entry is not None:
        home = remote_home(entry)
        if home is not None and all(s is not home for s in storages):
            storages.insert(0, home)
    for storage in storages:
        if storage.retrieve(uuid, directory):
            if (
                entry is not None
                and entry.bytes_missing
                and _same(directory, index.local_directory(uuid))
            ):
                index.set_bytes_missing(uuid, False)
            return True
    return False
