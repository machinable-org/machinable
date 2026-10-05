"""Client-side iroh transport: dial the machinable API by endpoint id.

An :class:`httpx.AsyncBaseTransport` that carries HTTP/1.1 over iroh QUIC
streams, so any httpx-based machinable client (the console, a notebook, another
machinable instance) can reach an iroh host by key. One QUIC connection is
reused; each request opens its own cheap bidi stream (one exchange per stream,
per the wire contract). WebSocket-over-stream is a separate helper (Milestone
2.2) since httpx does not speak WS.
"""

from __future__ import annotations

import asyncio
import contextlib
from typing import TYPE_CHECKING

import h11
import httpx
from websockets.client import ClientProtocol
from websockets.protocol import State
from websockets.uri import parse_uri

from machinable.iroh import ALPN, _require_iroh
from machinable.iroh._ws import WSFrameDecoder
from machinable.iroh.transport import endpoint_options

if TYPE_CHECKING:
    import iroh

    from machinable.iroh.identity import Identity

_READ_CHUNK = 64 * 1024


def _resolve_target(iroh_mod, target: str | iroh.EndpointAddr) -> iroh.EndpointAddr:
    """Accept a full ``EndpointAddr`` or an endpoint-id string (dial by key)."""
    if isinstance(target, str):
        return iroh_mod.EndpointAddr(iroh_mod.EndpointId.from_string(target), None, [])
    return target


def _secret_key_bytes(
    identity: Identity | None, secret_key: bytes | None
) -> bytes | None:
    if secret_key is not None:
        return secret_key
    if identity is not None:
        return identity.secret_key.to_bytes()
    return None


async def _bind_and_connect(
    target: str | iroh.EndpointAddr, secret_key: bytes | None, relay: str
) -> tuple[iroh.Endpoint, iroh.Connection]:
    """Bind a client endpoint and open one QUIC connection to ``target``."""
    iroh = _require_iroh()
    options = endpoint_options(iroh, relay=relay, alpns=[], secret_key=secret_key)
    endpoint = await iroh.Endpoint.bind(options)
    conn = await endpoint.connect(_resolve_target(iroh, target), ALPN)
    return endpoint, conn


class IrohHttpTransport(httpx.AsyncBaseTransport):
    """Carries httpx requests over iroh streams to a single target endpoint."""

    def __init__(
        self,
        target: str | iroh.EndpointAddr,
        *,
        identity: Identity | None = None,
        secret_key: bytes | None = None,
        relay: str = "default",
    ) -> None:
        self._target = target
        self._relay = relay
        self._secret_key = _secret_key_bytes(identity, secret_key)
        self._endpoint: iroh.Endpoint | None = None
        self._conn: iroh.Connection | None = None
        self._lock = asyncio.Lock()

    async def _ensure_conn(self) -> iroh.Connection:
        if self._conn is not None:
            return self._conn
        async with self._lock:
            if self._conn is not None:
                return self._conn
            self._endpoint, self._conn = await _bind_and_connect(
                self._target, self._secret_key, self._relay
            )
            return self._conn

    async def handle_async_request(self, request: httpx.Request) -> httpx.Response:
        """Carry one httpx request over a fresh iroh bidi stream."""
        conn = await self._ensure_conn()
        bi = await conn.open_bi()
        recv, send = bi.recv(), bi.send()

        state = h11.Connection(our_role=h11.CLIENT)
        target = request.url.raw_path.decode("ascii")
        headers = [
            (k.decode("ascii"), v.decode("ascii")) for k, v in request.headers.raw
        ]
        # one exchange per stream: ask the server to close after responding so the
        # loopback pump sees EOF and tears the stream down cleanly (no keep-alive
        # hang on the raw byte copy).
        if not any(k.lower() == "connection" for k, _ in headers):
            headers.append(("connection", "close"))
        body = request.content

        try:
            await send.write_all(
                state.send(
                    h11.Request(method=request.method, target=target, headers=headers)
                )
            )
            if body:
                await send.write_all(state.send(h11.Data(data=body)))
            await send.write_all(state.send(h11.EndOfMessage()))
            await send.finish()

            status = 500
            resp_headers: list[tuple[bytes, bytes]] = []
            chunks: list[bytes] = []
            while True:
                event = state.next_event()
                if event is h11.NEED_DATA:
                    data = await recv.read(_READ_CHUNK)
                    state.receive_data(data)  # b"" signals EOF to h11
                    continue
                if isinstance(event, h11.Response):
                    status = event.status_code
                    resp_headers = list(event.headers)
                elif isinstance(event, h11.Data):
                    chunks.append(bytes(event.data))
                elif isinstance(event, (h11.EndOfMessage, h11.ConnectionClosed)):
                    break
                elif event is h11.PAUSED:
                    break
        except BaseException:
            # never leak the bidi stream on the reused QUIC connection: reset it
            # so the peer's max-concurrent-streams budget is reclaimed
            with contextlib.suppress(Exception):
                await send.reset(0)
            with contextlib.suppress(Exception):
                await recv.stop(0)
            raise

        return httpx.Response(
            status_code=status,
            headers=[(bytes(k), bytes(v)) for k, v in resp_headers],
            content=b"".join(chunks),
            request=request,
        )

    async def aclose(self) -> None:
        """Close the client endpoint and its connection."""
        if self._endpoint is not None:
            await self._endpoint.close()
            self._endpoint = None
            self._conn = None


def iroh_transport(
    target: str | iroh.EndpointAddr,
    *,
    identity: Identity | None = None,
    secret_key: bytes | None = None,
    relay: str = "default",
) -> IrohHttpTransport:
    """An httpx transport that dials ``target`` (endpoint id or address).

    Pass to ``httpx.AsyncClient(transport=...)`` or machinable's
    ``ConsoleClient(transport=...)``. With neither ``identity`` nor
    ``secret_key`` the client uses an ephemeral key (its endpoint id changes
    per run, so the host must approve it each time under ``pairing=auto``);
    pass a stable identity for a persistent client id the host can allowlist.
    """
    return IrohHttpTransport(
        target, identity=identity, secret_key=secret_key, relay=relay
    )


# ── WebSocket over an iroh stream (Milestone 2.2) ───────────────────────────


class IrohWebSocket:
    """A WebSocket session carried over one iroh bidi stream.

    Speaks standard RFC6455 (via the ``websockets`` sans-io ``ClientProtocol``)
    over the stream, so the machinable ``/ws`` routes work unchanged through the
    pump. ``send``/``recv`` exchange whole messages: ``str`` for text frames
    (the JSON control plane), ``bytes`` for binary (chunk data plane).
    """

    def __init__(
        self,
        endpoint: iroh.Endpoint,
        conn: iroh.Connection,
        bi: iroh.BiStream,
        path: str,
    ) -> None:
        self._endpoint = endpoint
        self._conn = conn
        self._send = bi.send()
        self._recv = bi.recv()
        # no frame-size cap: machinable's binary data plane carries arbitrarily
        # large chunks, and the v0 pump (raw bytes) imposes none — keep parity
        self._proto = ClientProtocol(parse_uri(f"ws://iroh{path}"), max_size=None)
        self._messages: asyncio.Queue = asyncio.Queue()
        self._closed = asyncio.Event()
        self._reader: asyncio.Task | None = None
        self._decoder = WSFrameDecoder(self._proto)
        # the reader loop (auto-pong) and send()/close() both write to the one
        # send stream; serialize so their frames never interleave on the wire
        self._send_lock = asyncio.Lock()

    async def _flush(self) -> None:
        async with self._send_lock:
            for data in self._proto.data_to_send():
                if data:
                    await self._send.write_all(data)
                else:  # b"" is the sentinel for "close the send side"
                    await self._send.finish()

    def _dispatch(self, event: object) -> None:
        # the client surfaces messages via the queue and lets EOF drive teardown,
        # so CLOSE frames need no extra handling here
        self._decoder.decode(
            event, on_message=self._messages.put_nowait, on_close=lambda _code: None
        )

    async def _handshake(self) -> None:
        self._proto.send_request(self._proto.connect())
        await self._flush()
        while self._proto.state is State.CONNECTING:
            data = await self._recv.read(_READ_CHUNK)
            if not data:
                self._proto.receive_eof()
                break
            self._proto.receive_data(data)
            for event in self._proto.events_received():
                self._dispatch(event)
            await self._flush()
        if self._proto.handshake_exc is not None:
            raise self._proto.handshake_exc
        self._reader = asyncio.create_task(self._read_loop())

    async def _read_loop(self) -> None:
        try:
            while True:
                data = await self._recv.read(_READ_CHUNK)
                if not data:
                    self._proto.receive_eof()
                    break
                self._proto.receive_data(data)
                for event in self._proto.events_received():
                    self._dispatch(event)
                await self._flush()
        except Exception:  # noqa: BLE001 - stream closed / reset
            pass
        finally:
            self._closed.set()

    async def send(self, message: str | bytes) -> None:
        """Send a text (``str``) or binary (``bytes``) message."""
        if isinstance(message, str):
            self._proto.send_text(message.encode())
        else:
            self._proto.send_binary(message)
        await self._flush()

    async def recv(self) -> str | bytes:
        """Await the next message; raises ``ConnectionError`` once closed."""
        while True:
            if not self._messages.empty():
                return self._messages.get_nowait()
            if self._closed.is_set():
                raise ConnectionError("iroh websocket closed")
            getter = asyncio.ensure_future(self._messages.get())
            closed = asyncio.ensure_future(self._closed.wait())
            done, pending = await asyncio.wait(
                {getter, closed}, return_when=asyncio.FIRST_COMPLETED
            )
            for task in pending:
                task.cancel()
            if getter in done:
                return getter.result()
            # closed fired; loop drains any last queued message then raises

    async def close(self, code: int = 1000, reason: str = "") -> None:
        """Close the WebSocket and tear down the endpoint (idempotent)."""
        # only initiate a close handshake if the peer hasn't already; sending a
        # close in any non-OPEN state raises websockets' InvalidState
        if self._proto.state is State.OPEN:
            try:
                self._proto.send_close(code, reason)
                await self._flush()
            except Exception:  # noqa: BLE001 - already gone / racing close
                pass
        if self._reader is not None:
            self._reader.cancel()
        with contextlib.suppress(Exception):
            await self._endpoint.close()
        self._closed.set()

    async def __aenter__(self) -> IrohWebSocket:
        return self

    async def __aexit__(self, *exc: object) -> None:
        await self.close()


async def connect_websocket(
    target: str | iroh.EndpointAddr,
    path: str,
    *,
    identity: Identity | None = None,
    secret_key: bytes | None = None,
    relay: str = "default",
) -> IrohWebSocket:
    """Open a WebSocket to ``path`` on the iroh host ``target``.

    ``path`` is a machinable ``/ws`` route, e.g. ``/v1/interfaces/ws``. Returns
    an open :class:`IrohWebSocket` (also usable as an async context manager).
    """
    endpoint, conn = await _bind_and_connect(
        target, _secret_key_bytes(identity, secret_key), relay
    )
    bi = await conn.open_bi()
    ws = IrohWebSocket(endpoint, conn, bi, path)
    await ws._handshake()
    return ws
