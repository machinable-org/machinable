from machinable import schema
from machinable.element import get_dump, get_lineage
from machinable.interface import Interface
from machinable.types import VersionType


class Schedule(Interface):
    """Schedule base class"""

    kind = "Schedule"

    def __init__(self, version: VersionType = None):
        super().__init__(version)
        self.__model__ = schema.Schedule(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            lineage=get_lineage(self),
        )
        self.__model__._dump = get_dump(self)
