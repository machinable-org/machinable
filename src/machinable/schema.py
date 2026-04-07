from pydantic import BaseModel, Field, PrivateAttr
from uuid_extensions.uuid7 import timestamp_ns

from machinable.utils import (
    empty_uuid,
    generate_nickname,
    generate_seed,
    id_from_uuid,
)


class Element(BaseModel):
    uuid: str = Field(default_factory=empty_uuid)
    kind: str = "Element"
    module: str | None = None
    version: list[str | dict] = []
    config: dict | None = None
    predicate: dict | None = None
    context: dict | None = None
    lineage: tuple[str, ...] = ()

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

    def extra(self) -> dict:
        return {}


class Storage(Element):
    kind: str = "Storage"


class Index(Element):
    kind: str = "Index"


class Scope(Element):
    kind: str = "Scope"


class Interface(Element):
    kind: str = "Interface"
    _dump: bytes | None = PrivateAttr(default=None)


class Component(Interface):
    kind: str = "Component"
    seed: int = Field(default_factory=generate_seed)
    nickname: str = Field(default_factory=generate_nickname)

    def extra(self) -> dict:
        return {"seed": self.seed, "nickname": self.nickname}


class Project(Interface):
    kind: str = "Project"


class Execution(Interface):
    kind: str = "Execution"
    seed: int = Field(default_factory=generate_seed)
    resources: dict | None = None

    def extra(self) -> dict:
        return {"seed": self.seed, "resources": self.resources}


class Schedule(Interface):
    kind: str = "Schedule"
