from typing import TYPE_CHECKING, Dict, List, Optional, Tuple, Union

from machinable.utils import generate_nickname, generate_seed
from pydantic import BaseModel, Field, PrivateAttr
from uuid_extensions import uuid7, uuid_to_datetime


class Element(BaseModel):
    uuid: str = Field(default_factory=lambda: uuid7(as_type="hex"))
    kind: str = "Element"
    module: Optional[str] = None
    version: List[Union[str, Dict]] = []
    config: Optional[Dict] = None
    predicate: Optional[Dict] = None
    lineage: Tuple[str, ...] = ()

    @property
    def timestamp(self) -> float:
        return uuid_to_datetime(self.uuid).timestamp()


class Storage(Element):
    kind: str = "Storage"


class Index(Element):
    kind: str = "Index"


class Scope(Element):
    kind: str = "Scope"


class Interface(Element):
    kind: str = "Interface"
    _dump: Optional[bytes] = PrivateAttr(default=None)


class Component(Interface):
    kind: str = "Component"
    seed: int = Field(default_factory=generate_seed)
    nickname: str = Field(default_factory=generate_nickname)


class Project(Interface):
    kind: str = "Project"


class Execution(Interface):
    kind: str = "Execution"
    seed: int = Field(default_factory=generate_seed)
    resources: Optional[Dict] = None


class Schedule(Interface):
    kind: str = "Schedule"
