from typing import Any, Dict, Optional

import copy

from machinable.element import Element
from machinable.experiment import Experiment
from machinable.schema import RecordType


class Record(Element):
    """Tabular record writer"""

    def __init__(self, experiment: Experiment, scope: str = "default"):
        super().__init__()
        self._experiment = experiment
        self._data: dict = {}
        self._scope: str = scope

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
        self._data[key] = value

    def update(
        self, dict_like: Optional[Dict[str, Any]] = None, **kwargs
    ) -> None:
        """Update record values using a dictionary. Equivalent to dict's update method.

        # Arguments
        dict_like: update values
        """
        if dict_like is None:
            return self._data.update(kwargs)
        return self._data.update(dict_like, **kwargs)

    def empty(self) -> bool:
        """Whether the record writer is empty (len(self._data) == 0)"""
        return len(self._data) == 0

    def save(self, force=False) -> RecordType:
        """Save the record

        # Arguments
        force: If True the row will be written even if it empty

        # Returns
        The row data
        """
        data = copy.deepcopy(self._data)
        self._data = {}

        # don't save if there are no records
        if len(data) == 0 and not force:
            raise ValueError("")

        return self.__storage__.create_record(
            record=RecordType(data=data),
            experiment=self._experiment.__model__,
            scope=self._scope,
        )

    def __len__(self):
        return len(self._data)

    def __delitem__(self, key):
        del self._data[key]

    def __getitem__(self, key):
        return self._data[key]

    def __setitem__(self, key, value):
        self._data[key] = value
