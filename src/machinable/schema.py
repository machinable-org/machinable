from typing import TYPE_CHECKING, Dict, List, Optional, Tuple, Union

from datetime import datetime
from uuid import UUID, uuid4

from machinable.utils import (
    generate_nickname,
    generate_seed,
)
from pydantic import BaseModel, Field, PrivateAttr

if TYPE_CHECKING:
    from machinable.execution import Execution as ExecutionElement
    from machinable.storage.storage import Storage


class Element(BaseModel):
    kind: str = "Element"
    uid: UUID = Field(default_factory=uuid4)
    module: Optional[str] = None
    version: List[Union[str, Dict]] = []
    config: Optional[Dict] = None
    predicate: Optional[Dict] = None
    lineage: Tuple[str, ...] = ()
    _dump: Optional[bytes] = PrivateAttr(default=None)


class Project(Element):
    kind: str = "Project"
    directory: str
    name: str
    code_version: Optional[Dict] = None
    code_diff: Optional[str] = None
    host_info: Optional[Dict] = None


class Storage(Element):
    kind: str = "Storage"
    default_group: Optional[str] = None


class Component(Element):
    kind: str = "Component"
    # morphMany relation to storage
    _storage_id: Optional[str] = PrivateAttr(default=None)
    _storage_instance: Optional["Storage"] = PrivateAttr(default=None)


class Interface(Component):
    kind: str = "Interface"
    timestamp: int = Field(
        default_factory=lambda: int(datetime.now().timestamp())
    )
    seed: int = Field(default_factory=generate_seed)
    derived_from_id: Optional[str] = None
    derived_from_timestamp: Optional[int] = None

class Execution(Element):
    kind: str = "Execution"
    resources: Optional[Dict] = None
    host_info: Optional[Dict] = None
    nickname: str = Field(default_factory=generate_nickname)
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp())

class Schedule(Element):
    kind: str = "Schedule"
