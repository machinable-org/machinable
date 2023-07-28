from typing import Optional, Tuple

from datetime import datetime

from machinable import schema
from machinable.element import get_dump, get_lineage
from machinable.scope import Scope


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


class Group(schema.Scope):
    kind: str = "Group"
    pattern: str
    path: Optional[str] = None


class Group(Scope):
    """Group element"""

    kind = "Group"

    def __init__(self, group: Optional[str] = None):
        super().__init__(version=None)
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

    def __call__(self):
        return {"group": self.path}
