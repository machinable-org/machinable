from typing import TYPE_CHECKING, List, Literal, Optional, Union

import os
import shutil
from dataclasses import dataclass

import arrow
from machinable import schema
from machinable.config import Field
from machinable.element import extract, get_lineage
from machinable.index import Index
from machinable.interface import Interface
from machinable.settings import get_settings
from machinable.types import ElementType, TimestampType, VersionType
from machinable.utils import save_file

if TYPE_CHECKING:
    from machinable.interface import Interface


class Storage(Interface):
    kind = "Storage"
    default = get_settings().default_storage

    @dataclass
    class Config:
        directory: str = "./storage"
        remotes: Union[None, ElementType, List[ElementType]] = None
        index: Optional[ElementType] = Field(
            default_factory=lambda: get_settings().default_index
        )

    def __init__(
        self,
        version: VersionType = None,
    ):
        super().__init__(version=version)
        self.__model__ = schema.Storage(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            lineage=get_lineage(self),
        )
        self._index = None
        self._remotes = None

    @property
    def index(self) -> Optional["Index"]:
        if self.config.index is None:
            return None
        if self._index is None:
            self._index = Index.make(*extract(self.config.index))
        return self._index

    @property
    def remotes(self):
        if self._remotes is None:
            if self.config.remotes is None or len(self.config.remotes) == 0:
                self._remotes = []
            else:
                remotes = self.config.remotes
                if isinstance(remotes[0], str):
                    remotes = [remotes]

                self._remotes = [Storage.make(*spec) for spec in remotes]

        return self._remotes

    def local_directory(
        self, uuid: str, *append: str, create: bool = False
    ) -> Optional[str]:
        directory = os.path.join(self.config.directory, uuid, *append)
        if create:
            os.makedirs(directory, exist_ok=True)
        return directory

    def commit(self, interface: "Interface") -> bool:
        # ensure that configuration has been parsed
        assert interface.config is not None
        assert interface.predicate is not None

        # if newly created, commit to index and remotes
        created = False
        if not self.index.find(interface.uuid):
            self.on_commit(interface)
            self.index.commit(interface.__model__)
            for k, v in interface.__related__.items():
                if v is None:
                    continue
                r = interface.__relations__[k]
                if not r.multiple:
                    v = [v]

                for u in [i.commit().uuid for i in v]:
                    if r.inverse:
                        self.index.create_relation(r.name, u, interface.uuid)
                    else:
                        self.index.create_relation(r.name, interface.uuid, u)
            created = True

        for remote in self.remotes:
            remote.commit(interface)

        return created

    def on_commit(self, interface: "Interface") -> None:
        directory = self.local_directory(interface.uuid)
        interface.to_directory(directory)

    def contains(self, uuid: str) -> bool:
        return os.path.exists(self.local_directory(uuid))

    def retrieve(
        self, uuid: str, target_directory: Optional[str] = None
    ) -> bool:
        if target_directory is None:
            target_directory = self.local_directory(uuid)

        if not self.contains(uuid):
            # try to retrieve from remotes
            available = False
            for remote in self.remotes:
                if (
                    remote.index
                    and remote.index.find(uuid)
                    and remote.retrieve(uuid, target_directory)
                ):
                    available = True
                    break

            if not available:
                return False

        self.on_retrieve(uuid, target_directory)

        return True

    def on_retrieve(self, uuid: str, target_directory: str) -> None:
        local_directory = self.local_directory(uuid)

        if os.path.normcase(
            os.path.normpath(target_directory)
        ) == os.path.normcase(os.path.normpath(local_directory)):
            return

        shutil.copytree(local_directory, target_directory)

    def update_status(
        self,
        uuid: str,
        status: Literal["started", "heartbeat", "finished"] = "heartbeat",
        timestamp: Optional[TimestampType] = None,
    ) -> None:
        for remote in self.remotes:
            remote.update_status(uuid, status, timestamp)

        if timestamp is None:
            timestamp = arrow.now()
        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)

        if status == "started":
            self.on_mark_started(uuid, timestamp)
        elif status == "heartbeat":
            self.on_mark_heartbeat(uuid, timestamp)
        elif status == "finished":
            self.on_mark_finished(uuid, timestamp)
        else:
            raise ValueError(
                f"Invalid status {status}; must be one of 'started', 'heartbeat', 'finished'"
            )

    def on_mark_started(self, uuid: str, timestamp: TimestampType) -> None:
        save_file(
            self.local_directory(uuid, "started_at"),
            str(timestamp) + "\n",
            # starting event can occur multiple times
            mode="a",
        )

    def on_mark_heartbeat(self, uuid: str, timestamp: TimestampType) -> None:
        save_file(
            self.local_directory(uuid, "heartbeat_at"),
            str(timestamp),
            mode="w",
        )

    def on_mark_finished(self, uuid: str, timestamp: TimestampType) -> None:
        save_file(
            self.local_directory(uuid, "finished_at"),
            str(timestamp),
            mode="w",
        )
