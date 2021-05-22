from typing import TYPE_CHECKING, List, Optional, Tuple

from datetime import datetime

from machinable.types import ComponentType
from machinable.utils import (
    encode_experiment_id,
    generate_experiment_id,
    generate_nickname,
    generate_seed,
)
from pydantic import BaseModel, Field, PrivateAttr

if TYPE_CHECKING:
    from machinable.storage.storage import Storage


class Model(BaseModel):
    # morphMany relation to storage
    _storage_id: Optional[str] = PrivateAttr(default=None)
    _storage_instance: Optional["Storage"] = PrivateAttr(default=None)


class Project(Model):
    code_version: dict = {}
    code_diff: str = ""
    host_info: dict = {}


class Experiment(Model):
    interface: ComponentType
    config: dict = {}
    experiment_id: str = Field(
        default_factory=lambda: encode_experiment_id(generate_experiment_id())
    )
    resources: Optional[dict] = None
    seed: Optional[int] = None
    components: List[Tuple[ComponentType, dict]] = []


class Repository(Model):
    pass


class Grouping(Model):
    group: str
    resolved_group: str


class Execution(Model):
    engine: ComponentType
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp())
    nickname: str = Field(default_factory=generate_nickname)
    seed: Optional[int] = Field(default_factory=generate_seed)


class Record(Model):
    data: dict = {}
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp())
