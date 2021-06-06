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
        self.__model__ = schema.Grouping(group=normgrouping(group))

    @property
    def group(self) -> str:
        return self.__model__.group

    def resolved(self, reload: Union[str, bool] = False) -> str:
        if isinstance(reload, str):
            self.__model__.resolved_group = reload
            reload = False

        if self.__model__.resolved_group is None or reload:
            _, self.__model__.resolved_group = resolve_grouping(
                self.__model__.group
            )

        return self.__model__.resolved_group

    @has_many
    def executions() -> ExecutionCollection:
        from machinable.execution import Execution

        return Execution, ExecutionCollection, False
