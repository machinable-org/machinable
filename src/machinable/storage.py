"""Storage: durable homes for record directories."""

import os
from typing import TYPE_CHECKING, cast

from pydantic import BaseModel

from machinable import schema
from machinable.api.models import IndexEntry
from machinable.index import Index
from machinable.interface import Interface, get_inherits
from machinable.types import VersionType
from machinable.utils import (
    is_directory_version,
    load_file,
    path_to_uri,
    random_str,
    save_file,
    uri_to_path,
    walk_markers,
)

if TYPE_CHECKING:
    from machinable.claims import RunRecord


class Storage(Interface):
    """Durable home for record directories, and where results live.

    The base class is the local-filesystem backend rooted at ``./storage``
    under the project; connect ``Storage("/other/location")`` to relocate
    results. Remote backends (S3, Globus, ...) override the provider methods
    and act as mirrors or durable homes.
    """

    kind = "Storage"
    _ambient = True
    default = None

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

    # -- provider interface ------------------------------------------------
    # The unit of operation is an interface directory keyed by uuid. Remote
    # backends (e.g. S3) override pull/push/walk/read/write/delete; the default
    # implementation is a local-filesystem passthrough.

    def root(self) -> str:
        """Absolute path to this storage's root directory."""
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

    def home_uri(self, uuid: str) -> str:
        """Durable URI a new interface directory should occupy.

        Generic fallback used by providers that do not derive a content-addressed
        path; the default disk Storage lets the Index generate the layout.
        """
        return path_to_uri(os.path.join(self.root(), uuid))

    def walk(self):  # ty: ignore[invalid-method-override]
        """Yield every ``.machinable`` directory under this storage (for reindex)."""
        yield from walk_markers(self.root())

    def pull(self, uuid: str, into: str | None = None) -> str | None:
        """Materialize a local working copy and return its ``local_uri``.

        Disk passthrough: the durable directory is already local. When ``into``
        is given and differs, the directory is copied there (the hook a remote
        backend uses to populate a working/scratch location).
        """
        entry = Index.get().get_by_id(uuid)
        if entry is None:
            return None
        try:
            path = uri_to_path(entry.storage_uri)
        except ValueError:
            return None  # remote provider not implemented
        if into is not None and os.path.abspath(into) != os.path.abspath(path):
            if not self.retrieve(uuid, into):
                return None
            return path_to_uri(into)
        return path_to_uri(path)

    def push(self, local: str, uuid: str) -> str:
        """Persist a working copy to durable storage; return the ``storage_uri``.

        Disk passthrough copies only when the working path differs from the
        durable home (e.g. after a scratch relocation).
        """
        entry = Index.get().get_by_id(uuid)
        if entry is None:
            return ""
        dst = uri_to_path(entry.storage_uri)
        src = uri_to_path(local) if "://" in str(local) else os.path.abspath(local)
        if os.path.abspath(src) != os.path.abspath(dst) and os.path.isdir(src):
            import shutil

            os.makedirs(dst, exist_ok=True)
            shutil.copytree(src, dst, symlinks=True, dirs_exist_ok=True)
        return entry.storage_uri

    def delete(self, uuid: str) -> bool:
        """Remove the durable directory for ``uuid`` from this storage."""
        entry = Index.get().get_by_id(uuid)
        if entry is None:
            return False
        try:
            path = uri_to_path(entry.storage_uri)
        except ValueError:
            return False
        if os.path.isdir(path):
            import shutil

            shutil.rmtree(path)
            return True
        return False

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
    ) -> list[str]:
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
        """Copy a record's working directory into its durable home."""
        index = Index.get()
        # an already-materialized record has its row (an execution's run-record
        # keys are minted at dispatch and cannot be re-derived afterwards)
        record_id = interface.__model__.uuid if interface.is_materialized() else None
        entry = index.get_by_id(record_id) if record_id else None
        if entry is None:
            entry = index.materialize_from(interface).entry
        src = interface.local_directory(create=False)
        if src and os.path.isdir(src):
            dst = uri_to_path(entry.storage_uri)
            if os.path.abspath(src) != os.path.abspath(dst):
                import shutil

                os.makedirs(dst, exist_ok=True)
                for name in os.listdir(src):
                    s = os.path.join(src, name)
                    d = os.path.join(dst, name)
                    if os.path.isdir(s):
                        shutil.copytree(s, d, symlinks=True, dirs_exist_ok=True)
                    else:
                        shutil.copy2(s, d)

    def update(self, interface: "Interface") -> None:
        """Refresh a previously committed record (defaults to :meth:`commit`)."""
        return self.commit(interface)

    def contains(self, uuid: str) -> bool:
        """True when the index knows ``uuid``."""
        return Index.get().get_by_id(uuid) is not None

    def retrieve(self, uuid: str, local_directory: str) -> bool:
        """Copy a record's files from this storage into ``local_directory``."""
        entry = Index.get().get_by_id(uuid)
        if entry is None:
            return False
        try:
            src = uri_to_path(entry.storage_uri)
        except ValueError:
            return False  # remote provider not implemented
        if not os.path.isdir(src):
            return False
        import shutil

        os.makedirs(local_directory, exist_ok=True)
        for name in os.listdir(src):
            s = os.path.join(src, name)
            d = os.path.join(local_directory, name)
            if os.path.isdir(s):
                shutil.copytree(s, d, symlinks=True, dirs_exist_ok=True)
            else:
                shutil.copy2(s, d)
        return True

    def search_for(self, interface: "Interface") -> list[str]:
        """Locate records for ``interface`` (remote backends implement this)."""
        raise NotImplementedError()

    def exclusive_claims(self) -> bool:
        """Whether this storage's two atomic operations are exclusive."""
        return True

    def interface_location(self, interface: "Interface") -> str | None:
        """Where ``interface``'s record directory is in this storage, if here."""
        if not interface.is_materialized():
            return None
        entry = Index.get().get_by_id(cast(str, interface.uuid))
        if entry is None:
            return None
        try:
            return uri_to_path(entry.storage_uri)
        except ValueError:
            return None

    def read_versioned(self, location: str) -> tuple[bytes, str | None] | None:
        """Read the file at ``location`` with this store's version of it.

        Returns ``None`` when nothing is there. The disk storage has no
        version of its own (``None``): the claim's generation is its version.
        """
        try:
            with open(location, "rb") as f:
                return f.read(), None
        except (FileNotFoundError, NotADirectoryError):
            return None

    def create_if_absent(self, location: str, data: bytes) -> bool:
        """Write ``data`` at ``location`` only if nothing is there."""
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
        import time

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

    def run_records(self, interface: "Interface") -> list["RunRecord"]:
        """The run-records of ``interface`` in this storage, with their markers."""
        from machinable.claims import RUN_MARKERS, RunRecord
        from machinable.format import read_id

        location = self.interface_location(interface)
        if location is None:
            return []
        runs: list[RunRecord] = []
        for identity in _listdir(location):
            if identity.startswith("."):
                continue
            identity_directory = os.path.join(location, identity)
            for predicate in _listdir(identity_directory):
                directory = os.path.join(identity_directory, predicate)
                header = read_id(directory)
                if header is None or header.get("kind") != "Execution":
                    continue
                markers = {}
                for marker in RUN_MARKERS:
                    value = load_file([directory, marker], None)
                    if value is not None:
                        markers[marker] = str(value).strip()
                runs.append(RunRecord(header["uuid"], directory, markers))
        return runs

    def mark_run(self, run: "RunRecord", marker: str, value: str) -> None:
        """Write a status marker into a run-record another dispatcher made.

        Used for ``abandoned_at`` when a claim is taken over.
        """
        from machinable.format import bump_updated_at

        save_file([run.location, marker], value)
        bump_updated_at(run.location)

    def adopt(self, run: "RunRecord") -> bool:
        """Index a run-record found by a look, so the local index knows it.

        Returns whether the index now holds it. The disk storage ingests the
        directory in place.
        """
        index = Index.get()
        if index.get_by_id(run.record_id) is not None:
            return True
        try:
            return index.ingest_directory(run.location) is not None
        except Exception:  # noqa: BLE001 - a half-written record is adopted next look
            return False


STALLED_REPLACE_SECONDS = 30.0


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


def _listdir(directory: str) -> list[str]:
    try:
        return sorted(os.listdir(directory))
    except OSError:
        return []


def claim_storages() -> list[Storage]:
    """The storages dispatch looks in, in connection order.

    Every connected storage, or the default one when none is connected.
    """
    connected = Storage.connected()
    return list(connected) if connected else [Storage.get()]


def fetch(uuid: str, directory: str) -> bool:
    """Retrieve ``uuid`` into ``directory`` from any connected storage."""
    available = False
    for storage in Storage.connected():
        if storage.retrieve(uuid, directory):
            available = True
            break

    return available
