from __future__ import annotations

import asyncio
import json
import os
import secrets
import socket
import subprocess
import sys
import time
from typing import TYPE_CHECKING

from machinable.api.auth import (
    WORKER_SECRET_ENV,
    WORKER_SECRET_HEADER,
    request_principal,
)

if TYPE_CHECKING:
    from fastapi import Request
    from starlette.responses import Response


def normalize_python(path: str) -> str:
    return os.path.normcase(os.path.normpath(os.path.abspath(os.path.expanduser(path))))


def gateway_interpreter() -> str:
    return normalize_python(sys.executable)


def resolve_interpreter(request: Request) -> str | None:
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
WORKER_AMBIENT_ENV = "MACHINABLE_WORKER_AMBIENT_CONNECTIONS"


class WorkerSecretError(RuntimeError):
    """A worker that does not enforce the gateway's secret."""


class Worker:
    """A subprocess running ``create_app(directory)`` under a chosen interpreter."""

    def __init__(
        self, directory: str, python: str, ambient: list[dict] | None = None
    ) -> None:
        import httpx

        self.directory = directory
        self.python = normalize_python(python)
        self.port = _free_port()
        self.secret = secrets.token_urlsafe(32)
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

    async def wait_ready(self, timeout: float = 30.0) -> None:
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
        raise TimeoutError(f"worker for {self.directory} did not become ready")

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

    async def proxy(self, request: Request) -> Response:
        from starlette.responses import Response

        body = await request.body()
        params = [
            (k, v) for k, v in request.query_params.multi_items() if k != "python"
        ]
        # the worker trusts the gateway, so nothing the client sends speaks
        # for it: its credential stays here and the secret is set by the client
        in_drop = _HOP_BY_HOP | {
            "host",
            "x-machinable-python",
            "authorization",
            WORKER_SECRET_HEADER.lower(),
        }
        headers = {k: v for k, v in request.headers.items() if k.lower() not in in_drop}
        principal = request_principal(request)
        if principal is not None and principal.method == "oidc":
            # the worker has no auth of its own; it attributes by the header,
            # so it carries the verified identity, never the client's claim
            headers = {
                k: v for k, v in headers.items() if k.lower() != "x-machinable-user"
            }
            headers["X-Machinable-User"] = principal.identity
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

    async def close(self) -> None:
        try:
            await self.client.aclose()
        except Exception:
            pass
        if self.proc.poll() is None:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                self.proc.kill()


class WorkerRegistry:
    """Spawns and reuses one worker per (project directory, interpreter)."""

    def __init__(self, ambient: list[dict] | None = None) -> None:
        self._workers: dict[tuple[str, str], Worker] = {}
        self._ambient = list(ambient or [])
        self._lock = asyncio.Lock()

    async def ensure(self, directory: str, python: str) -> Worker:
        key = (directory, normalize_python(python))
        async with self._lock:
            worker = self._workers.get(key)
            if worker is not None and worker.proc.poll() is None:
                return worker
            worker = Worker(directory, python, self._ambient)
            try:
                await worker.wait_ready()
            except Exception:
                await worker.close()
                raise
            self._workers[key] = worker
            return worker

    def listing(self) -> list[dict]:
        return [
            {"directory": w.directory, "python": w.python, "pid": w.proc.pid}
            for w in self._workers.values()
        ]

    async def shutdown(self) -> None:
        for worker in list(self._workers.values()):
            await worker.close()
        self._workers.clear()
