from typing import TYPE_CHECKING, List, Optional, Tuple, Union

from machinable import schema
from machinable.component import compact
from machinable.element import Connectable, Element
from machinable.grouping import Grouping
from machinable.project import Project
from machinable.settings import get_settings
from machinable.storage.storage import Storage
from machinable.types import VersionType

if TYPE_CHECKING:
    from machinable.execution import Execution


class Repository(Connectable, Element):
    """Repository base class"""

    _kind = "Repository"

    def __init__(
        self,
        storage: Union[str, None] = None,
        version: VersionType = None,
        default_grouping: Optional[str] = get_settings().default_grouping,
    ):
        super().__init__()
        if storage is None:
            storage = Storage.default or get_settings().default_storage
        self.__model__ = schema.Repository(
            storage=compact(storage, version), default_grouping=default_grouping
        )
        self._resolved_storage: Optional[Storage] = None

    @classmethod
    def filesystem(
        cls,
        directory: str,
        default_grouping: Optional[str] = get_settings().default_grouping,
    ) -> "Repository":
        return cls(
            storage="machinable.storage.filesystem_storage",
            version={"directory": directory},
            default_grouping=default_grouping,
        )

    def storage(self, reload: bool = False) -> Storage:
        """Resolves and returns the storage instance"""
        if self._resolved_storage is None or reload:
            self._resolved_storage = Storage.make(
                self.__model__.storage[0], self.__model__.storage[1:]
            )

        return self._resolved_storage

    def commit(
        self, execution: "Execution", grouping: Optional[str] = None
    ) -> bool:
        if execution.is_mounted():
            return False

        if grouping is None:
            grouping = self.__model__.default_grouping

        grouping = Grouping(grouping)

        # finalize computed experiment field
        for experiment in execution.experiments:
            experiment.timestamp = execution.timestamp
            assert experiment.config is not None

        self.storage().create_execution(
            project=Project.get(),
            execution=execution,
            experiments=[experiment for experiment in execution.experiments],
            grouping=grouping,
        )

        # write deferred experiment data
        for experiment in execution.experiments:
            for filepath, data in experiment._deferred_data.items():
                experiment.save_file(filepath, data)
            experiment._deferred_data = {}

        # set relations
        execution.__related__["grouping"] = grouping

        return True

    def __repr__(self):
        return f"Repository <{self.__model__.default_grouping}>"

    def __str__(self):
        return self.__repr__()
