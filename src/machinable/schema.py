from typing import TYPE_CHECKING, Dict, List, Optional, Tuple, Union

import time

from machinable.utils import (
    empty_uuid,
    generate_nickname,
    generate_seed,
    id_from_uuid,
)
from pydantic import BaseModel, Field, PrivateAttr
from uuid_extensions.uuid7 import timestamp_ns


class Element(BaseModel):
    uuid: str = Field(default_factory=empty_uuid)
    kind: str = "Element"
    module: Optional[str] = None
    version: List[Union[str, Dict]] = []
    config: Optional[Dict] = None
    predicate: Optional[Dict] = None
    context: Optional[Dict] = None
    lineage: Tuple[str, ...] = ()

    @property
    def timestamp(self) -> int:
        try:
            return timestamp_ns(self.uuid, suppress_error=False)
        except ValueError:
            return 0

    @property
    def hash(self) -> str:
        return self.uuid[-12:]

    @property
    def id(self) -> str:
        return id_from_uuid(self.uuid)

    def extra(self) -> Dict:
        return {}


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

    def extra(self) -> Dict:
        return {"seed": self.seed, "nickname": self.nickname}


class Project(Interface):
    kind: str = "Project"


class Execution(Interface):
    kind: str = "Execution"
    seed: int = Field(default_factory=generate_seed)
    resources: Optional[Dict] = None

    def extra(self) -> Dict:
        return {"seed": self.seed, "resources": self.resources}


class Schedule(Interface):
    kind: str = "Schedule"
