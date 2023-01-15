from typing import Any, Optional, Tuple, Union

from datetime import datetime

from machinable import schema
from machinable.collection import ExperimentCollection
from machinable.element import Element, get_lineage, has_many
from machinable.types import VersionType


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

    kind = "Group"

    def __init__(
        self, group: Optional[str] = None, version: VersionType = None
    ):
        super().__init__(version=version)
        self.__model__ = schema.Group(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            pattern=normgroup(group),
            lineage=get_lineage(self),
        )

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
