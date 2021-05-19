from typing import TYPE_CHECKING, Any, List, Optional, Union

from datetime import datetime

from machinable.utils import (
    encode_experiment_id,
    generate_experiment_id,
    generate_nickname,
)
from pydantic import BaseModel, Field, PrivateAttr

if TYPE_CHECKING:
    from machinable.storage.storage import Storage


class SchemaType(BaseModel):
    # morphMany relation to storage
    _storage_id: Optional[str] = PrivateAttr(default=None)
    _storage_instance: Optional["Storage"] = PrivateAttr(default=None)


class ComponentType(SchemaType):
    name: str
    module: str
    config: dict
    kind: str
    key: str
    alias: Optional[str] = None
    prefix: str = ""
    parent: Optional[str] = None
    lineage: List[str] = []


class ExperimentType(SchemaType):
    experiment_id: str = Field(
        default_factory=lambda: encode_experiment_id(generate_experiment_id())
    )
    config: dict = {}
    interface: str = ""
    components: List = []


class RepositoryType(SchemaType):
    name: str = ""


class ExecutionType(SchemaType):
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp())
    nickname: str = Field(default_factory=generate_nickname)


class RecordType(SchemaType):
    data: dict = {}
    timestamp: float = Field(default_factory=lambda: datetime.now().timestamp())
