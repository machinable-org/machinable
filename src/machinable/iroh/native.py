"""Native ASGI-over-iroh server (v1): no loopback, one process.

Drives the ASGI app **directly** over each iroh bidi stream — HTTP/1.1 framed
with ``h11``, WebSocket with the ``websockets`` sans-io ``ServerProtocol`` — so
there is no second server and no loopback hop (the v0 pump's cost). Because the
request is constructed here, the server can inject the ``Authorization`` header
itself (defense in depth) without the token ever crossing the wire.

Shares the identity/allowlist/pairing model and the accept loop shape with
:mod:`machinable.iroh.transport`; only the per-stream handling differs.
"""

from __future__ import annotations

import asyncio
import contextlib
from collections.abc import Callable, MutableMapping
from typing import TYPE_CHECKING, Any
from urllib.parse import unquote

import h11
from websockets.datastructures import Headers
from websockets.http11 import Request as WSRequest
from websockets.server import ServerProtocol

from machinable.iroh._ws import WSFrameDecoder
from machinable.iroh.transport import _IrohAcceptor

if TYPE_CHECKING:
    import iroh
    from fastapi import FastAPI

    from machinable.iroh.allowlist import PairingPolicy
    from machinable.iroh.identity import Identity

_READ_CHUNK = 64 * 1024


class _Lifespan:
    """Runs the ASGI lifespan protocol against ``app`` for its serving life."""

    def __init__(self, app: FastAPI) -> None:
        self._app = app
        self._to_app: asyncio.Queue = asyncio.Queue()
        self._startup = asyncio.Event()
        self._shutdown = asyncio.Event()
        self._error: str | None = None
        self._task: asyncio.Task | None = None

    async def _receive(self) -> dict:
        return await self._to_app.get()

    async def _send(self, message: MutableMapping[str, Any], /) -> None:
        kind = message["type"]
        if kind in ("lifespan.startup.complete", "lifespan.startup.failed"):
            self._error = message.get("message") if "failed" in kind else None
            self._startup.set()
        elif kind in ("lifespan.shutdown.complete", "lifespan.shutdown.failed"):
            self._error = message.get("message") if "failed" in kind else None
            self._shutdown.set()

    async def start(self) -> None:
        scope = {"type": "lifespan", "asgi": {"version": "3.0", "spec_version": "2.0"}}
        self._task = asyncio.create_task(self._app(scope, self._receive, self._send))
        await self._to_app.put({"type": "lifespan.startup"})
        await self._startup.wait()
        if self._error is not None:
            raise RuntimeError(f"ASGI lifespan startup failed: {self._error}")

    async def stop(self) -> None:
        if self._task is None:
            return
        await self._to_app.put({"type": "lifespan.shutdown"})
        with contextlib.suppress(asyncio.TimeoutError):
            await asyncio.wait_for(self._shutdown.wait(), timeout=5)
        self._task.cancel()
        with contextlib.suppress(Exception):
            await self._task


class NativeServer(_IrohAcceptor):
    """Serves an ASGI app over iroh natively (h11 HTTP + sans-io WebSocket).

    Inherits the endpoint lifecycle and accept loop from :class:`_IrohAcceptor`;
    only the per-stream ASGI handling and the lifespan wrapper are its own.
    """

    def __init__(
        self,
        app: FastAPI,
        *,
        identity: Identity,
        policy: PairingPolicy,
        relay: str = "default",
        api_token: str | None = None,
        log: Callable[[str], None] | None = None,
    ) -> None:
        super().__init__(identity=identity, policy=policy, relay=relay, log=log)
        self._app = app
        self._api_token = api_token
        self._lifespan = _Lifespan(app)

    async def start(self) -> iroh.EndpointAddr:
        """Run lifespan startup, bind the endpoint, and start accepting."""
        await self._lifespan.start()
        return await self._bind_and_serve()

    async def aclose(self) -> None:
        """Stop accepting, run lifespan shutdown, and close the endpoint."""
        await self._stop_accepting()
        await self._lifespan.stop()

    # ── per-stream ASGI ────────────────────────────────────────────────────

    async def _handle_stream(self, bi: iroh.BiStream) -> None:
        recv, send = bi.recv(), bi.send()
        hconn = h11.Connection(h11.SERVER)
        try:
            request, body = await self._read_request(recv, hconn)
        except Exception as ex:  # noqa: BLE001 - malformed request
            self._log(f"iroh: request parse failed: {ex}")
            with contextlib.suppress(Exception):
                await send.finish()
            return
        if request is None:
            with contextlib.suppress(Exception):
                await send.finish()
            return

        if _is_websocket(request):
            await self._serve_websocket(request, recv, send, hconn)
        else:
            await self._serve_http(request, body, send, hconn)

    async def _read_request(
        self, recv: iroh.RecvStream, hconn: h11.Connection
    ) -> tuple[h11.Request | None, bytes]:
        request: h11.Request | None = None
        body = bytearray()
        while True:
            event = hconn.next_event()
            if event is h11.NEED_DATA:
                data = await recv.read(_READ_CHUNK)
                hconn.receive_data(data)
                continue
            if isinstance(event, h11.Request):
                request = event
            elif isinstance(event, h11.Data):
                body += event.data
            elif isinstance(event, h11.EndOfMessage):
                break
            elif isinstance(event, h11.ConnectionClosed) or event is h11.PAUSED:
                break
        return request, bytes(body)

    def _base_scope(self, request: h11.Request, scope_type: str) -> dict[str, Any]:
        raw_path, _, query = request.target.partition(b"?")
        headers = [(k.lower(), v) for k, v in request.headers]
        # inject the bearer header so the API's auth middleware passes without
        # the token ever crossing the wire (the peer is already key-authed)
        if self._api_token and not any(k == b"authorization" for k, _ in headers):
            headers.append((b"authorization", f"Bearer {self._api_token}".encode()))
        return {
            "type": scope_type,
            "asgi": {"version": "3.0", "spec_version": "2.3"},
            "http_version": "1.1",
            "path": unquote(raw_path.decode("ascii")),
            "raw_path": raw_path,
            "query_string": query,
            "headers": headers,
            "client": None,
            "server": ("iroh", 0),
            "state": {},
        }

    async def _serve_http(
        self,
        request: h11.Request,
        body: bytes,
        send: iroh.SendStream,
        hconn: h11.Connection,
    ) -> None:
        scope = self._base_scope(request, "http")
        scope["method"] = request.method.decode("ascii")
        scope["scheme"] = "http"

        request_done = False
        disconnected = asyncio.Event()

        async def receive() -> dict[str, Any]:
            nonlocal request_done
            if not request_done:
                request_done = True
                return {"type": "http.request", "body": body, "more_body": False}
            # further polls (e.g. a StreamingResponse's disconnect watcher) block
            # until the exchange actually ends — returning http.disconnect eagerly
            # would cancel a streaming response on its second poll
            await disconnected.wait()
            return {"type": "http.disconnect"}

        async def asgi_send(message: MutableMapping[str, Any], /) -> None:
            kind = message["type"]
            if kind == "http.response.start":
                headers = [(bytes(k), bytes(v)) for k, v in message.get("headers", [])]
                await send.write_all(
                    hconn.send(
                        h11.Response(status_code=message["status"], headers=headers)
                    )
                )
            elif kind == "http.response.body":
                chunk = message.get("body", b"")
                if chunk:
                    await send.write_all(hconn.send(h11.Data(data=chunk)))
                if not message.get("more_body", False):
                    await send.write_all(hconn.send(h11.EndOfMessage()))

        try:
            await self._app(scope, receive, asgi_send)
        except Exception as ex:  # noqa: BLE001 - app error; best-effort 500
            self._log(f"iroh: app error: {ex}")
        finally:
            disconnected.set()  # release any pending receive()
            with contextlib.suppress(Exception):
                await send.finish()

    async def _serve_websocket(
        self,
        request: h11.Request,
        recv: iroh.RecvStream,
        send: iroh.SendStream,
        hconn: h11.Connection,
    ) -> None:
        # no frame-size cap (parity with the raw-bytes pump; chunks can be large)
        proto = ServerProtocol(max_size=None)
        ws_headers = Headers()
        for key, value in request.headers:
            ws_headers[key.decode("latin-1")] = value.decode("latin-1")
        ws_request = WSRequest(path=request.target.decode("ascii"), headers=ws_headers)
        # drive the sans-io handshake through the protocol's own parser (we
        # parsed the request with h11, but ServerProtocol must see the request
        # bytes to transition its parser from HTTP to frame mode)
        proto.receive_data(ws_request.serialize())
        for event in proto.events_received():
            if isinstance(event, WSRequest):
                ws_request = event

        scope = self._base_scope(request, "websocket")
        scope["scheme"] = "ws"
        scope["subprotocols"] = []

        to_app: asyncio.Queue = asyncio.Queue()
        to_app.put_nowait({"type": "websocket.connect"})
        reader_task: asyncio.Task | None = None
        accepted = False
        decoder = WSFrameDecoder(proto)
        # the reader task (auto-pong) and the app (websocket.send) both write to
        # the one send stream; serialize so their frames never interleave
        send_lock = asyncio.Lock()

        async def flush() -> None:
            async with send_lock:
                for data in proto.data_to_send():
                    if data:
                        await send.write_all(data)
                    else:
                        with contextlib.suppress(Exception):
                            await send.finish()

        def on_message(message: str | bytes) -> None:
            key = "text" if isinstance(message, str) else "bytes"
            to_app.put_nowait({"type": "websocket.receive", key: message})

        def on_close(code: int) -> None:
            to_app.put_nowait({"type": "websocket.disconnect", "code": code})

        def dispatch(event: object) -> None:
            decoder.decode(event, on_message=on_message, on_close=on_close)

        async def reader() -> None:
            trailing = hconn.trailing_data[0]
            if trailing:
                proto.receive_data(trailing)
                for event in proto.events_received():
                    dispatch(event)
                await flush()
            try:
                while True:
                    data = await recv.read(_READ_CHUNK)
                    if not data:
                        proto.receive_eof()
                        on_close(1005)
                        break
                    proto.receive_data(data)
                    for event in proto.events_received():
                        dispatch(event)
                    await flush()
            except Exception:  # noqa: BLE001 - stream reset / normal close
                on_close(1006)

        async def receive() -> dict[str, Any]:
            return await to_app.get()

        async def asgi_send(message: MutableMapping[str, Any], /) -> None:
            nonlocal reader_task, accepted
            kind = message["type"]
            if kind == "websocket.accept":
                accepted = True
                proto.send_response(proto.accept(ws_request))
                await flush()
                reader_task = asyncio.create_task(reader())
            elif kind == "websocket.send":
                if message.get("text") is not None:
                    proto.send_text(message["text"].encode())
                elif message.get("bytes") is not None:
                    proto.send_binary(message["bytes"])
                await flush()
            elif kind == "websocket.close":
                if not accepted:
                    # ASGI reject before accept → deny the handshake with an HTTP
                    # response, not a close frame on a still-CONNECTING protocol
                    proto.send_response(proto.reject(403, "Forbidden\n"))
                else:
                    proto.send_close(message.get("code", 1000))
                await flush()

        try:
            await self._app(scope, receive, asgi_send)
        except Exception as ex:  # noqa: BLE001 - app/ws error
            self._log(f"iroh: websocket error: {ex}")
        finally:
            if reader_task is not None:
                reader_task.cancel()
            with contextlib.suppress(Exception):
                await send.finish()


def _is_websocket(request: h11.Request) -> bool:
    upgrade = False
    conn_upgrade = False
    for key, value in request.headers:
        name = key.lower()
        if name == b"upgrade" and value.lower() == b"websocket":
            upgrade = True
        elif name == b"connection" and b"upgrade" in value.lower():
            conn_upgrade = True
    return upgrade and conn_upgrade
