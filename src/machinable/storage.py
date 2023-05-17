from typing import TYPE_CHECKING, List, Optional, Union

import os
import shutil
from dataclasses import dataclass

from machinable import schema
from machinable.config import Field
from machinable.element import Element, extract, get_lineage
from machinable.index import Index
from machinable.settings import get_settings
from machinable.types import ElementType, VersionType

if TYPE_CHECKING:
    from machinable.interface import Interface


class Storage(Element):
    kind = "Storage"
    default = get_settings().default_storage

    @dataclass
    class Config:
        directory: str = "./storage"
        remotes: Optional[List[ElementType]] = None
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
            self._remotes = [
                Storage.make(*spec) for spec in self.config.remotes or []
            ]

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
        if not self.index.find(interface.uuid):
            self.on_commit(interface)
            if self.index.commit(interface.__model__):
                for k, v in interface.__related__.items():
                    # todo: how do we handle correct reverse insertation?
                    if hasattr(v, "uuid"):
                        self.index.create_relation(
                            interface.uuid,
                            v.commit().uuid,
                            interface.__relations__[k].key,
                        )
                    elif v is not None:
                        self.index.create_relation(
                            interface.uuid,
                            [i.commit().uuid for i in v],
                            interface.__relations__[k].key,
                        )
            for remote in self.remotes:
                remote.commit(interface)
            return True

        return False

    def on_commit(self, interface: "Interface") -> None:
        directory = self.local_directory(interface.uuid)
        interface.to_directory(directory)

    def retrieve(
        self, uuid: str, target_directory: Optional[str] = None
    ) -> Optional[bool]:
        if not self.index.find(uuid):
            return None

        local_directory = self.local_directory(uuid)
        if target_directory is None:
            target_directory = local_directory

        if not os.path.exists(local_directory):
            available = False
            for remote in self.remotes:
                if remote.retrieve(uuid, local_directory):
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
