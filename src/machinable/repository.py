from typing import TYPE_CHECKING, List, Optional, Union

import os
from datetime import datetime

from machinable.collection.execution import ExecutionCollection
from machinable.component import compact
from machinable.element import Connectable, Element, has_many
from machinable.settings import get_settings
from machinable.types import Version

if TYPE_CHECKING:
    from machinable import Storage
    from machinable.execution import Execution


class Repository(Connectable, Element):
    """Repository base class"""

    def __init__(
        self, storage: Union[str, None] = None, version: Version = None
    ):
        super().__init__()
        if storage is None:
            from machinable import Storage

            storage = Storage.default or get_settings().default_storage
        self._storage = compact(storage, version)
        self._resolved_storage = Optional[Storage]

    def storage(self, reload: bool = False) -> "Storage":
        """Resolves and returns the storage instance"""
        if self._resolved_storage is None or reload:
            self._resolved_storage = Storage.make(
                self._storage[0], self._storage[1:]
            )

        return self._resolved_storage

    def commit(self, execution: "Execution"):
        if execution.is_mounted():
            raise NotImplementedError  # todo: handle duplicates

        self.storage().create_execution(
            # todo: host_info, code_version, code_diff, seed
            execution=self.to_model(),
            experiments=[
                experiment.to_model() for experiment in self._experiments
            ],
        )

        self.__related__["executions"] = execution
        execution.__related__["repository"] = self

    @has_many
    def executions() -> ExecutionCollection:
        from machinable.execution import Execution

        return Execution, ExecutionCollection
