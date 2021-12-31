from typing import TYPE_CHECKING, Dict, List, Optional, Union

from datetime import datetime

from machinable.types import ElementType, VersionType
from machinable.utils import (
    encode_experiment_id,
    generate_experiment_id,
    generate_nickname,
    generate_seed,
)
from pydantic import BaseModel, Field, PrivateAttr

if TYPE_CHECKING:
    from machinable.storage.storage import Storage


class Element(BaseModel):
    # morphMany relation to storage
    _storage_id: Optional[str] = PrivateAttr(default=None)
    _storage_instance: Optional["Storage"] = PrivateAttr(default=None)
    module: Optional[str] = None
    version: List[Union[str, dict]] = []
    config: Optional[dict] = None


class Project(Element):
    directory: str
    code_version: Optional[dict] = None
    code_diff: Optional[str] = None
    host_info: Optional[dict] = None


class Experiment(Element):
    uses: Dict[str, ElementType] = {}
    experiment_id: str = Field(
        default_factory=lambda: encode_experiment_id(generate_experiment_id())
    )
    timestamp: int = Field(
        default_factory=lambda: int(datetime.now().timestamp())
    )
    seed: int = Field(default_factory=generate_seed)
    nickname: str = Field(default_factory=generate_nickname)
    derived_from_id: Optional[str] = None
    derived_from_timestamp: Optional[int] = None


class Storage(Element):
    default_group: Optional[str] = None


class Group(Element):
    pattern: str
    path: Optional[str] = None


class Execution(Element):
    resources: Optional[dict] = None
    host: Optional[dict] = None
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp())


class Record(Element):
    scope: str
    current: dict = {}
    last: dict = None
