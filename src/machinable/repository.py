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

    def __init__(
        self,
        storage: Union[str, None] = None,
        version: VersionType = None,
        default_grouping: Optional[str] = "%y_%U_%a",
    ):
        super().__init__()
        if storage is None:
            storage = Storage.default or get_settings().default_storage
        self.__model__ = schema.Repository(
            storage=compact(storage, version), default_grouping=default_grouping
        )
        self._resolved_storage: Optional[Storage] = None

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

        self.storage().create_execution(
            project=Project.get(),
            execution=execution,
            experiments=[experiment for experiment in execution.experiments],
            grouping=grouping,
        )

        # set relations
        execution.__related__["grouping"] = grouping

        return True

    def __repr__(self):
        return f"Repository <{self.__model__.default_grouping}>"

    def __str__(self):
        return self.__repr__()
