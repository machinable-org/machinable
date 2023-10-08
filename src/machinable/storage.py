from typing import TYPE_CHECKING, List, Optional

import os

from machinable import schema
from machinable.element import Element, get_lineage
from machinable.interface import Interface
from machinable.types import VersionType


class Storage(Interface):
    kind = "Storage"
    default = None

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

    def commit(self, interface: "Interface") -> None:
        ...

    def update(self, interface: "Interface") -> None:
        ...

    def contains(self, uuid: str) -> bool:
        ...
        return False

    def retrieve(self, uuid: str, local_directory: str) -> bool:
        ...
        return False
