from typing import Any, Dict, Optional, Union

import copy

from machinable import schema
from machinable.element import Element, belongs_to, get_lineage
from machinable.errors import StorageError
from machinable.experiment import Experiment
from machinable.types import JsonableType, VersionType


class Record(Element):
    """Tabular record writer"""

    kind = "Record"

    def __init__(
        self,
        experiment: Experiment,
        scope: str = "default",
        version: VersionType = None,
    ):
        super().__init__(version=version)
        self.__model__ = schema.Record(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            scope=scope,
            lineage=get_lineage(self),
        )
        self.__related__["experiment"] = experiment

    @belongs_to
    def experiment() -> Experiment:
        return Experiment

    @property
    def scope(self) -> str:
        return self.__model__.scope

    @property
    def last(self) -> Optional[dict]:
        return self.__model__.last

    @property
    def current(self) -> dict:
        return self.__model__.current

    def write(self, key: str, value: Any) -> None:
        """Writes a cell value

        ```python
        self.record.write('loss', 0.1)
        # is equivalent to
        self.record['loss'] = 0.1
        ```

        # Arguments
        key: String, the column name
        value: Value to write
        """
        self.__model__.current[key] = value

    def update(
        self, dict_like: Optional[Dict[str, Any]] = None, **kwargs
    ) -> None:
        """Update record values using a dictionary. Equivalent to dict's update method.

        # Arguments
        dict_like: update values
        """
        if dict_like is None:
            return self.__model__.current.update(kwargs)
        return self.__model__.current.update(dict_like, **kwargs)

    def empty(self) -> bool:
        """Whether the record writer is empty (len(self._data) == 0)"""
        return len(self.__model__.current) == 0

    def save(self, force=False) -> JsonableType:
        """Save the record

        # Arguments
        force: If True the row will be written even if it empty

        # Returns
        The row data
        """
        if not self.experiment.is_mounted():
            raise StorageError(
                "The experiment has not been written to storage yet."
            )

        data = copy.deepcopy(self.__model__.current)
        self.__model__.last = copy.deepcopy(self.__model__.current)
        self.__model__.current = {}

        # don't save if there are no records
        if len(data) == 0 and not force:
            return {}

        return self.experiment.__model__._storage_instance.create_record(
            experiment=self.experiment.__model__,
            data=data,
            scope=self.__model__.scope,
        )

    def __len__(self):
        return len(self.__model__.current)

    def __delitem__(self, key):
        del self.__model__.current[key]

    def __getitem__(self, key):
        return self.__model__.current[key]

    def __setitem__(self, key, value):
        self.__model__.current[key] = value

    def __repr__(self):
        return f"Record <{len(self)}> [{self.__model__.scope}]"

    def __str__(self):
        return self.__repr__()
