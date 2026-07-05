"""Public Pydantic contract for the catalog (Index) and Storage artifact APIs."""

from __future__ import annotations

from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ConfigLayer(StrEnum):
    default = "default"
    version = "version"
    update = "update"
    resolved = "resolved"


class ConfigLayers(BaseModel):
    default: dict[str, Any] = Field(default_factory=dict)
    version: list[Any] = Field(default_factory=list)
    update: dict[str, Any] = Field(default_factory=dict)
    resolved: dict[str, Any] = Field(default_factory=dict)


class ConfigOp(StrEnum):
    eq = "eq"
    ne = "ne"
    lt = "lt"
    lte = "lte"
    gt = "gt"
    gte = "gte"
    in_ = "in"
    contains = "contains"


class ConfigFilter(BaseModel):
    """One operator clause over a config json path (range/equality/membership)."""

    path: str = Field(description="Dotted path into the config layer, e.g. 'a.b'.")
    op: ConfigOp = ConfigOp.eq
    value: Any = None


class ConfigMatch(BaseModel):
    layer: ConfigLayer = ConfigLayer.resolved
    # operators over config json paths (equality, range, membership, substring)
    filters: list[ConfigFilter] = Field(default_factory=list)


class SortSpec(BaseModel):
    """A single ORDER BY term, over an index column or a config json path."""

    by: str = Field(
        default="created_at_ns",
        description="Index column, or a config json path when config_layer is set.",
    )
    config_layer: ConfigLayer | None = Field(
        default=None,
        description="When set, `by` is a json path into this config layer.",
    )
    direction: str = Field(default="desc", description='"asc" or "desc".')


class IndexEntry(BaseModel):
    record_id: str
    kind: str
    module: str | None
    identity_key: str = Field(min_length=1, max_length=128)
    predicate_key: str = Field(min_length=1, max_length=128)
    predicate: dict[str, Any] = Field(default_factory=dict)
    parent_id: str | None
    storage_uri: str
    local_uri: str | None = None
    storage_id: str | None = None
    hidden: bool = False
    bytes_missing: bool = False
    config: ConfigLayers
    inherits: list[str] = Field(default_factory=list)
    context: list = Field(default_factory=list)
    created_at_ns: int
    updated_at_ns: int
    created_by: str | None = None
    label: str | None = None
    extra: dict[str, Any] = Field(default_factory=dict)
    # per-person overlay: index-local annotations about
    # the record; never written to the record directory, never travels on share.
    private: dict[str, Any] = Field(default_factory=dict)


class IndexEntrySummary(BaseModel):
    record_id: str
    kind: str
    module: str | None
    identity_key: str
    predicate_key: str
    parent_id: str | None
    storage_uri: str
    local_uri: str | None = None
    storage_id: str | None = None
    hidden: bool = False
    bytes_missing: bool = False
    created_at_ns: int
    created_by: str | None = None
    label: str | None = None


class MaterializeKeys(BaseModel):
    identity_key: str = Field(min_length=1, max_length=128)
    predicate_key: str = Field(min_length=1, max_length=128)
    predicate: dict[str, Any] = Field(default_factory=dict)
    parent_id: str | None = None
    kind: str = "Interface"
    module: str | None = None
    config: ConfigLayers
    inherits: list[str] = Field(default_factory=list)
    context: list = Field(default_factory=list)
    extra: dict[str, Any] = Field(default_factory=dict)
    record_id: str | None = None
    storage_id: str | None = None
    created_by: str | None = None
    label: str | None = None
    # the record's original creation time; None mints "now". Ingest passes the
    # model.json value so a re-ingested row keeps the record's true birth date.
    created_at_ns: int | None = None
    # when set, the directory is ingested at this existing location instead of
    # generating a content-addressed path (used by reindex of moved/remote dirs)
    storage_uri: str | None = None
    local_uri: str | None = None


class MaterializeResponse(BaseModel):
    entry: IndexEntry
    created: bool


class FindRequest(BaseModel):
    module: str | None = None
    kind: str | None = None
    created_by: str | None = None
    label: str | None = None
    parent_id: str | None = None
    identity_key: str | None = None
    predicate_key: str | None = None
    predicate: dict[str, Any] | None = None
    config: ConfigMatch | None = None
    sort: list[SortSpec] = Field(default_factory=list)
    include_hidden: bool = False
    include_bytes_missing: bool = False
    record_id_suffix: str | None = None
    limit: int = Field(default=100, ge=1, le=1000)
    offset: int = Field(default=0, ge=0)


class FindResponse(BaseModel):
    items: list[IndexEntrySummary]
    total: int


class VerifyReport(BaseModel):
    checked: int
    missing: list[str]
    ok: int


# ── HTTP API surface (live: /openapi.json; regen: python -m machinable.api.docs) ──


class InterfaceInfo(BaseModel):
    """A materialized Interface entry (pure data node, no lifecycle status)."""

    uuid: str = Field(description="Unique interface identifier.")
    module: str | None = Field(
        default=None, description="Project-relative module path."
    )
    kind: str = Field(description="Interface kind, e.g. Interface or Project.")
    config: dict[str, Any] = Field(
        description="Resolved configuration for this interface."
    )
    predicate: dict[str, Any] = Field(
        description="Predicate dict used for index lookup."
    )
    version: list[str | dict] = Field(
        default_factory=list,
        description="Compact version list (~versions + override dicts).",
    )
    cli: str = Field(
        default="",
        description="Reproduction command: module + compact version as a CLI string.",
    )
    cached: bool = Field(
        description="True when computation for this interface has finished."
    )
    created_at: str = Field(
        description="ISO-8601 creation timestamp recorded at materialization."
    )
    created_by: str | None = Field(
        default=None,
        description="User attributed as creator when first materialized.",
    )
    label: str | None = Field(
        default=None,
        description="Optional mutable, human-facing label (config stays immutable).",
    )
    meta: dict[str, Any] = Field(
        default_factory=dict,
        description="Client metadata supplied on WS connect.",
    )
    execution_count: int = Field(
        description="Number of Execution children in the index."
    )
    latest_execution_uuid: str | None = Field(
        default=None,
        description="Uuid of the most recent Execution child, if any.",
    )


class ExecutionInfo(BaseModel):
    """An Execution run-record, the only kind that carries lifecycle status."""

    uuid: str = Field(description="Unique execution identifier.")
    module: str | None = Field(
        default=None, description="Project-relative module path."
    )
    config: dict[str, Any] = Field(description="Resolved execution configuration.")
    version: list[str | dict] = Field(
        default_factory=list, description="Compact version list."
    )
    cli: str = Field(default="", description="Reproduction command (module + version).")
    seed: int = Field(description="Random seed for this execution.")
    nickname: str = Field(description="Human-readable execution nickname.")
    resources: dict[str, Any] | None = Field(
        default=None, description="Requested compute resources."
    )
    parent_uuid: str = Field(description="Uuid of the parent Interface for this run.")
    is_started: bool = Field(description="True when started_at has been written.")
    is_active: bool = Field(
        description="True when heartbeat is recent and not finished."
    )
    is_finished: bool = Field(description="True when finished_at has been written.")
    is_incomplete: bool = Field(description="True when started but not live.")
    is_live: bool = Field(
        default=False, description="True when the heartbeat is recent."
    )
    is_resumed: bool = Field(
        default=False, description="True when the run was resumed at least once."
    )
    started_at: str | None = Field(
        default=None, description="ISO-8601 start timestamp."
    )
    resumed_at: str | None = Field(
        default=None, description="ISO-8601 last resume timestamp."
    )
    finished_at: str | None = Field(
        default=None, description="ISO-8601 finish timestamp."
    )
    heartbeat_at: str | None = Field(
        default=None, description="ISO-8601 last heartbeat timestamp."
    )
    created_at: str = Field(description="ISO-8601 creation timestamp.")
    created_by: str | None = Field(
        default=None,
        description="User attributed as creator when first materialized.",
    )
    label: str | None = Field(
        default=None,
        description="Optional mutable, human-facing label.",
    )


class InterfaceRef(BaseModel):
    """A uniform reference to any interface.

    `target` (module path) + compact `version`.
    """

    target: str = Field(description="Module path (or uuid).")
    version: list[str | dict] = Field(
        default_factory=list,
        description="Compact version (~versions + override dicts).",
    )


class DispatchInterface(BaseModel):
    """One interface to add to an Execution.

    Carries the ordered `with`-context it runs under.
    """

    target: str = Field(description="Interface module path.")
    version: list[str | dict] = Field(default_factory=list)
    context: list[InterfaceRef] = Field(
        default_factory=list,
        description=(
            "Ordered `with`-contexts the interface is created under; any interface "
            "(Scope is one kind). Entered in order, exited in reverse (LIFO), exactly "
            "like the CLI's element chain. Order is significant."
        ),
    )


class DispatchRequest(BaseModel):
    """Create/reuse an Execution and dispatch interfaces into it.

    Mirrors ``with Project(request): Execution.add([with ctx: ...]).dispatch()``
    Here, Project is the request's ambient project (``?project=``); the Execution
    is the container; each interface carries its own ordered context chain.
    """

    execution: InterfaceRef | None = Field(
        default=None,
        description=(
            "The Execution container interface; omit for a default Execution()."
        ),
    )
    execution_ref: str | None = Field(
        default=None,
        description=(
            "Reuse/resume a specific Execution instance (its uuid) instead of"
            " creating one."
        ),
    )
    interfaces: list[DispatchInterface] = Field(
        default_factory=list,
        description=(
            "Interfaces to add to the Execution, each with its `with`-context stack."
        ),
    )


class InterfaceCallRequest(BaseModel):
    """One-shot synchronous Interface method call over REST."""

    target: str = Field(description="Module path or existing interface uuid.")
    version: list[str | dict] = Field(
        default_factory=list,
        description="Passed to Interface.make() when target is a module path.",
    )
    meta: dict[str, Any] = Field(
        default_factory=dict,
        description="Optional metadata stored with a newly created interface.",
    )
    method: str = Field(description="Public method name to invoke.")
    args: list[Any] = Field(default_factory=list, description="Positional arguments.")
    kwargs: dict[str, Any] = Field(
        default_factory=dict, description="Keyword arguments."
    )


class CreateInterfaceRequest(BaseModel):
    """Create (materialize) an Interface, optionally with a client-supplied id."""

    target: str = Field(description="Module path to instantiate.")
    version: list[str | dict] = Field(
        default_factory=list, description="Passed to Interface.make()."
    )
    uuid: str | None = Field(
        default=None,
        description=(
            "Client-supplied id (e.g. content hash). Idempotent: creating again "
            "with the same id returns the existing instance unchanged."
        ),
    )
    label: str | None = Field(
        default=None, description="Optional mutable label to set on creation."
    )
    meta: dict[str, Any] = Field(default_factory=dict)


class SetLabelRequest(BaseModel):
    """Set/replace an interface's mutable label (FCFS / last-write-wins)."""

    label: str | None = Field(description="New label value, or null to clear.")


class SearchItem(BaseModel):
    """A lightweight search hit over the interface index."""

    id: str = Field(description="Interface uuid.")
    module: str | None = Field(default=None, description="Module path.")
    kind: str = Field(description="Interface kind.")
    config: dict[str, Any] = Field(
        default_factory=dict, description="Resolved configuration."
    )
    created_at_ns: int = Field(description="Creation timestamp (ns).")
    created_by: str | None = Field(default=None, description="Creator.")
    label: str | None = Field(default=None, description="Mutable label.")


class SearchResponse(BaseModel):
    items: list[SearchItem]
    total: int = Field(description="Total matches ignoring limit/offset.")


class SourceFile(BaseModel):
    """One source file under the project tree."""

    path: str = Field(description="Project-relative file path (forward slashes).")
    module: str = Field(description="Dotted module path the file imports as.")
    size: int = Field(description="File size in bytes.")
    mtime_ns: int = Field(description="Last-modified time (ns since epoch).")


class SourceListResponse(BaseModel):
    base_dir: str = Field(description="Absolute base directory the API is confined to.")
    files: list[SourceFile]


class SourceFileContent(BaseModel):
    path: str = Field(description="Project-relative file path.")
    module: str = Field(description="Dotted module path the file imports as.")
    content: str = Field(description="Full file content.")
    etag: str = Field(description="MD5 of the content (also returned as ETag header).")
    size: int = Field(description="Content size in bytes.")


class SourceWriteRequest(BaseModel):
    content: str = Field(description="Full new file content (overwrite or create).")


class SourceWriteResponse(BaseModel):
    path: str = Field(description="Project-relative file path.")
    module: str = Field(description="Dotted module path the file imports as.")
    etag: str = Field(description="MD5 of the written content.")
    created: bool = Field(description="True when the file did not previously exist.")


class SourceMoveRequest(BaseModel):
    """Atomic rename/move within the base directory (e.g. rename an interface)."""

    model_config = ConfigDict(populate_by_name=True)

    from_path: str = Field(alias="from", description="Existing source path.")
    to: str = Field(description="Destination source path (must not exist).")


class InterfaceMessage(BaseModel):
    """Single wire format for all WS communication.

    Valid ``type`` values:

    * ``connect``   (client → server) create or attach to an interface
    * ``connected`` (server → client) confirms uuid + resolved config
    * ``call``      (client → server) invoke a method
    * ``result``    (server → client) single return value
    * ``stream``    (server → client) one yielded value from a generator
    * ``error``     (server → client) exception detail
    * ``event``     (server → client) unsolicited push (no call in flight)
    * ``chunk_start`` (client → server) begin binary upload to a relative path
    * ``chunk_end``   (client → server) finish the active upload
    * ``chunk_done``  (server → client) upload summary (path, bytes_written)
    * ``ping`` / ``pong``
    * ``close``     (either side) teardown; server evicts from cache

    Between ``chunk_start`` and ``chunk_end``, the client sends one or more
    **binary** WebSocket frames (not JSON). Machinable does not interpret the
    bytes; they are written as-is under the Interface storage directory.
    """

    type: str = Field(
        description=(
            "Frame type. One of: connect, connected, call, result, stream, "
            "error, event, chunk_start, chunk_end, chunk_done, ping, pong, close."
        )
    )
    id: str = Field(
        default="",
        description="Client-assigned correlation id (empty for connect/close).",
    )
    target: str | None = Field(
        default=None,
        description="Module path or uuid for connect frames.",
    )
    uuid: str | None = Field(
        default=None,
        description=(
            "Client-supplied interface id for create-by-id on connect "
            "(content-addressed and idempotent: the same id is a no-op)."
        ),
    )
    label: str | None = Field(
        default=None,
        description="Optional mutable label to set on the interface (connect frame).",
    )
    project: str | None = Field(
        default=None,
        description="Project directory to bind this connection to (connect frame).",
    )
    version: list[str | dict] = Field(
        default_factory=list,
        description="Version list passed to Interface.make() on connect.",
    )
    meta: dict[str, Any] = Field(
        default_factory=dict,
        description="Client metadata stored with the interface on connect.",
    )
    method: str | None = Field(default=None, description="Method name for call frames.")
    path: str | None = Field(
        default=None,
        description="Relative path under the interface directory (chunk_start).",
    )
    mode: str | None = Field(
        default=None,
        description='Chunk mode: "write" (truncate) / "append" (upload), or "read".',
    )
    params: dict[str, Any] | None = Field(
        default=None,
        description=(
            "Opaque, interface-defined parameters for a read (chunk_start "
            "mode=read). Machinable passes this dict to the interface's read() "
            "hook and does not interpret it."
        ),
    )
    args: list[Any] = Field(
        default_factory=list, description="Positional call arguments."
    )
    kwargs: dict[str, Any] = Field(
        default_factory=dict, description="Keyword call arguments."
    )
    changes: dict[str, Any] | None = Field(
        default=None, description="Synced-state changes for a widget_set frame."
    )
    content: Any = Field(
        default=None, description="Custom message body for a widget_msg frame."
    )
    payload: Any = Field(default=None, description="Response or error payload.")
    final: bool = Field(
        default=True,
        description="False on intermediate stream frames; true on the last one.",
    )


class HealthResponse(BaseModel):
    """Server health summary."""

    status: str = Field(description="Health status literal.")
    version: str = Field(description="Installed machinable version.")
    project: str | None = Field(
        default=None, description="Default (launch) project directory, if any."
    )
    projects: list[str] = Field(
        default_factory=list,
        description="Project directories the server currently holds state for.",
    )
    executions_active: int = Field(
        description="Active Execution records in the default project."
    )
    uptime_seconds: float = Field(description="Seconds since the API server started.")


class ProjectModule(BaseModel):
    """Discoverable Interface module in the connected project."""

    module: str = Field(description="Project-relative dotted module path.")
    kind: str = Field(description="Interface kind for the discovered class.")
    doc: str | None = Field(default=None, description="Class docstring, if present.")
    widget: bool = Field(
        default=False, description="True when the class ships a widget frontend."
    )


class ProjectIndex(BaseModel):
    """Index of discoverable Interface modules."""

    project: str = Field(description="Absolute project directory path.")
    modules: list[ProjectModule] = Field(
        description="Discoverable Interface subclasses."
    )


class ConfigField(BaseModel):
    """One config field reflected from an Interface.Config class."""

    name: str = Field(description="Config field name.")
    type: str = Field(description="Python type annotation as string.")
    default: Any = Field(description="Default value, or null if required.")
    required: bool = Field(description="True when the field has no default.")


class VersionMethod(BaseModel):
    """A ``version_<name>`` method, invoked compactly as ``~name(args)``."""

    name: str = Field(description="Version name; use as ~name in a version list.")
    signature: str = Field(
        description="Call signature, e.g. '(path)' or '(*, mode, backbone)'."
    )
    doc: str | None = Field(default=None, description="Docstring, if present.")


class WidgetInfo(BaseModel):
    """Frontend descriptor for an interface that ships a widget."""

    meta: dict[str, Any] = Field(
        default_factory=dict,
        description="Opaque widget_meta; machinable never parses it.",
    )
    esm_url: str = Field(description="URL serving the widget ES module.")
    css_url: str | None = Field(
        default=None, description="URL serving the widget CSS, or null."
    )


class ModuleSchema(BaseModel):
    """Config schema for one discoverable Interface module."""

    module: str = Field(description="Project-relative dotted module path.")
    kind: str = Field(description="Interface kind for the discovered class.")
    doc: str | None = Field(default=None, description="Class docstring, if present.")
    config_fields: list[ConfigField] = Field(
        description="Reflected Config fields for form rendering."
    )
    versions: list[str] = Field(
        description="Named version methods exposed by the class."
    )
    version_methods: list[VersionMethod] = Field(
        default_factory=list,
        description="Version methods with signature + docstring (the ~version vocab).",
    )
    widget: WidgetInfo | None = Field(
        default=None,
        description="Widget frontend descriptor when the class ships one.",
    )


class ResolveRequest(BaseModel):
    """Dry-run a compact version: expand it to resolved config without running."""

    target: str = Field(description="Module path to instantiate.")
    version: list[str | dict] = Field(
        default_factory=list, description="Compact version (~versions + overrides)."
    )


class ResolveResponse(BaseModel):
    module: str | None = Field(default=None, description="Module path.")
    version: list[str | dict] = Field(
        default_factory=list, description="The compact version as given."
    )
    config: dict[str, Any] = Field(description="Resolved configuration.")
    predicate: dict[str, Any] = Field(
        default_factory=dict, description="Computed predicate."
    )
    cli: str = Field(description="Reproduction command (module + version).")


class LifecycleStatus(StrEnum):
    """Where a content-addressed config sits in its compute lifecycle."""

    draft = "draft"  # configured, never materialized/run
    running = "running"  # a run is active/live
    cached = "cached"  # a finished result is available to read
    failed = "failed"  # a run started but did not complete


class LifecycleRequest(BaseModel):
    """Content-addressed lifecycle lookup for a compact version (no run/materialize)."""

    target: str = Field(description="Module path to look up by content.")
    version: list[str | dict] = Field(
        default_factory=list, description="Compact version (~versions + overrides)."
    )
    context: list[InterfaceRef] = Field(
        default_factory=list,
        description=(
            "Ordered `with`-contexts the config is created under (Scope or "
            "any interface). Entered before lookup so a scoped config "
            "resolves to its scoped identity and must match what it was "
            "dispatched under."
        ),
    )


class LifecycleResponse(BaseModel):
    """The compute lifecycle state for a config, derived purely from the index."""

    target: str = Field(description="Module path that was looked up.")
    module: str | None = Field(default=None, description="Resolved module path.")
    uuid: str | None = Field(
        default=None,
        description="Materialized interface id, or null when never created (draft).",
    )
    status: LifecycleStatus = Field(description="draft | running | cached | failed.")
    cached: bool = Field(
        default=False,
        description="True when a finished result is available to read.",
    )
    execution_uuid: str | None = Field(
        default=None, description="Latest Execution run id, if any."
    )


# The provenance graph models live in core (machinable.provenance) so that
# Interface.provenance() and the MCP tool work without the fastapi/[api] extra.
# Re-exported here as the API response contract.
from machinable.provenance import (  # noqa: E402, F401
    GraphEdge,
    GraphNode,
    ProvenanceGraph,
)


class DataStatusResponse(BaseModel):
    """Whether a run's stored data is readable now (local / remote / evicted)."""

    uuid: str
    available: bool = Field(description="True when the working directory is mounted.")
    mounted: bool
    storage_uri: str | None = None
    local_uri: str | None = None
    bytes_missing: bool = False


class RelatedItem(BaseModel):
    uuid: str
    module: str | None = None
    kind: str
    version: list[str | dict] = Field(default_factory=list)
    label: str | None = None


class RelatedResponse(BaseModel):
    uuid: str
    related: list[RelatedItem]


class RemotesResponse(BaseModel):
    """Shareable interfaces the project resolves by URL (slurm, globus, …)."""

    remotes: dict[str, str | list[str]] = Field(
        default_factory=dict,
        description="module path → source URL (or [source, *dependencies]).",
    )
