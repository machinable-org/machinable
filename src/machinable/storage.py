from typing import TYPE_CHECKING, List, Optional

import os

from machinable import schema
from machinable.element import Element, get_lineage
from machinable.settings import get_settings
from machinable.types import VersionType

if TYPE_CHECKING:
    from machinable.interface import Interface


class Storage(Element):
    kind = "Storage"
    default = get_settings().default_storage

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

    @classmethod
    def active(cls) -> List["Storage"]:
        connected = cls.connected()
        if len(connected) > 0:
            return connected

        return [cls.instance()]

    def commit(self, interface: "Interface") -> bool:
        directory = interface.local_directory()
        if not os.path.exists(directory):
            os.makedirs(directory)
            interface.to_directory(directory)

    def contains(self, uuid: str) -> bool:
        return False

    def retrieve(self, uuid: str, local_directory: str) -> bool:
        return False

    def update_status(
        self, uuid: str, local_directory: Optional[str] = None
    ) -> None:
        pass
