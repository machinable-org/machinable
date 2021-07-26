from typing import TYPE_CHECKING, Dict, Optional

from datetime import datetime

from machinable.types import ComponentType, VersionType
from machinable.utils import (
    encode_experiment_id,
    generate_experiment_id,
    generate_nickname,
    generate_seed,
)
from pydantic import BaseModel, Field, PrivateAttr, root_validator, validator

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
    uses: Dict[str, ComponentType] = {}
    experiment_id: str = Field(
        default_factory=lambda: encode_experiment_id(generate_experiment_id())
    )
    timestamp: int = Field(
        default_factory=lambda: int(datetime.now().timestamp())
    )
    seed: int = Field(default_factory=generate_seed)
    config: Optional[dict] = None
    nickname: str = Field(default_factory=generate_nickname)
    derived_from_id: Optional[str] = None
    derived_from_timestamp: Optional[int] = None


class Repository(Model):
    storage: ComponentType
    default_group: Optional[str] = None


class Group(Model):
    pattern: str
    path: Optional[str] = None


class Execution(Model):
    engine: ComponentType
    resources: Optional[dict] = None
    host: Optional[dict] = None
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp())


class Record(Model):
    scope: str
    current: dict = {}
    last: dict = None
