from typing import TYPE_CHECKING, Dict, List, Optional, Tuple, Union

from datetime import datetime

import arrow
from machinable.types import (
    ComponentType,
    DatetimeType,
    JsonableType,
    VersionType,
)
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
    directory: str
    version: VersionType = None
    code_version: Optional[dict] = None
    code_diff: Optional[str] = None
    host_info: Optional[dict] = None


class Experiment(Model):
    interface: ComponentType
    components: Dict[str, ComponentType] = {}
    experiment_id: str = Field(
        default_factory=lambda: encode_experiment_id(generate_experiment_id())
    )
    resources: Optional[dict] = None
    seed: Optional[int] = None
    config: Optional[dict] = None


class Repository(Model):
    storage: ComponentType
    default_grouping: Optional[str] = None


class Grouping(Model):
    group: str
    resolved_group: Optional[str] = None


class Execution(Model):
    engine: ComponentType
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp())
    nickname: str = Field(default_factory=generate_nickname)
    seed: Optional[int] = Field(default_factory=generate_seed)


class Record(Model):
    scope: str
    current: dict = {}
    last: dict = None
