from typing import Optional, Tuple, Union

from datetime import datetime

from machinable import schema
from machinable.collection.execution import ExecutionCollection
from machinable.element import Element, has_many


def normgrouping(grouping: Optional[str]) -> str:
    if grouping is None:
        return ""
    if not isinstance(grouping, str):
        raise ValueError(f"Invalid grouping. Expected str but got '{grouping}'")
    return grouping.lstrip("/")


def resolve_grouping(grouping: str) -> Tuple[str, str]:
    grouping = normgrouping(grouping)
    resolved = datetime.now().strftime(grouping)
    return grouping, resolved


class Grouping(Element):
    """Grouping element"""

    def __init__(self, group: Optional[str] = None):
        super().__init__()
        self.__model__: Optional[schema.Grouping] = None
        self._group = normgrouping(group)
        self._resolved_group: Optional[str] = None

    def to_model(self, mount: bool = True) -> schema.Grouping:
        model = schema.Grouping(
            group=self._group, resolved_group=self.resolved()
        )
        if mount:
            self.__model__ = model
        return model

    def group(self) -> str:
        return self._group

    def resolved(self, reload: Union[str, bool] = False) -> str:
        if isinstance(reload, str):
            self._resolved_group = reload
            reload = False

        if self._resolved_group is None or reload:
            _, self._resolved_group = resolve_grouping(self._group)

        return self._resolved_group

    def serialize(self) -> dict:
        return {"group": self._group}

    @has_many
    def executions() -> ExecutionCollection:
        from machinable.execution import Execution

        return Execution, ExecutionCollection, False
