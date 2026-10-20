from __future__ import annotations

import asyncio
import contextlib
import json
import os
import secrets
import socket
import subprocess
import sys
import time
from collections.abc import Iterable, Mapping
from typing import TYPE_CHECKING, Any
from urllib.parse import quote, urlencode

from machinable.api.auth import (
    WORKER_CLAIMS_HEADER,
    WORKER_SECRET_ENV,
    WORKER_SECRET_HEADER,
    Principal,
    request_principal,
)

if TYPE_CHECKING:
    from fastapi import Request
    from starlette.requests import HTTPConnection
    from starlette.responses import Response

DEFAULT_WORKER_START_SECONDS = 30.0
# how long the gateway's health waits for a worker's own health
WORKER_HEALTH_SECONDS = 2.0


def normalize_python(path: str) -> str:
    return os.path.normcase(os.path.normpath(os.path.abspath(os.path.expanduser(path))))


def gateway_interpreter() -> str:
    return normalize_python(sys.executable)


def resolve_interpreter(request: Any) -> str | None:
    """The interpreter a request targets (``?python=`` / header), or None."""
    return request.query_params.get("python") or request.headers.get(
        "X-Machinable-Python"
    )


def discover_venv_python(directory: str) -> str | None:
    """Best-effort discovery of a project's own virtualenv interpreter."""
    for rel in (
        os.path.join(".venv", "Scripts", "python.exe"),
        os.path.join(".venv", "bin", "python"),
        os.path.join("venv", "Scripts", "python.exe"),
        os.path.join("venv", "bin", "python"),
    ):
        candidate = os.path.join(directory, rel)
        if os.path.isfile(candidate):
            return normalize_python(candidate)
    return None


def is_python_allowed(
    python: str, directory: str, gateway_python: str, allowlist: list[str]
) -> bool:
    """Secure by default: only the gateway's interpreter, the project's own.

    ``.venv`` interpreter, or an explicitly allow-listed one may be launched.
    """
    norm = normalize_python(python)
    if norm == gateway_python:
        return True
    if norm == discover_venv_python(directory):
        return True
    return any(norm == normalize_python(p) for p in allowlist or [])


def _free_port() -> int:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.bind(("127.0.0.1", 0))
    port = sock.getsockname()[1]
    sock.close()
    return port


_HOP_BY_HOP = {"connection", "keep-alive", "transfer-encoding", "content-length"}
# set by the gateway alone: the client's credential stays at the gateway, the
# secret and the verified claims are the gateway's to send
_GATEWAY_ONLY = {
    "host",
    "x-machinable-python",
    "authorization",
    WORKER_SECRET_HEADER.lower(),
    WORKER_CLAIMS_HEADER.lower(),
}
# the upstream handshake is the websocket client's own
_WS_HANDSHAKE = {
    "upgrade",
    "sec-websocket-key",
    "sec-websocket-version",
    "sec-websocket-extensions",
    "sec-websocket-protocol",
    "sec-websocket-accept",
    "user-agent",
}
WORKER_AMBIENT_ENV = "MACHINABLE_WORKER_AMBIENT_CONNECTIONS"


def forwarded_headers(
    items: Iterable[tuple[str, str]],
    principal: Principal | None,
    drop: set[str] | frozenset[str] = frozenset(),
) -> dict[str, str]:
    """The headers a worker gets for a client's request.

    The worker trusts the gateway, so nothing the client sends speaks for it:
    its credential stays here, the secret is the gateway's, and a request the
    gateway admitted by OIDC carries the verified identity and claims, never
    the client's.
    """
    skip = _HOP_BY_HOP | _GATEWAY_ONLY | set(drop)
    oidc = principal is not None and principal.method == "oidc"
    if oidc:
        skip.add("x-machinable-user")
    headers = {k: v for k, v in items if k.lower() not in skip}
    if principal is not None and oidc:
        headers["X-Machinable-User"] = principal.identity
        headers[WORKER_CLAIMS_HEADER] = json.dumps(
            dict(principal.claims), default=str, separators=(",", ":")
        )
    return headers


def _close_code(code: int | None) -> int:
    """The code to close a socket with for one the other side closed with."""
    if code is None or code == 1005:  # closed without a code
        return 1000
    if code in (1006, 1015):  # abnormal: reported, never sent
        return 1011
    if 1000 <= code <= 1003 or 1007 <= code <= 1011 or 3000 <= code < 5000:
        return code
    return 1011


async def _ws_connect(url: str, headers: dict[str, str]) -> Any:
    try:
        from websockets.asyncio.client import connect
    except ImportError:  # websockets < 13
        from websockets import connect

        return await connect(
            url,
            extra_headers=headers,
            max_size=None,
            ping_interval=None,
            compression=None,
        )
    return await connect(
        url,
        additional_headers=headers,
        max_size=None,
        ping_interval=None,
        compression=None,
    )


class WorkerSecretError(RuntimeError):
    """A worker that does not enforce the gateway's secret."""


class Worker:
    """A subprocess running ``create_app(directory)`` under a chosen interpreter.

    It starts in the project's directory, so the project's modules import their
    siblings by name and no module in the gateway's folder shadows them.
    """

    def __init__(
        self, directory: str, python: str, ambient: list[dict] | None = None
    ) -> None:
        import httpx

        self.directory = directory
        self.python = normalize_python(python)
        self.port = _free_port()
        self.secret = secrets.token_urlsafe(32)
        # requests and sockets in flight through the gateway, and when the
        # last one ended (or the worker was last handed out)
        self.active = 0
        self.last_used = time.monotonic()
        self.proc = subprocess.Popen(
            [
                python,
                "-m",
                "machinable.api.worker",
                "--project",
                directory,
                "--port",
                str(self.port),
            ],
            cwd=directory,
            stderr=subprocess.PIPE,
            env={
                **os.environ,
                WORKER_SECRET_ENV: self.secret,
                WORKER_AMBIENT_ENV: json.dumps(list(ambient or [])),
            },
        )
        self.client = httpx.AsyncClient(
            base_url=f"http://127.0.0.1:{self.port}",
            timeout=60.0,
            headers={WORKER_SECRET_HEADER: self.secret},
        )

    @property
    def alive(self) -> bool:
        return self.proc.poll() is None

    def touch(self) -> None:
        self.last_used = time.monotonic()

    @contextlib.contextmanager
    def in_use(self):
        self.active += 1
        try:
            yield
        finally:
            self.active -= 1
            self.touch()

    async def wait_ready(self, timeout: float = DEFAULT_WORKER_START_SECONDS) -> None:
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            if self.proc.poll() is not None:
                err = self.proc.stderr.read() if self.proc.stderr else b""
                raise RuntimeError(
                    f"worker for {self.directory} exited "
                    f"({self.proc.returncode}): "
                    f"{err.decode(errors='replace')[-800:]}"
                )
            try:
                resp = await self.client.get("/v1/health")
                if resp.status_code == 200:
                    await self._check_secret_enforced()
                    return
            except WorkerSecretError:
                raise
            except Exception:
                pass
            await asyncio.sleep(0.1)
        raise TimeoutError(
            f"worker for {self.directory} did not become ready in {timeout:g}s "
            "(the server's worker_start_seconds)"
        )

    async def _check_secret_enforced(self) -> None:
        import httpx

        async with httpx.AsyncClient(
            base_url=f"http://127.0.0.1:{self.port}", timeout=10.0
        ) as bare:
            resp = await bare.get("/v1/health")
        if resp.status_code != 401:
            raise WorkerSecretError(
                f"the worker for {self.directory} ({self.python}) does not "
                "require the gateway's secret; upgrade machinable in that "
                "interpreter"
            )

    async def health(self, timeout: float = WORKER_HEALTH_SECONDS) -> dict | None:
        """The worker's own ``/v1/health``, or None when it does not answer."""
        if not self.alive:
            return None
        try:
            resp = await self.client.get("/v1/health", timeout=timeout)
            if resp.status_code != 200:
                return None
            return resp.json()
        except Exception:
            return None

    async def proxy(self, request: Request) -> Response:
        from starlette.responses import Response

        with self.in_use():
            body = await request.body()
            params = [
                (k, v) for k, v in request.query_params.multi_items() if k != "python"
            ]
            headers = forwarded_headers(
                request.headers.items(), request_principal(request)
            )
            resp = await self.client.request(
                request.method,
                request.url.path,
                params=params,  # ty: ignore[invalid-argument-type]
                content=body,
                headers=headers,
            )
        out_drop = _HOP_BY_HOP | {"content-encoding"}
        out_headers = {
            k: v for k, v in resp.headers.items() if k.lower() not in out_drop
        }
        out_headers["X-Machinable-Worker"] = str(self.proc.pid)
        return Response(
            content=resp.content, status_code=resp.status_code, headers=out_headers
        )

    async def proxy_websocket(self, scope: dict, receive, send) -> None:
        """Relay a client's socket to the worker's, frames both ways.

        The client's ``websocket.connect`` has been received. The client is
        accepted once the worker accepted the upstream handshake, and closed
        with the code the worker closed with (a client that leaves closes the
        worker's socket).
        """
        from starlette.requests import HTTPConnection

        conn = HTTPConnection(scope)
        params = [(k, v) for k, v in conn.query_params.multi_items() if k != "python"]
        url = f"ws://127.0.0.1:{self.port}{quote(scope['path'])}"
        if params:
            url += "?" + urlencode(params)
        headers = forwarded_headers(
            conn.headers.items(), request_principal(conn), drop=_WS_HANDSHAKE
        )
        headers[WORKER_SECRET_HEADER] = self.secret

        with self.in_use():
            try:
                upstream = await _ws_connect(url, headers)
            except Exception as ex:
                response = getattr(ex, "response", None)
                status = getattr(response, "status_code", None) or getattr(
                    ex, "status_code", None
                )
                refused = status is not None and 400 <= status < 500
                await send(
                    {"type": "websocket.close", "code": 1008 if refused else 1011}
                )
                return
            await send({"type": "websocket.accept"})

            async def client_to_worker() -> int:
                while True:
                    message = await receive()
                    if message["type"] == "websocket.disconnect":
                        return int(message.get("code") or 1000)
                    if message["type"] != "websocket.receive":
                        continue
                    if message.get("text") is not None:
                        await upstream.send(message["text"])
                    elif message.get("bytes") is not None:
                        await upstream.send(message["bytes"])

            async def worker_to_client() -> None:
                with contextlib.suppress(Exception):
                    async for data in upstream:
                        if isinstance(data, str):
                            await send({"type": "websocket.send", "text": data})
                        else:
                            await send({"type": "websocket.send", "bytes": data})

            inbound = asyncio.ensure_future(client_to_worker())
            outbound = asyncio.ensure_future(worker_to_client())
            try:
                await asyncio.wait(
                    {inbound, outbound}, return_when=asyncio.FIRST_COMPLETED
                )
                if inbound.done() and inbound.exception() is None:
                    # the client left: so does the worker's socket
                    with contextlib.suppress(Exception):
                        await upstream.close(_close_code(inbound.result()))
                else:
                    # the worker ended the socket (or relaying to it failed):
                    # the client gets the worker's close code
                    with contextlib.suppress(Exception):
                        await asyncio.wait_for(upstream.wait_closed(), 5)
                    with contextlib.suppress(Exception):
                        await send(
                            {
                                "type": "websocket.close",
                                "code": _close_code(upstream.close_code),
                                "reason": upstream.close_reason or "",
                            }
                        )
            finally:
                for task in (inbound, outbound):
                    if not task.done():
                        task.cancel()
                        with contextlib.suppress(BaseException):
                            await task
                with contextlib.suppress(Exception):
                    await upstream.close()

    async def close(self) -> None:
        try:
            await self.client.aclose()
        except Exception:
            pass
        if self.proc.poll() is None:
            self.proc.terminate()
            try:
                await asyncio.to_thread(self.proc.wait, 5)
            except subprocess.TimeoutExpired:
                self.proc.kill()


class WorkerRegistry:
    """Spawns and reuses one worker per (project directory, interpreter).

    With ``idle_seconds``, a worker with no request or socket in flight and no
    execution running in it for that long is ended (:meth:`reap`); the next
    request for it starts it again.
    """

    def __init__(
        self,
        ambient: list[dict] | None = None,
        *,
        start_seconds: float | None = None,
        idle_seconds: float | None = None,
    ) -> None:
        self._workers: dict[tuple[str, str], Worker] = {}
        self._ambient = list(ambient or [])
        self._lock = asyncio.Lock()
        self.start_seconds = float(start_seconds or DEFAULT_WORKER_START_SECONDS)
        self.idle_seconds = float(idle_seconds) if idle_seconds else None

    async def ensure(self, directory: str, python: str) -> Worker:
        key = (directory, normalize_python(python))
        async with self._lock:
            worker = self._workers.get(key)
            if worker is not None and worker.alive:
                # under the lock, so a reap deciding now sees this request
                worker.touch()
                return worker
            if worker is not None:
                self._workers.pop(key, None)
                await worker.close()
            worker = Worker(directory, python, self._ambient)
            try:
                await worker.wait_ready(self.start_seconds)
            except Exception:
                await worker.close()
                raise
            worker.touch()
            self._workers[key] = worker
            return worker

    def workers(self) -> list[Worker]:
        return list(self._workers.values())

    def listing(self) -> list[dict]:
        return [
            {"directory": w.directory, "python": w.python, "pid": w.proc.pid}
            for w in self._workers.values()
        ]

    async def reap(self, idle_seconds: float | None = None) -> list[Worker]:
        """End the workers idle for ``idle_seconds``; returns those ended.

        Idle is nothing in flight through the gateway for that long and no
        execution running in the worker's process (asked over its health). A
        worker that does not answer is kept; one that exited is dropped.
        """
        idle = idle_seconds if idle_seconds is not None else self.idle_seconds
        if idle is None:
            return []
        ended: list[Worker] = []
        for key, worker in list(self._workers.items()):
            if worker.alive:
                if worker.active or time.monotonic() - worker.last_used < idle:
                    continue
                seen = worker.last_used
                health = await worker.health()
                if health is None or _running_in(health):
                    continue
            else:
                seen = worker.last_used
            async with self._lock:
                if (
                    self._workers.get(key) is not worker
                    or worker.active
                    or worker.last_used != seen
                ):
                    continue
                self._workers.pop(key)
            ended.append(worker)
        for worker in ended:
            await worker.close()
        return ended

    async def run_reaper(self) -> None:
        """Reap in a loop (the app's lifespan runs this while it serves)."""
        if self.idle_seconds is None:
            return
        interval = min(5.0, max(0.05, self.idle_seconds / 4))
        while True:
            await asyncio.sleep(interval)
            with contextlib.suppress(Exception):
                await self.reap()

    async def shutdown(self) -> None:
        for worker in list(self._workers.values()):
            await worker.close()
        self._workers.clear()


def _running_in(health: Mapping[str, Any]) -> bool:
    """Whether a worker's health says an execution runs in its process."""
    if "executions_running" in health:
        return bool(health["executions_running"])
    # an older worker: any active execution it sees keeps it
    return bool(health.get("executions_active"))


class IsolationMiddleware:
    """Routes a request or socket to a subprocess worker for its interpreter.

    The interpreter is the one a request names (``?python=`` or
    ``X-Machinable-Python``) or, with ``project_default_python``, the own
    ``.venv`` of the project it names under ``project_roots``. None, or the
    gateway's own interpreter, is served in-process.
    """

    def __init__(self, app) -> None:
        self.app = app

    async def __call__(self, scope, receive, send) -> None:
        kind = scope["type"]
        if kind not in ("http", "websocket"):
            await self.app(scope, receive, send)
            return
        from fastapi import HTTPException
        from starlette.requests import HTTPConnection

        from machinable.api._helpers import resolve_project_dir

        conn = HTTPConnection(scope)
        state = scope["app"].state
        python = resolve_interpreter(conn)
        if python is None:
            python = project_default_python(conn, state)
        if python is None or normalize_python(python) == state.gateway_python:
            await self.app(scope, receive, send)
            return

        if kind == "websocket":
            message = await receive()
            if message["type"] != "websocket.connect":
                return
        try:
            directory = resolve_project_dir(conn)  # ty: ignore[invalid-argument-type]
        except HTTPException as ex:
            await _refuse(kind, scope, receive, send, ex.status_code, ex.detail)
            return
        if not is_python_allowed(
            python, directory, state.gateway_python, state.python_allowlist
        ):
            detail = f"interpreter '{python}' is not permitted"
            await _refuse(kind, scope, receive, send, 403, detail)
            return
        try:
            worker = await state.workers.ensure(directory, python)
        except Exception as ex:  # noqa: BLE001
            detail = f"project worker failed: {ex}"
            await _refuse(kind, scope, receive, send, 502, detail)
            return
        if kind == "websocket":
            await worker.proxy_websocket(scope, receive, send)
            return
        from starlette.requests import Request

        try:
            response = await worker.proxy(Request(scope, receive))
        except Exception as ex:  # noqa: BLE001
            detail = f"project worker failed: {ex}"
            await _refuse(kind, scope, receive, send, 502, detail)
            return
        await response(scope, receive, send)


def project_default_python(conn: HTTPConnection, state: Any) -> str | None:
    """The own ``.venv`` of a project a request names under ``project_roots``.

    Only with the server's ``project_default_python``; None otherwise, or when
    that project has no ``.venv``.
    """
    if not getattr(state, "project_default_python", False):
        return None
    from machinable.api._helpers import _abspath, _within

    requested = conn.query_params.get("project") or conn.headers.get(
        "X-Machinable-Project"
    )
    if not requested:
        return None
    directory = _abspath(requested)
    roots = getattr(state, "project_roots", None) or []
    if not any(_within(directory, root) for root in roots):
        return None
    return discover_venv_python(directory)


async def _refuse(kind: str, scope, receive, send, status: int, detail: str) -> None:
    if kind == "websocket":
        # the connect was received: a close before accept refuses the upgrade
        await send({"type": "websocket.close", "code": 1008 if status < 500 else 1011})
        return
    from starlette.responses import JSONResponse

    await JSONResponse({"detail": detail}, status_code=status)(scope, receive, send)
