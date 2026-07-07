"""Pydantic models underlying every interface kind."""

from pydantic import BaseModel, Field, PrivateAttr

from machinable.utils import (
    generate_nickname,
    generate_seed,
    id_from_uuid,
)


class Interface(BaseModel):
    """Base model of every record: identity, config layers, version, predicate."""

    uuid: str | None = None
    kind: str = "Interface"
    module: str | None = None
    version: list[str | dict] = []
    config: dict | None = None
    predicate: dict | None = None
    # class-MRO base-module chain (inheritance); `lineage` is now the derivation chain.
    inherits: tuple[str, ...] = ()
    # ordered `with`-context stack [[module, compact_version], …] the interface was
    # created under. Identity-neutral: recorded for provenance readback only.
    context: list = Field(default_factory=list)
    created_at_ns: int | None = None
    created_by: str | None = None
    label: str | None = None
    _dump: bytes | None = PrivateAttr(default=None)

    @property
    def timestamp(self) -> int | None:
        """Creation time in epoch nanoseconds."""
        if self.uuid is None:
            return None
        if self.created_at_ns is not None:
            return self.created_at_ns
        return 0

    @property
    def hash(self) -> str | None:
        """Content hash over the model's identity fields."""
        if self.uuid is None:
            return None
        return self.uuid[-12:]

    @property
    def id(self) -> str | None:
        """Short form of the record id."""
        if self.uuid is None:
            return None
        return id_from_uuid(self.uuid)

    def extra(self) -> dict:
        """Kind-specific fields beyond the base model."""
        return {}


class Storage(Interface):
    """Model for Storage records."""

    kind: str = "Storage"


class Index(Interface):
    """Model for Index records."""

    kind: str = "Index"


class Scope(Interface):
    """Model for Scope records."""

    kind: str = "Scope"


class Project(Interface):
    """Model for Project records."""

    kind: str = "Project"


class Server(Interface):
    """Model for API-server records."""

    kind: str = "Server"


class Execution(Interface):
    """Model for Execution run-records (seed, nickname, resources)."""

    kind: str = "Execution"
    seed: int = Field(default_factory=generate_seed)
    nickname: str = Field(default_factory=generate_nickname)
    resources: dict | None = None

    def extra(self) -> dict:
        """The run-specific fields (seed, nickname, resources)."""
        return {
            "seed": self.seed,
            "nickname": self.nickname,
            "resources": self.resources,
        }


class Manifest(Interface):
    """Model for Manifest code-provenance records."""

    kind: str = "Manifest"
    # opaque, per-provider code/deps/environment entries; machinable never
    # introspects a token, only routes resolve/verify/describe back to its provider.
    entries: list = Field(default_factory=list)

    def extra(self) -> dict:
        """The manifest's entries."""
        return {"entries": self.entries}


class Inference(Interface):
    """Model for Inference records."""

    kind: str = "Inference"
