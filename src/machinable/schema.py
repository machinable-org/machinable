from typing import TYPE_CHECKING, Dict, List, Optional, Tuple, Union

from datetime import datetime
from uuid import uuid4

from machinable.utils import generate_nickname, generate_seed
from pydantic import BaseModel, Field, PrivateAttr

if TYPE_CHECKING:
    from machinable.execution import Execution as ExecutionElement
    from machinable.storage.storage import Storage


class Element(BaseModel):
    uuid: str = Field(default_factory=lambda: uuid4().hex)
    kind: str = "Element"
    module: Optional[str] = None
    version: List[Union[str, Dict]] = []
    config: Optional[Dict] = None
    predicate: Optional[Dict] = None
    lineage: Tuple[str, ...] = ()


class Storage(Element):
    kind: str = "Storage"


class Index(Element):
    kind: str = "Index"


class Interface(Element):
    kind: str = "Interface"
    _dump: Optional[bytes] = PrivateAttr(default=None)
    _relations: Dict = PrivateAttr(default_factory=dict)


class Component(Interface):
    kind: str = "Component"


class Project(Interface):
    kind: str = "Project"
    directory: str
    name: str
    code_version: Optional[Dict] = None
    code_diff: Optional[str] = None
    host_info: Optional[Dict] = None


class Execution(Interface):
    kind: str = "Execution"
    seed: int = Field(default_factory=generate_seed)
    resources: Optional[Dict] = None
    host_info: Optional[Dict] = None
    nickname: str = Field(default_factory=generate_nickname)
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp())


class Schedule(Interface):
    kind: str = "Schedule"


class Group(Interface):
    kind: str = "Group"
    pattern: str
    path: Optional[str] = None
