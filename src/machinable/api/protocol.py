"""The parts of the API contract that OpenAPI cannot express.

Chiefly the WebSocket frame protocol, the interface hooks a project
implements, and the capability map.

Served live at ``GET /v1/protocol`` and consumed by the docs generator
(``machinable.api.docs``) so a single source of truth drives both. Bump
``PROTOCOL_VERSION`` when the wire protocol changes.
"""

from __future__ import annotations

from pydantic import BaseModel, Field

PROTOCOL_VERSION = "1.0"


class FrameField(BaseModel):
    name: str = Field(description="Field name on the JSON frame.")
    type: str = Field(description="JSON type, e.g. string, object, bool.")
    required: bool = Field(default=False, description="Whether the field is required.")
    description: str = Field(description="What the field means.")


class WSFrame(BaseModel):
    type: str = Field(description="Value of the frame's `type` field.")
    direction: str = Field(description='"client→server", "server→client", or "either".')
    summary: str = Field(description="One-line purpose of the frame.")
    fields: list[FrameField] = Field(
        default_factory=list, description="Frame-specific fields beyond type/id."
    )


class ChunkFlow(BaseModel):
    name: str = Field(description="Flow name, e.g. 'upload' or 'read'.")
    summary: str = Field(description="What the flow does.")
    sequence: list[str] = Field(description="Ordered wire steps for the flow.")


class InterfaceHook(BaseModel):
    name: str = Field(description="Method/attribute the project interface defines.")
    signature: str = Field(description="Python signature.")
    description: str = Field(description="When machinable invokes it and contract.")


class Capability(BaseModel):
    name: str = Field(description="Capability name.")
    summary: str = Field(description="What it enables for downstream apps.")
    surfaces: list[str] = Field(description="Endpoints / frames that expose it.")


class ProtocolDoc(BaseModel):
    """The non-OpenAPI half of the contract: WebSocket protocol + hooks."""

    protocol_version: str = Field(description="Wire protocol version.")
    transport: dict[str, str] = Field(
        description="Transport notes (control plane vs data plane)."
    )
    headers: list[FrameField] = Field(
        description="Cross-cutting request headers (project/user/interpreter)."
    )
    ws_endpoints: dict[str, str] = Field(
        description="WebSocket routes and what they connect to."
    )
    ws_frames: list[WSFrame] = Field(description="Every WebSocket frame type.")
    chunk_flows: list[ChunkFlow] = Field(
        description="Binary upload and read sequences."
    )
    interface_hooks: list[InterfaceHook] = Field(
        description="Hooks a project Interface implements for the data plane."
    )
    capabilities: list[Capability] = Field(
        description="High-level capability map for downstream consumers."
    )


def build_protocol() -> ProtocolDoc:
    """Construct the live protocol document."""
    return ProtocolDoc(
        protocol_version=PROTOCOL_VERSION,
        transport={
            "control_plane": "JSON text WebSocket frames (InterfaceMessage).",
            "data_plane": "Raw binary WebSocket frames for chunk upload/read.",
            "rest": "All non-WebSocket endpoints are described by /openapi.json.",
        },
        headers=[
            FrameField(
                name="X-Machinable-Project",
                type="string",
                required=False,
                description=(
                    "Project directory to target (also ?project=); must be under "
                    "the server's project_roots allowlist. Defaults to the launch "
                    "project."
                ),
            ),
            FrameField(
                name="X-Machinable-User",
                type="string",
                required=False,
                description=(
                    "Attributes created interfaces to this user (created_by). "
                    "Defaults to the server's OS user."
                ),
            ),
            FrameField(
                name="X-Machinable-Python",
                type="string",
                required=False,
                description=(
                    "Interpreter to serve the request (also ?python=); a non-"
                    "gateway interpreter is routed to a subprocess worker."
                ),
            ),
            FrameField(
                name="Authorization",
                type="string",
                required=False,
                description="Bearer <token> when the server sets api_token.",
            ),
        ],
        ws_endpoints={
            "/v1/interfaces/ws": "Create/attach any Interface; call/chunk/read/emit.",
            "/v1/executions/ws": "Attach to an existing Execution by uuid.",
        },
        ws_frames=[
            WSFrame(
                type="connect",
                direction="client→server",
                summary="Create or attach to an interface and bind the project.",
                fields=[
                    FrameField(
                        name="target",
                        type="string",
                        required=True,
                        description="Module path to instantiate, or an existing uuid.",
                    ),
                    FrameField(
                        name="version",
                        type="array",
                        description="Version list passed to Interface.make().",
                    ),
                    FrameField(
                        name="uuid",
                        type="string",
                        description=(
                            "Client-supplied id for create-by-id (content "
                            "hash); idempotent in that the same id attaches "
                            "to the existing instance."
                        ),
                    ),
                    FrameField(
                        name="label",
                        type="string",
                        description="Optional mutable label to set on the instance.",
                    ),
                    FrameField(
                        name="project",
                        type="string",
                        description="Project dir to bind (overrides header/query).",
                    ),
                    FrameField(
                        name="meta",
                        type="object",
                        description="Client metadata stored with the interface.",
                    ),
                ],
            ),
            WSFrame(
                type="connected",
                direction="server→client",
                summary="Confirms the connection; returns uuid and resolved config.",
                fields=[
                    FrameField(
                        name="payload.uuid",
                        type="string",
                        description="Interface uuid.",
                    ),
                    FrameField(
                        name="payload.config",
                        type="object",
                        description="Resolved configuration.",
                    ),
                ],
            ),
            WSFrame(
                type="call",
                direction="client→server",
                summary="Invoke a public method on the connected interface.",
                fields=[
                    FrameField(
                        name="method",
                        type="string",
                        required=True,
                        description="Public method name (no leading underscore).",
                    ),
                    FrameField(
                        name="args", type="array", description="Positional arguments."
                    ),
                    FrameField(
                        name="kwargs", type="object", description="Keyword arguments."
                    ),
                ],
            ),
            WSFrame(
                type="result",
                direction="server→client",
                summary="Single return value of a call.",
                fields=[
                    FrameField(
                        name="payload", type="any", description="JSON-encoded result."
                    )
                ],
            ),
            WSFrame(
                type="stream",
                direction="server→client",
                summary="One yielded value from a generator method; final=true closes.",
                fields=[
                    FrameField(
                        name="payload",
                        type="any",
                        description="One item; null on the terminal frame.",
                    )
                ],
            ),
            WSFrame(
                type="event",
                direction="server→client",
                summary="Unsolicited push from Interface.emit() (no call in flight).",
                fields=[
                    FrameField(
                        name="payload", type="any", description="Emitted payload."
                    )
                ],
            ),
            WSFrame(
                type="error",
                direction="server→client",
                summary="Failure detail; payload.code='not_found' for missing reads.",
                fields=[
                    FrameField(
                        name="payload.message", type="string", description="Message."
                    ),
                    FrameField(
                        name="payload.code",
                        type="string",
                        description="Typed code, e.g. 'not_found' on a missing read.",
                    ),
                ],
            ),
            WSFrame(
                type="chunk_start",
                direction="client→server",
                summary="Begin a binary upload (write/append) or read (mode read).",
                fields=[
                    FrameField(
                        name="id",
                        type="string",
                        required=True,
                        description="Correlation id; must match chunk_end on upload.",
                    ),
                    FrameField(
                        name="mode",
                        type="string",
                        description='"write" (truncate), "append", or "read".',
                    ),
                    FrameField(
                        name="path",
                        type="string",
                        description="Relative path under interface dir (upload only).",
                    ),
                    FrameField(
                        name="params",
                        type="object",
                        description=(
                            "Opaque, interface-defined read parameters (read only); "
                            "passed verbatim to the interface read() hook."
                        ),
                    ),
                ],
            ),
            WSFrame(
                type="chunk_end",
                direction="client→server",
                summary="Finish the active upload (after one or more binary frames).",
            ),
            WSFrame(
                type="chunk_done",
                direction="server→client",
                summary="Upload/read complete (bytes_written / bytes_sent).",
                fields=[
                    FrameField(
                        name="payload",
                        type="object",
                        description="bytes_written (upload) or bytes_sent (read).",
                    )
                ],
            ),
            WSFrame(
                type="widget_get",
                direction="client→server",
                summary="Request a widget's full synced state.",
                fields=[
                    FrameField(name="id", type="string", description="Correlation id.")
                ],
            ),
            WSFrame(
                type="widget_state",
                direction="server→client",
                summary="A widget's full synced state (reply to widget_get).",
                fields=[
                    FrameField(
                        name="payload.state",
                        type="object",
                        description="Full anywidget model state.",
                    )
                ],
            ),
            WSFrame(
                type="widget_set",
                direction="client→server",
                summary="Apply synced-state changes (model.set + save_changes).",
                fields=[
                    FrameField(
                        name="changes",
                        type="object",
                        description="Changed keys/values to apply.",
                    )
                ],
            ),
            WSFrame(
                type="widget_change",
                direction="server→client",
                summary="Trait changes (reply to widget_set, or server-originated).",
                fields=[
                    FrameField(
                        name="payload.changes",
                        type="object",
                        description="Normalized changed keys/values.",
                    )
                ],
            ),
            WSFrame(
                type="widget_msg",
                direction="either",
                summary="Custom widget message (model.send / msg:custom).",
                fields=[
                    FrameField(
                        name="content",
                        type="any",
                        description="Message body (client→server); reply in payload.",
                    )
                ],
            ),
            WSFrame(
                type="ping",
                direction="client→server",
                summary="Liveness probe; answered with pong.",
            ),
            WSFrame(
                type="pong",
                direction="server→client",
                summary="Reply to ping.",
            ),
            WSFrame(
                type="close",
                direction="either",
                summary="Teardown; the server evicts the interface from its cache.",
            ),
        ],
        chunk_flows=[
            ChunkFlow(
                name="upload",
                summary="Write opaque bytes to a path under the interface directory.",
                sequence=[
                    "client → chunk_start {id, path, mode: write|append}",
                    "client → <binary frame> ×N",
                    "client → chunk_end {id}",
                    "server → chunk_done {path, bytes_written}",
                ],
            ),
            ChunkFlow(
                name="read",
                summary="Stream the interface read() hook's bytes back, bounded.",
                sequence=[
                    "client → chunk_start {id, mode: read, params}",
                    "server → <binary frame> ×N (bounded)",
                    "server → chunk_done {bytes_sent}",
                    "server → error {code: not_found}   # when missing",
                ],
            ),
        ],
        interface_hooks=[
            InterfaceHook(
                name="<public methods>",
                signature="def method(self, *args, **kwargs) -> Any | Iterator",
                description=(
                    "Any non-underscore method is callable via `call`. Returning a "
                    "generator streams as `stream` frames. Restrict with a class "
                    "`__api_methods__` allowlist."
                ),
            ),
            InterfaceHook(
                name="read",
                signature="def read(self, params: dict) -> bytes | Iterable[bytes]",
                description=(
                    "Binary read hook for chunk_start mode=read. `params` is opaque "
                    "to machinable. Raise machinable.errors.NotFound (or "
                    "FileNotFoundError) to emit error{code:'not_found'}."
                ),
            ),
            InterfaceHook(
                name="emit",
                signature="self.emit(payload: Any) -> None",
                description=(
                    "Push an unsolicited `event` frame to a connected client during "
                    "a call (e.g. progress)."
                ),
            ),
            InterfaceHook(
                name="widget_state / widget_update / widget_message",
                signature="machinable.Widget hooks (see the Widgets guide)",
                description=(
                    "A machinable.Widget ships an anywidget frontend (_esm/_css) and "
                    "backs the model protocol: widget_state() (default: read-only "
                    "config), widget_update() (rejects by default since config is "
                    "immutable; keep state via save_file or mark), and "
                    "widget_message(). Pushes via self.push_widget_change/message()."
                ),
            ),
            InterfaceHook(
                name="local_directory",
                signature="self.local_directory(*append, create=False) -> str",
                description=(
                    "Working directory where uploaded chunks land and read() reads "
                    "from. Machinable never parses the bytes."
                ),
            ),
        ],
        capabilities=[
            Capability(
                name="remote_call",
                summary="Invoke any interface method over REST or WS, incl. streaming.",
                surfaces=["POST /v1/interfaces/call", "ws: call/result/stream"],
            ),
            Capability(
                name="binary_upload",
                summary="Stream opaque bytes into an interface directory.",
                surfaces=["ws: chunk_start(write|append)/chunk_end"],
            ),
            Capability(
                name="binary_read",
                summary="Stream interface bytes back via its read() hook.",
                surfaces=["ws: chunk_start(read)"],
            ),
            Capability(
                name="config_search",
                summary="Query instances by config (operators), sort, and paginate.",
                surfaces=["POST /v1/interfaces/search"],
            ),
            Capability(
                name="create_by_id",
                summary="Content-addressed, idempotent create with a client id.",
                surfaces=["POST /v1/interfaces (uuid)", "ws: connect(uuid)"],
            ),
            Capability(
                name="mutable_label",
                summary="Rename via a mutable label (config stays immutable).",
                surfaces=["PATCH /v1/interfaces/{uuid}/label"],
            ),
            Capability(
                name="creator_attribution",
                summary="Durable created_by metadata, queryable and reindex-preserved.",
                surfaces=["X-Machinable-User header", "search/find created_by"],
            ),
            Capability(
                name="multi_project",
                summary="Serve many projects (and interpreters) from one gateway.",
                surfaces=["X-Machinable-Project", "X-Machinable-Python"],
            ),
            Capability(
                name="source_edit",
                summary="Read/write/create/rename interface source (token-gated).",
                surfaces=[
                    "GET/PUT/DELETE /v1/source/{path}",
                    "POST /v1/source/move",
                ],
            ),
            Capability(
                name="widgets",
                summary="Interfaces ship an anywidget frontend for notebook + web.",
                surfaces=[
                    "GET /v1/project/{module}/widget/{esm|css}",
                    "ModuleSchema.widget",
                    "ws: widget_get/set/msg",
                ],
            ),
        ],
    )
