"""Shared WebSocket protocol handlers."""

from __future__ import annotations

import asyncio
import contextlib
import json
import types
from collections.abc import Callable
from typing import Any, cast

from fastapi import Request, WebSocket, WebSocketDisconnect

from machinable.api._helpers import (
    attach_emit_bridge,
    create_interface_from_target,
    dispatch_call_result,
    evict_interface,
    get_or_create_interface,
    json_payload,
    resolve_project_dir,
    run_api_call,
    run_widget_call,
)
from machinable.api.chunks import ChunkMode, ChunkUpload, stream_interface_read
from machinable.api.models import InterfaceMessage
from machinable.errors import NotFound
from machinable.execution import Execution
from machinable.interface import Interface, connection_scope
from machinable.project import Project
from machinable.widget import is_widget


class _AppRequest:
    """Request shim exposing the bits the cache/project helpers need from a WS."""

    def __init__(self, websocket: WebSocket) -> None:
        self.app = websocket.app
        self.state = types.SimpleNamespace()
        self.query_params = websocket.query_params
        self.headers = websocket.headers


async def handle_interface_ws(
    websocket: WebSocket,
    *,
    connect_only_execution: bool = False,
    log_event: Callable[[str], None] | None = None,
) -> None:
    # the shim carries exactly the attributes the helpers read from a Request
    request = cast(Request, _AppRequest(websocket))
    await websocket.accept()
    interface: Interface | None = None
    connected = False
    active_chunk: ChunkUpload | None = None
    # isolated connection stack for this WS connection; the project is entered
    # on the connect frame and torn down (with the stack) when the socket closes.
    scope = contextlib.ExitStack()
    scope.enter_context(connection_scope())
    # connection-lifetime emit bridge so server pushes (events, widget changes)
    # work outside of an in-flight call; attached once the interface is known.
    aio_scope = contextlib.AsyncExitStack()
    # serialize all sends: the bridge drain task and the main receive loop may
    # both write to the socket, and starlette's send is not concurrency-safe.
    send_lock = asyncio.Lock()

    async def send_frame(**kwargs: Any) -> None:
        frame = InterfaceMessage(**kwargs)
        async with send_lock:
            await websocket.send_text(frame.model_dump_json())

    async def send_bytes(data: bytes) -> None:
        async with send_lock:
            await websocket.send_bytes(data)

    async def send_error(
        msg_id: str, message: str, *, exc: Exception | None = None
    ) -> None:
        payload: dict[str, Any] = {"message": message}
        if exc is not None:
            payload["type"] = type(exc).__name__
        await send_frame(type="error", id=msg_id, payload=payload, final=True)

    def require_connected() -> bool:
        return connected and interface is not None

    try:
        while True:
            incoming = await websocket.receive()
            if incoming.get("type") == "websocket.disconnect":
                break

            if "bytes" in incoming:
                data = incoming["bytes"]
                if log_event:
                    log_event(f"WS binary: {len(data)} bytes")
                if active_chunk is None:
                    await send_error("", "Binary frame received without chunk_start")
                    continue
                try:
                    # disk write off the event loop so a slow/large chunk doesn't
                    # stall other websockets and HTTP requests on this process.
                    await asyncio.to_thread(active_chunk.write, data)
                except Exception as ex:
                    active_chunk.abort()
                    active_chunk = None
                    await send_error("", str(ex), exc=ex)
                continue

            raw = incoming.get("text")
            if raw is None:
                continue

            if log_event:
                log_event(f"WS frame: {raw[:200]}")
            message = InterfaceMessage.model_validate(json.loads(raw))

            if message.type == "ping":
                await send_frame(type="pong", id=message.id)
                continue

            if message.type == "close":
                if active_chunk is not None:
                    active_chunk.abort()
                    active_chunk = None
                if interface is not None and interface.uuid:
                    evict_interface(interface.uuid, request)
                await websocket.close()
                return

            if message.type == "chunk_start":
                if not require_connected():
                    await send_error(message.id, "Send connect before chunk_start")
                    continue
                assert interface is not None
                if active_chunk is not None:
                    await send_error(
                        message.id,
                        "Finish the active chunk upload before starting another",
                    )
                    continue
                if message.mode == "read":
                    # binary download: stream the interface's read() bytes back,
                    # then a chunk_done; a typed not_found error for missing data.
                    try:
                        sent = await stream_interface_read(
                            interface,
                            message.params or {},
                            send_bytes,
                        )
                        await send_frame(
                            type="chunk_done",
                            id=message.id,
                            payload={"bytes_sent": sent},
                            final=True,
                        )
                    except (NotFound, FileNotFoundError) as ex:
                        await send_frame(
                            type="error",
                            id=message.id,
                            payload={"code": "not_found", "message": str(ex)},
                            final=True,
                        )
                    except Exception as ex:
                        await send_error(message.id, str(ex), exc=ex)
                    continue
                if not message.path:
                    await send_error(message.id, "chunk_start requires path")
                    continue
                mode: ChunkMode = "append" if message.mode == "append" else "write"
                try:
                    active_chunk = ChunkUpload(
                        interface,
                        message.id,
                        message.path,
                        mode=mode,
                    )
                    await asyncio.to_thread(active_chunk.open)
                except Exception as ex:
                    active_chunk = None
                    await send_error(message.id, str(ex), exc=ex)
                continue

            if message.type == "chunk_end":
                if active_chunk is None:
                    await send_error(message.id, "No active chunk upload")
                    continue
                if message.id and message.id != active_chunk.chunk_id:
                    await send_error(
                        message.id,
                        f"chunk_end id mismatch (active: {active_chunk.chunk_id})",
                    )
                    continue
                try:
                    summary = await asyncio.to_thread(active_chunk.finish)
                    await send_frame(
                        type="chunk_done",
                        id=active_chunk.chunk_id,
                        payload=summary,
                        final=True,
                    )
                except Exception as ex:
                    await send_error(message.id, str(ex), exc=ex)
                finally:
                    active_chunk = None
                continue

            if message.type == "connect":
                if active_chunk is not None:
                    await send_error(message.id, "Finish chunk upload before connect")
                    continue
                if connected:
                    await send_error(
                        message.id,
                        "Already connected",
                    )
                    continue
                if not message.target:
                    await send_error(message.id, "connect requires target")
                    continue
                try:
                    directory = resolve_project_dir(request, explicit=message.project)
                    username = request.headers.get("X-Machinable-User")
                    request.state.project = directory
                    scope.enter_context(Project(directory, username=username))
                    if connect_only_execution:
                        loaded = get_or_create_interface(message.target, request)
                        if not isinstance(loaded, Execution):
                            raise ValueError(
                                "Execution WS connect requires an Execution uuid"
                            )
                        interface = loaded
                    else:
                        interface = create_interface_from_target(
                            request,
                            message.target,
                            version=message.version,
                            meta=message.meta,
                            uuid=message.uuid,
                            label=message.label,
                        )
                    connected = True
                    # attach the emit bridge for the connection so emit()/widget
                    # pushes reach the client even outside an in-flight call.
                    await aio_scope.enter_async_context(
                        attach_emit_bridge(interface, send_frame)
                    )
                    await send_frame(
                        type="connected",
                        id=message.id,
                        payload={
                            "uuid": interface.uuid,
                            "config": json_payload(
                                dict(interface.config)
                                if interface.config is not None
                                else {}
                            ),
                        },
                        final=True,
                    )
                except Exception as ex:
                    await send_error(message.id, str(ex), exc=ex)
                continue

            if message.type in ("widget_get", "widget_set", "widget_msg"):
                if not require_connected():
                    await send_error(message.id, "Send connect before widget frames")
                    continue
                assert interface is not None
                if not is_widget(interface):
                    await send_error(message.id, "Interface does not declare a widget")
                    continue
                try:
                    if message.type == "widget_get":
                        state = await run_widget_call(interface, "widget_state", [])
                        await send_frame(
                            type="widget_state",
                            id=message.id,
                            payload={"state": json_payload(state)},
                            final=True,
                        )
                    elif message.type == "widget_set":
                        normalized = await run_widget_call(
                            interface, "widget_update", [message.changes or {}]
                        )
                        await send_frame(
                            type="widget_change",
                            id=message.id,
                            payload={"changes": json_payload(normalized or {})},
                            final=True,
                        )
                    else:  # widget_msg
                        reply = await run_widget_call(
                            interface, "widget_message", [message.content, None]
                        )
                        await send_frame(
                            type="widget_msg",
                            id=message.id,
                            payload={"content": json_payload(reply)},
                            final=True,
                        )
                except Exception as ex:
                    await send_error(message.id, str(ex), exc=ex)
                continue

            if message.type != "call":
                await send_error(
                    message.id,
                    f"Unexpected frame type '{message.type}'",
                )
                continue

            if active_chunk is not None:
                await send_error(message.id, "Finish chunk upload before call")
                continue

            if not require_connected():
                await send_error(message.id, "Send connect before call")
                continue
            assert interface is not None

            try:
                result = await run_api_call(
                    interface,
                    message.method or "",
                    message.args,
                    message.kwargs,
                )
                await dispatch_call_result(
                    send_frame,
                    msg_id=message.id,
                    result=result,
                )
            except Exception as ex:
                await send_error(message.id, str(ex), exc=ex)
    except WebSocketDisconnect:
        pass
    finally:
        if active_chunk is not None:
            active_chunk.abort()
        await aio_scope.aclose()
        if interface is not None and interface.uuid:
            evict_interface(interface.uuid, request)
        scope.close()
