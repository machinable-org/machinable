"""FastAPI application factory."""

from __future__ import annotations

import importlib.util
import os
import time
from collections import deque
from contextlib import asynccontextmanager
from typing import TYPE_CHECKING

from machinable.api.routes import (
    executions,
    health,
    interfaces,
    meta,
    project,
    source,
)

if TYPE_CHECKING:
    from fastapi import APIRouter, FastAPI, Request
    from starlette.responses import Response


def _require_fastapi():
    try:
        from fastapi import FastAPI
    except ImportError as ex:
        raise ImportError(
            "FastAPI is required for the machinable API. "
            "Install with: pip install 'machinable[api]'"
        ) from ex
    return FastAPI


@asynccontextmanager
async def lifespan(app: FastAPI):
    from machinable.api.isolation import WorkerRegistry

    # caches are keyed by project directory: {project_dir: {uuid: Interface}}
    app.state.interfaces = {}
    app.state.interface_meta = {}
    app.state.started_at = time.monotonic()
    app.state.event_log = deque(maxlen=500)
    app.state.workers = WorkerRegistry()
    yield
    await app.state.workers.shutdown()
    app.state.interfaces.clear()


def _load_project_routers(app: FastAPI, project_dir: str) -> None:
    from fastapi import APIRouter

    api_dir = os.path.join(project_dir, "api")
    if not os.path.isdir(api_dir):
        return

    for filename in sorted(os.listdir(api_dir)):
        if not filename.endswith(".py") or filename.startswith("_"):
            continue
        module_name = f"_machinable_project_api_{filename[:-3]}"
        path = os.path.join(api_dir, filename)
        spec = importlib.util.spec_from_file_location(module_name, path)
        if spec is None or spec.loader is None:
            continue
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        router = getattr(module, "router", None)
        if isinstance(router, APIRouter):
            app.include_router(router, prefix="/project")


def create_app(
    project_dir: str | None = None,
    *,
    allow_origins: list[str] | None = None,
    api_token: str | None = None,
    project_roots: list[str] | None = None,
    python_allowlist: list[str] | None = None,
    enable_source_api: bool = False,
    source_token: str | None = None,
    source_extensions: list[str] | None = None,
    source_base_dir: str | None = None,
    extra_routers: list[APIRouter] | None = None,
) -> FastAPI:
    _require_fastapi()
    from fastapi import FastAPI as FastAPIClass
    from fastapi.middleware.cors import CORSMiddleware

    from machinable.api.isolation import gateway_interpreter
    from machinable.api.openapi import openapi_kwargs

    app = FastAPIClass(lifespan=lifespan, **openapi_kwargs())
    app.state.project_dir = os.path.abspath(project_dir) if project_dir else None
    # allowlist of roots under which additional projects may be opened; when
    # empty, only the default project is reachable (secure by default).
    app.state.project_roots = [os.path.abspath(r) for r in (project_roots or [])]
    # interpreter that serves requests in-process; a different requested
    # interpreter is run in a subprocess worker (process isolation).
    app.state.gateway_python = gateway_interpreter()
    app.state.python_allowlist = list(python_allowlist or [])
    # source-editing API (RCE surface): opt-in + token-gated, confined to a base
    # dir (defaults per-request to the project dir; env override below).
    app.state.api_token = api_token
    app.state.enable_source_api = enable_source_api
    app.state.source_token = source_token
    app.state.source_extensions = list(source_extensions or [".py"])
    app.state.source_base_dir = source_base_dir or os.environ.get(
        "MACHINABLE_SOURCE_BASE_DIR"
    )

    # innermost custom middleware (added first): routes a request to a subprocess
    # worker when a different interpreter is requested, else serves in-process.
    _add_isolation_middleware(app)

    if allow_origins is None:
        allow_origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    if api_token:

        @app.middleware("http")
        async def bearer_auth(request: Request, call_next) -> Response:
            if request.url.path in {"/docs", "/openapi.json", "/redoc"}:
                return await call_next(request)
            auth = request.headers.get("Authorization", "")
            if auth != f"Bearer {api_token}":
                from fastapi.responses import JSONResponse

                return JSONResponse(
                    status_code=401,
                    content={"detail": "Unauthorized"},
                )
            return await call_next(request)

    @app.middleware("http")
    async def log_requests(request: Request, call_next) -> Response:
        response = await call_next(request)
        event_log = getattr(app.state, "event_log", None)
        if event_log is not None:
            event_log.append(
                f"{request.method} {request.url.path} -> {response.status_code}"
            )
        return response

    app.include_router(health.router)
    app.include_router(meta.router)
    app.include_router(interfaces.router)
    app.include_router(executions.router)
    app.include_router(project.router)
    app.include_router(project.projects_router)
    app.include_router(source.router)

    if project_dir:
        _load_project_routers(app, project_dir)

    for router in extra_routers or []:
        app.include_router(router)

    return app


def _add_isolation_middleware(app: FastAPI) -> None:
    from fastapi.responses import JSONResponse

    from machinable.api._helpers import resolve_project_dir
    from machinable.api.isolation import (
        is_python_allowed,
        normalize_python,
        resolve_interpreter,
    )

    @app.middleware("http")
    async def isolation(request, call_next):
        python = resolve_interpreter(request)
        # default / gateway interpreter → serve in-process
        if python is None or normalize_python(python) == app.state.gateway_python:
            return await call_next(request)
        # otherwise route to a subprocess worker for this (project, interpreter)
        from fastapi import HTTPException

        try:
            directory = resolve_project_dir(request)
        except HTTPException as ex:
            return JSONResponse({"detail": ex.detail}, status_code=ex.status_code)
        if not is_python_allowed(
            python, directory, app.state.gateway_python, app.state.python_allowlist
        ):
            return JSONResponse(
                {"detail": f"interpreter '{python}' is not permitted"},
                status_code=403,
            )
        try:
            worker = await app.state.workers.ensure(directory, python)
            return await worker.proxy(request)
        except Exception as ex:  # noqa: BLE001
            return JSONResponse(
                {"detail": f"project worker failed: {ex}"}, status_code=502
            )
