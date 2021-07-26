from typing import Any, Optional, Tuple, Union

from datetime import datetime

from machinable import schema
from machinable.collection import ExperimentCollection
from machinable.element import Element, has_many


def normgroup(group: Optional[str]) -> str:
    if group is None:
        return ""
    if not isinstance(group, str):
        raise ValueError(f"Invalid group. Expected str but got '{group}'")
    return group.lstrip("/")


def resolve_group(group: str) -> Tuple[str, str]:
    group = normgroup(group)
    resolved = datetime.now().strftime(group)
    return group, resolved


class Group(Element):
    """Group element"""

    _kind = "Group"

    def __init__(self, group: Optional[str] = None):
        super().__init__()
        self.__model__ = schema.Group(pattern=normgroup(group))

    @property
    def pattern(self) -> str:
        return self.__model__.pattern

    @property
    def path(self) -> str:
        return self.__model__.path

    @has_many
    def experiments() -> ExperimentCollection:
        from machinable.experiment import Experiment

        return Experiment, ExperimentCollection, False
