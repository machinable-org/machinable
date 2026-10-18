"""Storage: durable homes for records, and the working copies runs write in."""

import builtins
import json
import os
import posixpath
import shutil
import time
from collections.abc import Iterable, Iterator
from typing import IO, TYPE_CHECKING, NamedTuple, Protocol, cast

from pydantic import BaseModel

from machinable import schema
from machinable.api.models import IndexEntry
from machinable.index import Index
from machinable.interface import Interface, get_inherits
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
CATALOG_FILES = ("related/metadata.jsonl",)
CATALOG_MAX_BYTES = 1024 * 1024
# pushed last, so a home that has it has the rest of the run
LAST_FILES = ("finished_at",)
_LOCAL_SCHEMES = ("file://", "scratch://")


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
        return uuid

    def catalog_max_bytes(self) -> int:
        """Files up to this size are a record's catalog, brought by ingest."""
        return int(getattr(self.config, "catalog_max_bytes", CATALOG_MAX_BYTES))

    def sync(self, since: str | None = None) -> tuple[builtins.list[str], str | None]:
        """Index the records added to this storage since position ``since``.

        Returns the uuids ingested and the position to pass next time. A
        store with a catalog log reads the log after ``since``, skipping
        records this index already has; any other store is walked whole.
        """
        if not self.catalog_log:
            return [u for u in map(self.ingest, self.walk()) if u is not None], None
        index = Index.get()
        root = self.handle(self.root_uri())
        log = self.join(root, CATALOG_DIRECTORY)
        names = sorted(
            n
            for n, _, _ in self.list(log, recursive=False)
            if not n.endswith("/") and (since is None or n > since)
        )
        ingested = []
        for name in names:
            uuid = name.partition("-")[2]
            if uuid and index.get_by_id(uuid) is not None:
                if os.path.isdir(index.local_directory(uuid)):
                    continue
            relative = self.read_bytes(log, name)
            if relative is None:
                continue
            found = self.ingest(self.join(root, relative.decode("utf-8").strip()))
            if found is not None:
                ingested.append(found)
        return ingested, names[-1] if names else since

    def _log(self, location: str, uuid: str) -> None:
        """Add a new record to the catalog log."""
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
        for name, (size, _) in sorted(files.items()):
            if max_bytes is not None and size > max_bytes and name not in CATALOG_FILES:
                missing = True
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

    def _upload_file(self, path: str, location: str, name: str) -> None:
        """Write a working copy's file to ``location`` unless pushed unchanged."""
        try:
            stat = os.stat(path)
        except OSError:
            return
        key = self.join(location, name)
        signature = (stat.st_size, stat.st_mtime_ns)
        if self._pushed.get(key) == signature:
            return
        with open(path, "rb") as f:
            self.write(location, name, f)
        self._pushed[key] = signature

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
        return sorted(names, key=lambda n: (n in LAST_FILES, n))

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
        ``finished_at`` last; nothing when the working copy is the place.
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
        for name in self._local_files(source):
            self._upload_file(os.path.join(source, *name.split("/")), location, name)
        if fresh:
            self._log(location, uuid)
        return uri

    def write_through(self, uuid: str, directory: str, names: Iterable[str]) -> None:
        """Write files of a working copy through to the record's place here.

        A file missing from the working copy is removed there. Nothing when
        the working copy is the place.
        """
        entry = Index.get().get_by_id(uuid)
        if entry is None:
            return
        uri = self.location(entry)
        location = self.handle(uri)
        if _is_local(uri) and _same(location, directory):
            return
        for name in names:
            path = os.path.join(directory, *name.split("/"))
            if os.path.isfile(path):
                self._upload_file(path, location, name)
            else:
                self.remove(location, name)
                self._pushed.pop(self.join(location, name), None)

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
        """Bring one file, or the files under ``name``, into ``directory``.

        Clears the record's ``bytes_missing`` once it is all there.
        """
        location = self.handle(self.location(entry))
        if _is_local(location) and _same(location, directory):
            return False
        name = name.replace(os.sep, "/").strip("/")
        files = self.record_files(location)
        names = [n for n in files if n == name or n.startswith(name + "/")]
        for n in names:
            self._download_file(location, n, directory)
        if files and all(
            os.path.isfile(os.path.join(directory, *n.split("/"))) for n in files
        ):
            Index.get().set_bytes_missing(entry.record_id, False)
        return bool(names)

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

        from machinable.format import UPDATED_AT_FILENAME

        updated_at = str(arrow.now())
        self.write(run.location, marker, value.encode())
        self.write(run.location, UPDATED_AT_FILENAME, updated_at.encode())
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
