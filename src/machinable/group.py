from typing import TYPE_CHECKING, Any, Optional, Tuple, Union

from datetime import datetime

from machinable import schema
from machinable.collection import ComponentCollection
from machinable.element import get_dump, get_lineage
from machinable.interface import Interface, has_many
from machinable.types import VersionType

if TYPE_CHECKING:
    from machinable.component import Component


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


class Group(Interface):
    """Group element"""

    kind = "Group"

    def __init__(
        self, group: Optional[str] = None, version: VersionType = None
    ):
        super().__init__(version=version)
        pattern, path = resolve_group(group)
        self.__model__ = schema.Group(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            pattern=pattern,
            path=path,
            lineage=get_lineage(self),
        )
        self.__model__._dump = get_dump(self)

    @property
    def pattern(self) -> str:
        return self.__model__.pattern

    @property
    def path(self) -> str:
        return self.__model__.path

    def __repr__(self) -> str:
        return f"Group [{self.path}]"
