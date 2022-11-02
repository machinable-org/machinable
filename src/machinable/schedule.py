from machinable import schema
from machinable.collection import ExecutionCollection
from machinable.element import Connectable, Element, get_lineage
from machinable.types import VersionType


class Schedule(Connectable, Element):
    """Schedule base class"""

    _key = "Schedule"

    def __init__(self, version: VersionType = None):
        super().__init__(version)
        self.__model__ = schema.Schedule(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            lineage=get_lineage(self),
        )

    @classmethod
    def find(cls, element_id: str, *args, **kwargs) -> None:
        # schedules are virtual and do not
        # use their own storage
        return None

    @classmethod
    def find_by_version(
        cls, module: str, version: VersionType = None, mode: str = "default"
    ) -> "Collection":
        # schedules are virtual and do not
        # use their own storage
        return cls.collect([])

    @classmethod
    def from_storage(cls, storage_id, storage=None) -> "Schedule":
        # schedules are virtual and do not
        # use their own storage
        return cls()

    @property
    def executions(self) -> "Collection":
        return ExecutionCollection(self.__model__.executions)

    def append(self, execution: "Execution"):
        """Add an execution to the schedule"""
        self.__model__.executions.append(execution)

    def reset(self):
        self.__model__.executions = []

    def dispatch(self) -> "Schedule":
        self.on_dispatch()

        return self

    def on_dispatch(self):
        """Event to schedule the executions"""
