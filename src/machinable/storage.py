"""Storage: durable homes for record directories."""

import os
from typing import cast

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
    uri_to_path,
    walk_markers,
)


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


def fetch(uuid: str, directory: str) -> bool:
    """Retrieve ``uuid`` into ``directory`` from any connected storage."""
    available = False
    for storage in Storage.connected():
        if storage.retrieve(uuid, directory):
            available = True
            break

    return available
