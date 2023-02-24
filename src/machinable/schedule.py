from machinable import schema
from machinable.collection import ExecutionCollection
from machinable.element import Element, get_lineage
from machinable.types import VersionType


class Schedule(Element):
    """Schedule base class"""

    kind = "Schedule"

    def __init__(self, version: VersionType = None):
        super().__init__(version)
        self.__model__ = schema.Schedule(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            lineage=get_lineage(self),
        )
