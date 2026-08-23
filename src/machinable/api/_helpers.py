"""Shared helpers for the machinable HTTP/WS API."""

from __future__ import annotations

import asyncio
import contextlib
import inspect
import json
import os
from collections.abc import Awaitable, Callable
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
from machinable.execution import Execution
from machinable.interface import Interface, connection_scope
from machinable.project import Project
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
    threadpool. An in-process server (``Server.start()`` in a notebook kernel)
    passes the caller's ambient Storage/Index as ``ambient_connections``; they
    are re-entered per request so the API sees the same records as the
    surrounding code.
    """
    directory = resolve_project_dir(request)
    username = request.headers.get("X-Machinable-User")
    request.state.project = directory
    request.state.username = username
    with (
        connection_scope(),
        Project(directory, username=username),
        contextlib.ExitStack() as stack,
    ):
        for spec in getattr(request.app.state, "ambient_connections", None) or []:
            stack.enter_context(Interface.make(spec["target"], version=spec["version"]))
        yield directory


def log_event(request: Request, message: str) -> None:
    """Append to the server's in-memory activity log."""
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
        is_pending=st.is_pending,
        is_started=st.is_started,
        is_active=st.is_active,
        is_finished=st.is_finished,
        is_incomplete=st.is_incomplete,
        is_live=st.is_live,
        is_resumed=st.is_resumed,
        dispatched_at=_iso_datetime(st.dispatched_at),
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
    include_status = bool(getattr(req, "include_status", False))
    items = []
    for entry in entries:
        item = SearchItem(
            id=entry.record_id,
            module=entry.module,
            kind=entry.kind,
            config={
                k: v
                for k, v in (entry.config.resolved or {}).items()
                if not str(k).startswith("_")
            },
            version=list(entry.config.version or []),
            created_at_ns=entry.created_at_ns,
            created_by=entry.created_by,
            label=entry.label,
        )
        if include_status and entry.kind != "Execution":
            item.status, item.run_count = _entry_status(entry.record_id)
        items.append(item)
    return SearchResponse(items=items, total=total)


def _entry_status(uuid: str) -> tuple[str, int]:
    """Compute status + run count for one search hit, from its latest run.

    Page-bounded (search ``limit`` caps the lookups) and index-first: one index
    query for the newest run summary, one record read for its markers.
    """
    from machinable.api.models import FindRequest, SortSpec
    from machinable.index import Index

    found = Index.get().find(
        FindRequest(
            kind="Execution",
            parent_id=uuid,
            sort=[SortSpec(by="created_at_ns", direction="desc")],
            limit=1,
        )
    )
    if not found.items:
        return "draft", 0
    latest = Interface.find_by_id(found.items[0].record_id)
    if latest is None or not isinstance(latest, Execution):
        return "draft", found.total
    status = latest.status_snapshot()
    if status.is_finished:
        return "cached", found.total
    if status.is_active:
        return "running", found.total
    if status.is_incomplete:
        return "failed", found.total
    if status.is_pending:
        return "pending", found.total
    return "draft", found.total


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
    reports where it sits: ``draft`` (never created) → ``pending`` (dispatched
    to a scheduler, still queued) → ``running`` (a live run) → ``cached``
    (finished, readable) / ``failed`` (a run started but did not complete).
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
    elif latest is not None and latest.is_pending():
        status = LifecycleStatus.pending
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
    pending: bool | None = None,
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
        if pending is True and not st.is_pending:
            continue
        if pending is False and st.is_pending:
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


# ── invalid-config reporting ──────────────────────────────────────────────────
# A config the server cannot construct is the CLIENT's error, not a server fault, and
# every route that builds one owes the same answer: which field, and what is wrong with
# it. Kept here rather than in one router because resolve, lifecycle, call and dispatch
# all build a config from (target, version) and used to disagree — resolve reported
# issues while the others returned a bare 500, so the identical mistake was legible in
# one panel and a mystery in the next.


def config_issues(ex: Exception) -> list[dict]:
    """Field-attached issue list for a config failure.

    Walks the cause chain because configure() re-wraps failures in a
    ConfigurationError; the structured location lives on the original.
    """
    current: BaseException | None = ex
    while current is not None:
        paths = getattr(current, "paths", None)  # ConfigurationError (unknown keys)
        if paths:
            return [{"path": path, "message": str(current)} for path in paths]
        errors = getattr(current, "errors", None)  # pydantic ValidationError
        if callable(errors):
            try:
                return [
                    {
                        "path": ".".join(str(loc) for loc in error.get("loc", ()))
                        or None,
                        "message": error.get("msg", str(current)),
                    }
                    for error in errors()
                ]
            except Exception:  # noqa: BLE001 - fall through to the generic issue
                pass
        current = current.__cause__
    return [{"path": None, "message": str(ex)}]


def is_config_error(ex: BaseException) -> bool:
    """Whether ``ex`` is a config the client got wrong, as opposed to a server fault.

    Deliberately narrow. A validator that raises and a disk that cannot be read both
    surface as exceptions while building an interface, but only the first is a 400 —
    reporting the second as one would tell the user to fix a config that is fine.
    """
    from pydantic import ValidationError

    from machinable.errors import ConfigurationError

    current: BaseException | None = ex
    while current is not None:
        if isinstance(current, ValidationError | ConfigurationError):
            return True
        current = current.__cause__
    return False


def config_error(ex: Exception) -> HTTPException:
    """``ex`` as a 400 detailing ``{"message", "issues": [{"path", "message"}]}``."""
    return HTTPException(
        status_code=400,
        detail={"message": str(ex), "issues": config_issues(ex)},
    )


def _project_for(project_dir: str) -> Project:
    if Project.is_connected():
        connected = Project.get()
        if _abspath(connected.path()) == _abspath(project_dir):
            return connected
    return Project(project_dir)


def _to_config_field(f) -> ConfigField:
    return ConfigField(
        name=f.name,
        type=f.type,
        default=f.default,
        required=f.required,
        identifying=f.identifying,
        fields=[_to_config_field(x) for x in f.fields] if f.fields else None,
        description=getattr(f, "description", None),
        constraints=getattr(f, "constraints", None) or None,
    )


def discover_project_modules(project_dir: str) -> ProjectIndex:
    project = _project_for(project_dir)
    modules = [
        ProjectModule(
            module=m.module,
            kind=m.kind,
            doc=m.doc,
            widget=m.widget,
            resolved=m.resolved,
        )
        for m in project.modules()
    ]
    return ProjectIndex(project=os.path.abspath(project_dir), modules=modules)


def module_schema(project_dir: str, module: str) -> ModuleSchema:
    from machinable.api.models import ConfigMethod

    project = _project_for(project_dir)
    schema = project.module_schema(module)

    widget = None
    if schema.widget is not None:
        widget = WidgetInfo(
            meta=schema.widget.meta,
            esm_url=f"/v1/project/{module}/widget/esm",
            css_url=(
                f"/v1/project/{module}/widget/css" if schema.widget.has_css else None
            ),
        )
    return ModuleSchema(
        module=schema.module,
        kind=schema.kind,
        doc=schema.doc,
        config_fields=[_to_config_field(f) for f in schema.config_fields],
        versions=schema.versions,
        version_methods=[
            VersionMethod(
                name=v.name, signature=v.signature, doc=v.doc, source_line=v.source_line
            )
            for v in schema.version_methods
        ],
        config_methods=[
            ConfigMethod(
                name=c.name, signature=c.signature, doc=c.doc, source_line=c.source_line
            )
            for c in schema.config_methods
        ],
        axes=schema.axes,
        axis_methods=[
            VersionMethod(
                name=a.name, signature=a.signature, doc=a.doc, source_line=a.source_line
            )
            for a in schema.axis_methods
        ],
        widget=widget,
        source_file=schema.source_file,
        source_line=schema.source_line,
        resolved=schema.resolved,
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
