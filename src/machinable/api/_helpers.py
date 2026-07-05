"""Shared helpers for the machinable HTTP/WS API."""

from __future__ import annotations

import asyncio
import contextlib
import inspect
import json
import os
from collections.abc import Awaitable, Callable
from dataclasses import MISSING
from dataclasses import fields as dataclass_fields
from typing import Any, cast

from fastapi import HTTPException, Request
from omegaconf import OmegaConf

from machinable.api.models import (
    ConfigField,
    ExecutionInfo,
    InterfaceInfo,
    ModuleSchema,
    ProjectIndex,
    ProjectModule,
    VersionMethod,
    WidgetInfo,
)
from machinable.config import from_interface
from machinable.execution import Execution
from machinable.interface import Interface, connection_scope
from machinable.project import Project, import_interface
from machinable.utils import safe_path, serialize


def _abspath(path: str) -> str:
    return os.path.normpath(os.path.abspath(os.path.expanduser(path)))


def _within(directory: str, root: str) -> bool:
    directory, root = _abspath(directory), _abspath(root)
    return directory == root or directory.startswith(root + os.sep)


def default_project_dir(request: Request) -> str:
    return _abspath(getattr(request.app.state, "project_dir", None) or os.getcwd())


def resolve_project_dir(request: Request, explicit: str | None = None) -> str:
    """Resolve the project directory a request targets.

    Precedence: ``explicit`` → ``?project=`` query → ``X-Machinable-Project``
    header → the server's default project. Secure by default: a non-default
    project is only permitted when it falls under a configured
    ``project_roots`` allowlist.
    """
    requested = (
        explicit
        or request.query_params.get("project")
        or request.headers.get("X-Machinable-Project")
    )
    default = default_project_dir(request)
    if not requested:
        return default
    directory = _abspath(requested)
    if directory == default:
        return directory
    roots = getattr(request.app.state, "project_roots", None) or []
    if any(_within(directory, root) for root in roots):
        return directory
    raise HTTPException(
        status_code=403,
        detail=(
            f"Project '{directory}' is not permitted; configure the server's "
            "project_roots to allow opening additional projects."
        ),
    )


async def project_context(request: Request):
    """FastAPI dependency: enter the request's Project in an isolated context.

    Runs as an async dependency so the (context-local) connection stack it sets
    is inherited by both async routes and sync routes dispatched to the
    threadpool.
    """
    directory = resolve_project_dir(request)
    username = request.headers.get("X-Machinable-User")
    request.state.project = directory
    request.state.username = username
    with connection_scope(), Project(directory, username=username):
        yield directory


def log_event(request: Request, message: str) -> None:
    """Append to the server's in-memory activity log (shown in the TUI)."""
    queue = getattr(request.app.state, "event_log", None)
    if queue is not None:
        queue.append(message)


def request_project_dir(request: Request) -> str:
    """The project directory bound to the current request (set by the dependency)."""
    directory = getattr(request.state, "project", None)
    return directory or resolve_project_dir(request)


def open_projects(request: Request) -> list[str]:
    """Project directories the server currently holds cached state for."""
    projects = set(request.app.state.interfaces.keys())
    projects.add(default_project_dir(request))
    return sorted(projects)


def _interfaces_for(request: Request) -> dict[str, Interface]:
    by_project = request.app.state.interfaces
    return by_project.setdefault(request_project_dir(request), {})


def _meta_for(request: Request) -> dict[str, dict[str, Any]]:
    by_project = request.app.state.interface_meta
    return by_project.setdefault(request_project_dir(request), {})


def resolved_config(interface: Interface) -> dict[str, Any]:
    """Return resolved config without machinable introspection keys."""
    if interface.config is None:
        return {}
    container = OmegaConf.to_container(interface.config, resolve=True)
    if not isinstance(container, dict):
        return {}
    return {str(k): v for k, v in container.items() if not str(k).startswith("_")}


def _iso_datetime(value) -> str | None:
    if value is None:
        return None
    return str(value)


def interface_to_info(
    interface: Interface,
    meta: dict[str, Any] | None = None,
) -> InterfaceInfo:
    executions = [
        item
        for item in interface.executions
        if item is not None and item.uuid is not None
    ]
    latest = executions[-1] if executions else None
    return InterfaceInfo(
        uuid=interface.uuid or "",
        module=interface.module,
        kind=interface.kind or "Interface",
        config=resolved_config(interface),
        predicate=interface.predicate,
        version=interface.version(),
        cli=interface.to_cli(),
        cached=interface.cached(),
        created_at=interface.created_at().isoformat(),
        created_by=interface.created_by,
        label=interface.label,
        meta=meta or {},
        execution_count=len(executions),
        latest_execution_uuid=latest.uuid if latest else None,
    )


def execution_to_info(execution: Execution, status=None) -> ExecutionInfo:
    # The Interface this run belongs to is its index parent
    # (Execution.interface reads it).
    parent = execution.interface
    parent_uuid = parent.uuid if parent is not None and parent.uuid else ""

    # one status read instead of a directory resolution per is_*/*_at accessor;
    # callers that already hold a snapshot (e.g. list_executions) pass it in
    st = status if status is not None else execution.status_snapshot()

    return ExecutionInfo(
        uuid=execution.uuid or "",
        module=execution.module,
        config=resolved_config(execution),
        version=execution.version(),
        cli=execution.to_cli(),
        seed=execution.seed,
        nickname=execution.nickname,
        resources=execution._model.resources,
        parent_uuid=parent_uuid,
        is_started=st.is_started,
        is_active=st.is_active,
        is_finished=st.is_finished,
        is_incomplete=st.is_incomplete,
        is_live=st.is_live,
        is_resumed=st.is_resumed,
        started_at=_iso_datetime(st.started_at),
        resumed_at=_iso_datetime(st.resumed_at),
        finished_at=_iso_datetime(st.finished_at),
        heartbeat_at=_iso_datetime(st.heartbeat_at),
        created_at=execution.created_at().isoformat(),
        created_by=execution.created_by,
        label=execution.label,
    )


def get_interface_meta(request: Request) -> dict[str, dict[str, Any]]:
    return _meta_for(request)


def get_or_create_interface(uuid: str, request: Request) -> Interface:
    """Return cached instance; load from the current project's Index; else 404."""
    cache = _interfaces_for(request)
    if uuid not in cache:
        interface = Interface.find_by_id(uuid)
        if interface is None:
            raise HTTPException(status_code=404, detail="Interface not found")
        cache[uuid] = interface
    return cache[uuid]


def create_interface_from_target(
    request: Request,
    target: str,
    version: list[str | dict] | None = None,
    meta: dict[str, Any] | None = None,
    *,
    uuid: str | None = None,
    label: str | None = None,
) -> Interface:
    """Create or attach to an Interface from a module path or uuid.

    When ``uuid`` is given, the instance is created with that client-supplied id
    (content-addressed); creating again with the same id is an idempotent no-op
    that returns the existing instance.
    """
    cache = _interfaces_for(request)
    meta_store = _meta_for(request)

    if uuid is not None and uuid in cache:
        interface = cache[uuid]
    elif target in cache:
        interface = cache[target]
    else:
        # Resolve `target` as an existing interface id first, i.e. a record id (any
        # length) or a content-hash uuid, and only treat it as a module path to
        # instantiate when no such instance exists.
        existing = Interface.find_by_id(target)
        if existing is None and uuid is not None:
            existing = Interface.find_by_id(uuid)
        if existing is not None:
            interface = existing
        else:
            interface = Interface.make(target, version=version or [])
            if label is not None:
                interface.set_label(label)
            interface.materialize(record_id=uuid)
        cache[cast(str, interface.uuid)] = interface

    if label is not None and interface.label != label:
        interface.set_label(label)
    if meta:
        meta_store[cast(str, interface.uuid)] = meta
    return interface


def search_interfaces(request: Request, req) -> Any:
    """Run a generic config search over the current project's index."""
    from machinable.api.models import SearchItem, SearchResponse
    from machinable.index import Index

    entries, total = Index.get().search(req)
    items = [
        SearchItem(
            id=entry.record_id,
            module=entry.module,
            kind=entry.kind,
            config={
                k: v
                for k, v in (entry.config.resolved or {}).items()
                if not str(k).startswith("_")
            },
            created_at_ns=entry.created_at_ns,
            created_by=entry.created_by,
            label=entry.label,
        )
        for entry in entries
    ]
    return SearchResponse(items=items, total=total)


def evict_interface(uuid: str, request: Request) -> None:
    _interfaces_for(request).pop(uuid, None)
    _meta_for(request).pop(uuid, None)


def resolve_interface_config(request: Request, target: str, version) -> Any:
    """Dry-run: expand a compact version to resolved config without materializing."""
    from machinable.api.models import ResolveResponse

    interface = Interface.make(target, version=version or [])
    config = resolved_config(interface)  # triggers resolution, no materialization
    return ResolveResponse(
        module=interface.module,
        version=interface.version(),
        config=config,
        predicate=interface.predicate,
        cli=interface.to_cli(),
    )


def interface_lifecycle(request: Request, target: str, version, context=None) -> Any:
    """Content-addressed compute lifecycle for a config (no materialize, no run).

    Resolves the config to its content identity, under the same ordered
    ``context`` stack it was dispatched with so that a scoped config matches, and
    reports where it sits: ``draft`` (never created) → ``running`` (a live
    run) → ``cached`` (finished, readable) / ``failed`` (a run started but
    did not complete).
    """
    from machinable.api.models import LifecycleResponse, LifecycleStatus

    # Look up under the same `with`-contexts the config was created under
    # (Scope etc. fold into its predicate at make time), exactly like
    # dispatch / the CLI element chain.
    with contextlib.ExitStack() as stack:
        for ctx in context or []:
            stack.enter_context(Interface.make(ctx.target, version=ctx.version))
        found = Interface.find(target, version=version or [])

    if not found:
        return LifecycleResponse(
            target=target,
            module=None,
            uuid=None,
            status=LifecycleStatus.draft,
            cached=False,
            execution_uuid=None,
        )

    interface = found[-1]
    executions = [
        item
        for item in interface.executions
        if item is not None and item.uuid is not None
    ]
    latest = executions[-1] if executions else None
    execution_uuid = latest.uuid if latest else None

    try:
        marker_cached = interface.cached()
    except Exception:  # noqa: BLE001 - cached() is best-effort here
        marker_cached = False

    # A finished run means the result is on disk even when the interface does not
    # use the explicit cached() memo marker.
    available = bool(marker_cached or (latest is not None and latest.is_finished()))

    if available:
        status = LifecycleStatus.cached
    elif latest is not None and (latest.is_active() or latest.is_live()):
        status = LifecycleStatus.running
    elif latest is not None and latest.is_incomplete():
        status = LifecycleStatus.failed
    else:
        status = LifecycleStatus.draft

    return LifecycleResponse(
        target=target,
        module=interface.module,
        uuid=interface.uuid,
        status=status,
        cached=available,
        execution_uuid=execution_uuid,
    )


def interface_provenance(
    request: Request,
    uuid: str,
    depth: int = 8,
    rels: set[str] | None = None,
) -> Any:
    """The provenance graph: how a materialized interface came to be.

    Assembled by the core ``machinable.provenance`` module (shared with the MCP tool and
    ``Interface.provenance()``).
    """
    from machinable.provenance import build_provenance_graph

    interface = get_or_create_interface(uuid, request)
    return build_provenance_graph(interface, depth=depth, rels=rels)


def interface_data_status(request: Request, uuid: str) -> Any:
    """Whether a run's stored data is readable now (local / remote / evicted)."""
    from machinable.api.models import DataStatusResponse
    from machinable.index import Index

    interface = get_or_create_interface(uuid, request)
    entry = Index.get().get_by_id(uuid)
    mounted = interface.is_mounted()
    return DataStatusResponse(
        uuid=uuid,
        available=mounted,
        mounted=mounted,
        storage_uri=entry.storage_uri if entry else None,
        local_uri=entry.local_uri if entry else None,
        bytes_missing=bool(entry.bytes_missing) if entry else False,
    )


def interface_related(request: Request, uuid: str) -> Any:
    """The interface's related/lineage neighbours (derived, uses, executions, …)."""
    from machinable.api.models import RelatedItem, RelatedResponse

    interface = get_or_create_interface(uuid, request)
    items = [
        RelatedItem(
            uuid=r.uuid,
            module=r.module,
            kind=r.kind or "Interface",
            version=r.version(),
            label=r.label,
        )
        for r in interface.related(deep=False)
        if r is not None and r.uuid is not None
    ]
    return RelatedResponse(uuid=uuid, related=items)


def list_remotes(request: Request) -> Any:
    """Shareable interfaces the project resolves by URL (slurm, globus, …)."""
    from machinable.api.models import RemotesResponse

    remotes: dict = {}
    if Project.is_connected():
        try:
            remotes = Project.get().provider().on_resolve_remotes() or {}
        except Exception:  # noqa: BLE001 - discovery is best-effort
            remotes = {}
    return RemotesResponse(remotes=remotes)


def invoke_api_method(
    interface: Interface,
    method: str,
    args: list[Any],
    kwargs: dict[str, Any],
) -> Any:
    if method.startswith("_"):
        raise ValueError(f"Cannot call private method '{method}'")

    allowlist = getattr(interface.__class__, "__api_methods__", None)
    if allowlist is not None and method not in allowlist:
        raise ValueError(f"Method '{method}' is not exposed via the API")

    fn = getattr(interface, method, None)
    if fn is None or not callable(fn):
        raise AttributeError(f"Method '{method}' not found")

    return fn(*args, **kwargs)


def json_payload(value: Any) -> Any:
    # `serialize` is the object-level hook
    # (datetime/UUID/BaseModel/OmegaConf -> native).
    # NOT `normjson`, which is a full json.dumps and would double-encode to a string.
    return json.loads(json.dumps(value, default=serialize))


@contextlib.asynccontextmanager
async def attach_emit_bridge(
    interface: Interface,
    send_frame: Callable[..., Awaitable[None]],
):
    """Wire :meth:`Interface.emit` to WebSocket ``event`` frames for one WS call."""
    queue: asyncio.Queue = asyncio.Queue()
    loop = asyncio.get_running_loop()
    interface._emit_queue = queue
    interface._emit_loop = loop

    async def drain() -> None:
        while True:
            msg = await queue.get()
            if msg is None:
                break
            payload = msg["payload"]
            # widget-tagged emits become first-class widget frames; the rest
            # are generic `event` pushes.
            if isinstance(payload, dict) and "__widget__" in payload:
                tag = payload["__widget__"] or {}
                if tag.get("kind") == "change":
                    await send_frame(
                        type="widget_change",
                        payload={"changes": json_payload(tag.get("changes", {}))},
                        final=True,
                    )
                else:
                    await send_frame(
                        type="widget_msg",
                        payload={"content": json_payload(tag.get("content"))},
                        final=True,
                    )
                continue
            await send_frame(
                type="event",
                payload=json_payload(payload),
                final=True,
            )

    task = asyncio.create_task(drain())
    try:
        yield
    finally:
        interface._emit_queue = None
        interface._emit_loop = None
        await queue.put(None)
        await task


async def dispatch_call_result(
    send,
    *,
    msg_id: str,
    result: Any,
) -> None:
    if inspect.isasyncgen(result):
        async for item in result:
            await send(
                type="stream",
                id=msg_id,
                payload=json_payload(item),
                final=False,
            )
        await send(type="stream", id=msg_id, payload=None, final=True)
        return

    if inspect.isgenerator(result):
        for item in result:
            await send(
                type="stream",
                id=msg_id,
                payload=json_payload(item),
                final=False,
            )
        await send(type="stream", id=msg_id, payload=None, final=True)
        return

    await send(
        type="result",
        id=msg_id,
        payload=json_payload(result),
        final=True,
    )


async def run_api_call(
    interface: Interface,
    method: str,
    args: list[Any],
    kwargs: dict[str, Any],
) -> Any:
    fn = getattr(interface, method, None)
    if fn is None or not callable(fn):
        raise AttributeError(f"Method '{method}' not found")

    if inspect.iscoroutinefunction(fn):
        return await invoke_api_method(interface, method, args, kwargs)

    if inspect.isasyncgenfunction(fn):
        return invoke_api_method(interface, method, args, kwargs)

    result = await asyncio.to_thread(invoke_api_method, interface, method, args, kwargs)
    return result


async def run_widget_call(
    interface: Interface,
    method: str,
    args: list[Any],
) -> Any:
    """Invoke a fixed widget-protocol method (bypassing the ``call`` allowlist).

    ``widget_state`` / ``widget_update`` / ``widget_message`` are protocol hooks,
    not arbitrary user calls, so they are not subject to ``__api_methods__``.
    """
    fn = getattr(interface, method, None)
    if fn is None or not callable(fn):
        raise AttributeError(f"Widget method '{method}' not found")
    if inspect.iscoroutinefunction(fn):
        return await fn(*args)
    return await asyncio.to_thread(fn, *args)


def list_executions(
    *,
    active: bool | None = None,
    incomplete: bool | None = None,
    parent: str | None = None,
    limit: int = 100,
) -> list[ExecutionInfo]:
    from machinable.api.models import FindRequest
    from machinable.index import Index

    items = (
        Index.get()
        .find(FindRequest(kind="Execution", parent_id=parent, limit=limit))
        .items
    )
    results: list[ExecutionInfo] = []
    for item in items:
        execution = Interface.find_by_id(item.record_id)
        if execution is None or not isinstance(execution, Execution):
            continue
        # single status read reused for both filtering and serialization
        st = execution.status_snapshot()
        if active is True and not st.is_active:
            continue
        if active is False and st.is_active:
            continue
        if incomplete is True and not st.is_incomplete:
            continue
        if incomplete is False and st.is_incomplete:
            continue
        results.append(execution_to_info(execution, status=st))
    return results


def list_interface_files(interface: Interface) -> list[str]:
    root = interface.local_directory()
    if not os.path.isdir(root):
        return []
    files: list[str] = []
    for dirpath, _, filenames in os.walk(root):
        for name in filenames:
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, root)
            if rel.startswith("."):
                continue
            files.append(rel.replace(os.sep, "/"))
    return sorted(files)


def read_interface_file(interface: Interface, path: str) -> Any:
    try:
        full = safe_path(interface.local_directory(), path)
    except ValueError as ex:
        raise HTTPException(status_code=404, detail="File not found") from ex
    if not os.path.isfile(full):
        raise HTTPException(status_code=404, detail="File not found")
    with open(full, encoding="utf-8") as handle:
        content = handle.read()
    if path.endswith(".json"):
        return json.loads(content)
    return content


def discover_project_modules(project_dir: str) -> ProjectIndex:
    from machinable.utils import skip_source_dir
    from machinable.widget import is_widget

    modules: list[ProjectModule] = []
    for root, dirs, files in os.walk(project_dir):
        dirs[:] = [d for d in dirs if not skip_source_dir(d)]
        for filename in files:
            if not filename.endswith(".py") or filename.startswith("_"):
                continue
            rel_path = os.path.relpath(os.path.join(root, filename), project_dir)
            module_name = rel_path[:-3].replace(os.sep, ".")
            try:
                interface_class = import_interface(project_dir, module_name, Interface)
            except Exception:
                continue
            if interface_class is Interface:
                continue
            modules.append(
                ProjectModule(
                    module=module_name,
                    kind=interface_class.kind or "Interface",
                    doc=inspect.getdoc(interface_class),
                    widget=is_widget(interface_class),
                )
            )
    modules.sort(key=lambda item: item.module)
    return ProjectIndex(project=os.path.abspath(project_dir), modules=modules)


def module_schema(project_dir: str, module: str) -> ModuleSchema:
    interface_class = import_interface(project_dir, module, Interface)
    default_config, config_model = from_interface(interface_class)
    config_fields: list[ConfigField] = []

    if config_model is not None:
        for name, field in config_model.model_fields.items():
            if name.endswith("_"):
                continue
            if hasattr(field, "is_required"):
                required = field.is_required()
                default = None if required else field.default
            else:
                default = field.default
                required = getattr(field, "required", False)
            config_fields.append(
                ConfigField(
                    name=name,
                    type=str(field.annotation),
                    default=default,
                    required=required,
                )
            )
    elif default_config:
        for name, value in default_config.items():
            if name.endswith("_"):
                continue
            config_fields.append(
                ConfigField(
                    name=name,
                    type=type(value).__name__,
                    default=value,
                    required=False,
                )
            )
    else:
        config_cls = getattr(interface_class, "Config", None)
        if config_cls is not None and inspect.isclass(config_cls):
            if hasattr(config_cls, "model_fields"):
                for name, field in config_cls.model_fields.items():
                    if name.endswith("_"):
                        continue
                    config_fields.append(
                        ConfigField(
                            name=name,
                            type=str(field.annotation),
                            default=field.default,
                            required=field.is_required(),
                        )
                    )
            else:
                for field in dataclass_fields(config_cls):
                    if field.name.endswith("_"):
                        continue
                    config_fields.append(
                        ConfigField(
                            name=field.name,
                            type=str(field.type),
                            default=(
                                field.default if field.default is not MISSING else None
                            ),
                            required=field.default is MISSING,
                        )
                    )

    versions = []
    version_methods = []
    for name, fn in inspect.getmembers(interface_class, inspect.isfunction):
        if not name.startswith("version_"):
            continue
        token = name[len("version_") :]
        versions.append(token)
        try:
            signature = (
                str(inspect.signature(fn))
                .replace("(self, ", "(")
                .replace("(self)", "()")
            )
        except (ValueError, TypeError):
            signature = "(...)"
        version_methods.append(
            VersionMethod(name=token, signature=signature, doc=inspect.getdoc(fn))
        )

    from machinable.widget import is_widget, widget_css

    widget = None
    if is_widget(interface_class):
        widget = WidgetInfo(
            meta=getattr(interface_class, "widget_meta", {}) or {},
            esm_url=f"/v1/project/{module}/widget/esm",
            css_url=(
                f"/v1/project/{module}/widget/css"
                if widget_css(interface_class)
                else None
            ),
        )

    return ModuleSchema(
        module=module,
        kind=interface_class.kind or "Interface",
        doc=inspect.getdoc(interface_class),
        config_fields=config_fields,
        versions=versions,
        version_methods=version_methods,
        widget=widget,
    )


def active_execution_count() -> int:
    from machinable.api.models import FindRequest
    from machinable.index import Index

    count = 0
    for item in Index.get().find(FindRequest(kind="Execution", limit=1000)).items:
        # fetch=False: never pull remote bytes for a health-poll count, and one
        # status read per run rather than the is_active() accessor storm.
        execution = Execution.find_by_id(item.record_id, fetch=False)
        if isinstance(execution, Execution) and execution.status_snapshot().is_active:
            count += 1
    return count


def current_project_path() -> str | None:
    if Project.is_connected():
        return Project.get().path()
    return None
