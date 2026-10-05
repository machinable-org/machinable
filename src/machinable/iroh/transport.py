"""Server-side iroh transport for the machinable API (v0 loopback pump).

``create_app()`` is served **unchanged**: stock uvicorn runs on a loopback port
(never exposed to the network, and tokenless — the iroh allowlist is the gate),
and the iroh endpoint copies bytes between each inbound QUIC bidi stream and one
fresh loopback TCP connection. Because it copies raw bytes, HTTP/1.1 *and* the
WebSocket upgrade + framed session work with no special-casing.

The native (v1) path — driving ASGI directly over the stream with ``h11``, no
loopback — is a later, isolated swap; this module is the v0 pump.
"""

from __future__ import annotations

import asyncio
import sys
import threading
from collections.abc import Callable
from typing import TYPE_CHECKING

from machinable.iroh import ALPN, _require_iroh

if TYPE_CHECKING:
    import iroh
    from fastapi import FastAPI

    from machinable.iroh.allowlist import PairingPolicy
    from machinable.iroh.identity import Identity

_COPY_CHUNK = 64 * 1024


def _relay_config(iroh_mod, relay: str):
    """Resolve a ``relay`` mode to an iroh ``(preset, relay_mode)`` pair.

    - ``default`` — n0 public relays + DNS discovery (dial by id anywhere).
    - ``<https-url>`` — a **self-hosted relay** (plus n0 DNS discovery, so
      dial-by-id still resolves); traffic stays end-to-end encrypted.
    - ``lan`` — relay **disabled**: data flows direct only, nothing routed
      through a relay. (n0 DNS discovery still resolves ids; the iroh Python
      binding exposes no mDNS/local-discovery toggle, so a pure no-third-party
      LAN uses ``offline`` with explicit addresses.)
    - ``offline`` / ``minimal`` — no relay, no discovery; dial by full
      ``EndpointAddr`` only (tests, air-gapped sites).

    ``relay_mode`` is ``None`` when the preset's own default is used.
    """
    if relay in ("default", ""):
        return iroh_mod.preset_n0(), None
    if relay == "lan":
        return iroh_mod.preset_n0_disable_relay(), None
    if relay in ("offline", "minimal"):
        return iroh_mod.preset_minimal(), None
    if relay.startswith(("http://", "https://")):
        return iroh_mod.preset_n0(), iroh_mod.RelayMode.custom_from_urls([relay])
    raise ValueError(
        f"unknown relay mode {relay!r} (use default, lan, offline, or a relay URL)"
    )


def endpoint_options(
    iroh_mod, *, relay: str, alpns: list[bytes], secret_key: bytes | None = None
):
    """Build ``EndpointOptions`` for a ``relay`` mode (shared by both sides)."""
    preset, relay_mode = _relay_config(iroh_mod, relay)
    kwargs: dict = {"preset": preset, "alpns": alpns}
    if relay_mode is not None:
        kwargs["relay_mode"] = relay_mode
    if secret_key is not None:
        kwargs["secret_key"] = secret_key
    return iroh_mod.EndpointOptions(**kwargs)


class _IrohAcceptor:
    """Shared endpoint lifecycle + accept loop for the iroh servers.

    Binds the endpoint, runs the accept loop, enforces the pairing policy, and
    manages the connection/stream tasks. Subclasses implement
    :meth:`_handle_stream` for one accepted bidi stream and wrap
    :meth:`_bind_and_serve` / :meth:`_stop_accepting` with their own transport
    setup (a loopback uvicorn, or the ASGI lifespan for the native server).
    """

    def __init__(
        self,
        *,
        identity: Identity,
        policy: PairingPolicy,
        relay: str,
        log: Callable[[str], None] | None,
    ) -> None:
        self._identity = identity
        self._policy = policy
        self._relay = relay
        self._log = log or (lambda msg: print(msg, file=sys.stderr))
        self._endpoint: iroh.Endpoint | None = None
        self._accept_task: asyncio.Task | None = None
        self._conn_tasks: set[asyncio.Task] = set()
        self._closing = False

    async def _bind_and_serve(self) -> iroh.EndpointAddr:
        """Bind the endpoint and start the background accept loop; return its addr."""
        iroh = _require_iroh()
        options = endpoint_options(
            iroh,
            relay=self._relay,
            alpns=[ALPN],
            secret_key=self._identity.secret_key.to_bytes(),
        )
        self._endpoint = await iroh.Endpoint.bind(options)
        self._accept_task = asyncio.create_task(self._accept_loop())
        return self._endpoint.addr()

    async def serve_forever(self) -> None:
        """Block until the accept loop ends (endpoint closed / interrupted)."""
        if self._accept_task is not None:
            await self._accept_task

    async def _stop_accepting(self) -> None:
        """Stop accepting, drain connection handlers, and close the endpoint."""
        self._closing = True
        if self._accept_task is not None:
            self._accept_task.cancel()
        conn_tasks = list(self._conn_tasks)
        for task in conn_tasks:
            task.cancel()
        # await the cancellations so each handler's cleanup (e.g. the API's
        # connection_scope ContextVar reset) runs in its own task context
        if conn_tasks:
            await asyncio.gather(*conn_tasks, return_exceptions=True)
        if self._endpoint is not None:
            await self._endpoint.close()

    async def _accept_loop(self) -> None:
        assert self._endpoint is not None
        while not self._closing:
            try:
                incoming = await self._endpoint.accept_next()
            except Exception as ex:  # noqa: BLE001 - endpoint closed / transient
                if self._closing:
                    break
                self._log(f"iroh: accept error: {ex}")
                continue
            if incoming is None:
                break
            task = asyncio.create_task(self._handle_connection(incoming))
            self._conn_tasks.add(task)
            task.add_done_callback(self._conn_tasks.discard)

    async def _handle_connection(self, incoming: iroh.Incoming) -> None:
        try:
            accepting = await incoming.accept()
            conn = await accepting.connect()
        except Exception as ex:  # noqa: BLE001 - handshake failed
            self._log(f"iroh: handshake failed: {ex}")
            return

        peer = str(conn.remote_id())
        # the pairing decision may block on input(); keep it off the event loop
        allowed = await asyncio.get_running_loop().run_in_executor(
            None, self._policy.decide, peer
        )
        if not allowed:
            conn.close(0, b"unauthorized")
            return

        stream_tasks: set[asyncio.Task] = set()
        try:
            while not self._closing:
                bi = await conn.accept_bi()  # raises when the peer is done
                task = asyncio.create_task(self._handle_stream(bi))
                stream_tasks.add(task)
                task.add_done_callback(stream_tasks.discard)
        except Exception:  # noqa: BLE001 - connection closed by peer
            pass
        finally:
            for task in stream_tasks:
                task.cancel()
            if stream_tasks:
                await asyncio.gather(*stream_tasks, return_exceptions=True)

    async def _handle_stream(self, bi: iroh.BiStream) -> None:
        raise NotImplementedError


class LoopbackPumpServer(_IrohAcceptor):
    """Serves an ASGI app over iroh by pumping streams to a loopback uvicorn.

    Split from the blocking :func:`serve_iroh` so tests can start it, read the
    endpoint address, and drive it in-process without a foreground loop.
    """

    def __init__(
        self,
        app: FastAPI,
        *,
        identity: Identity,
        policy: PairingPolicy,
        relay: str = "default",
        loopback_host: str = "127.0.0.1",
        log_level: str = "warning",
        log: Callable[[str], None] | None = None,
    ) -> None:
        super().__init__(identity=identity, policy=policy, relay=relay, log=log)
        self._app = app
        self._loopback_host = loopback_host
        self._log_level = log_level
        self._uvicorn = None
        self._uvicorn_thread: threading.Thread | None = None
        self._loopback_port: int | None = None

    async def start(self) -> iroh.EndpointAddr:
        """Start the loopback uvicorn and bind the iroh endpoint (returns its addr)."""
        self._loopback_port = self._start_loopback_uvicorn()
        return await self._bind_and_serve()

    async def aclose(self) -> None:
        """Stop accepting, then stop the loopback uvicorn."""
        await self._stop_accepting()
        if self._uvicorn is not None:
            self._uvicorn.should_exit = True
        if self._uvicorn_thread is not None:
            self._uvicorn_thread.join(timeout=5)

    # ── loopback uvicorn (tokenless, 127.0.0.1 only) ───────────────────────

    def _start_loopback_uvicorn(self) -> int:
        import uvicorn

        from machinable.server import _boot_uvicorn_thread

        server, thread, port = _boot_uvicorn_thread(
            uvicorn,
            self._app,
            host=self._loopback_host,
            port=0,
            log_level=self._log_level,
        )
        self._uvicorn = server
        self._uvicorn_thread = thread
        return port

    # ── iroh ⇄ loopback pump ───────────────────────────────────────────────

    async def _handle_stream(self, bi: iroh.BiStream) -> None:
        """Copy one QUIC bidi stream ⇄ one fresh loopback TCP connection."""
        assert self._loopback_port is not None
        recv = bi.recv()
        send = bi.send()
        try:
            reader, writer = await asyncio.open_connection(
                self._loopback_host, self._loopback_port
            )
        except OSError as ex:
            self._log(f"iroh: loopback connect failed: {ex}")
            return

        async def iroh_to_tcp() -> None:
            # NB: we deliberately do NOT half-close (write_eof) the loopback when
            # the client finishes its send. Starlette's BaseHTTPMiddleware (the
            # API's auth/log/isolation middleware) treats the resulting
            # http.disconnect as an abort and drops the request before
            # responding. uvicorn already knows the request boundary from
            # Content-Length, and the client sends `Connection: close`, so no
            # half-close is needed for the request/response routes.
            while True:
                data = await recv.read(_COPY_CHUNK)
                if not data:
                    break
                writer.write(data)
                await writer.drain()

        async def tcp_to_iroh() -> None:
            try:
                while True:
                    data = await reader.read(_COPY_CHUNK)
                    if not data:
                        break
                    await send.write_all(data)
            finally:
                try:
                    await send.finish()
                except Exception:  # noqa: BLE001 - already closed
                    pass

        try:
            await asyncio.gather(iroh_to_tcp(), tcp_to_iroh())
        finally:
            writer.close()
            try:
                await writer.wait_closed()
            except OSError:
                pass


def serve_iroh(
    app: FastAPI,
    *,
    identity: Identity,
    policy: PairingPolicy,
    relay: str = "default",
    native: bool = False,
    api_token: str | None = None,
    log_level: str = "warning",
    log: Callable[[str], None] | None = None,
) -> None:
    """Blocking foreground entry: serve ``app`` over iroh until interrupted.

    ``native`` selects the v1 ASGI-over-iroh server (no loopback) over the v0
    pump. Prints the endpoint id (the address to hand out) on startup.
    """
    emit = log or (lambda msg: print(msg, file=sys.stderr))

    def _build_server():
        if native:
            from machinable.iroh.native import NativeServer

            return NativeServer(
                app,
                identity=identity,
                policy=policy,
                relay=relay,
                api_token=api_token,
                log=emit,
            )
        return LoopbackPumpServer(
            app,
            identity=identity,
            policy=policy,
            relay=relay,
            log_level=log_level,
            log=emit,
        )

    async def _run() -> None:
        server = _build_server()
        addr = await server.start()
        relay_url = addr.relay_url()
        emit(f"machinable iroh endpoint: {identity.endpoint_id}")
        emit(
            f"  transport={'native' if native else 'pump'} "
            f"pairing={policy.effective_mode} relay={relay}"
        )
        if relay_url:
            emit(f"  home relay: {relay_url}")
        emit("  dial this endpoint id from a paired client; Ctrl-C to stop.")
        try:
            await server.serve_forever()
        finally:
            await server.aclose()

    try:
        asyncio.run(_run())
    except KeyboardInterrupt:
        pass
