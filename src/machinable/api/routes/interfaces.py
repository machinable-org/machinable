"""Interface catalog, files, and WebSocket routes."""

from __future__ import annotations

from typing import Any, cast

from fastapi import APIRouter, Depends, HTTPException, Request, WebSocket

from machinable.api._helpers import (
    _interfaces_for,
    create_interface_from_target,
    evict_interface,
    get_interface_meta,
    get_or_create_interface,
    interface_data_status,
    interface_lifecycle,
    interface_provenance,
    interface_related,
    interface_to_info,
    json_payload,
    list_executions,
    list_interface_files,
    project_context,
    read_interface_file,
    resolve_interface_config,
    run_api_call,
    search_interfaces,
)
from machinable.api._helpers import (
    log_event as _log_event,
)
from machinable.api.models import (
    CreateInterfaceRequest,
    DataStatusResponse,
    ExecutionInfo,
    FindRequest,
    InterfaceCallRequest,
    InterfaceInfo,
    LifecycleRequest,
    LifecycleResponse,
    ProvenanceGraph,
    RelatedResponse,
    ResolveRequest,
    ResolveResponse,
    SearchResponse,
    SetLabelRequest,
)
from machinable.api.ws import handle_interface_ws
from machinable.execution import Execution

router = APIRouter(prefix="/v1/interfaces", tags=["interfaces"])


@router.get("", response_model=list[InterfaceInfo])
def list_interfaces(
    request: Request, _p: str = Depends(project_context)
) -> list[InterfaceInfo]:
    meta = get_interface_meta(request)
    items: list[InterfaceInfo] = []
    for uuid, interface in _interfaces_for(request).items():
        if isinstance(interface, Execution):
            continue
        items.append(interface_to_info(interface, meta.get(uuid, {})))
    return items


@router.post("", response_model=InterfaceInfo)
def create_interface(
    body: CreateInterfaceRequest,
    request: Request,
    _p: str = Depends(project_context),
) -> InterfaceInfo:
    """Create (materialize) an interface, optionally with a client-supplied id.

    Idempotent in ``uuid``: creating again with the same id returns the existing
    instance unchanged (content-addressed dedupe).
    """
    interface = create_interface_from_target(
        request,
        body.target,
        version=body.version,
        meta=body.meta,
        uuid=body.uuid,
        label=body.label,
    )
    if isinstance(interface, Execution):
        raise HTTPException(
            status_code=400,
            detail="Use POST /v1/executions to create executions",
        )
    _log_event(request, f"POST /v1/interfaces -> {interface.uuid}")
    return interface_to_info(
        interface, get_interface_meta(request).get(interface.uuid, {})
    )


@router.post("/search", response_model=SearchResponse)
def search(
    body: FindRequest,
    request: Request,
    _p: str = Depends(project_context),
) -> SearchResponse:
    """Generic config search over interface instances (operators, sort, paging)."""
    return search_interfaces(request, body)


@router.post("/resolve", response_model=ResolveResponse)
def resolve(
    body: ResolveRequest,
    request: Request,
    _p: str = Depends(project_context),
) -> ResolveResponse:
    """Dry-run a compact version → resolved config + CLI, without materializing."""
    try:
        return resolve_interface_config(request, body.target, body.version)
    except Exception as ex:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=str(ex)) from ex


@router.post("/lifecycle", response_model=LifecycleResponse)
def lifecycle(
    body: LifecycleRequest,
    request: Request,
    _p: str = Depends(project_context),
) -> LifecycleResponse:
    """Content-addressed compute lifecycle for a config.

    One of: draft / running / cached / failed.
    """
    return interface_lifecycle(request, body.target, body.version, body.context)


@router.post("/call")
async def call_interface(
    body: InterfaceCallRequest,
    request: Request,
    _p: str = Depends(project_context),
) -> dict[str, Any]:
    interface = create_interface_from_target(
        request,
        body.target,
        version=body.version,
        meta=body.meta,
    )
    _log_event(
        request,
        f"POST /v1/interfaces/call {body.method} -> {interface.uuid}",
    )
    result = await run_api_call(interface, body.method, body.args, body.kwargs)
    if (
        hasattr(result, "__aiter__")
        or hasattr(result, "__iter__")
        and not isinstance(result, str | bytes | dict | list)
    ):
        raise HTTPException(
            status_code=400,
            detail="Streaming methods are not supported on /call",
        )
    return {"payload": json_payload(result)}


@router.websocket("/ws")
async def interface_ws(websocket: WebSocket) -> None:
    class _Request:
        app = websocket.app

    _request = cast(Request, _Request())

    await handle_interface_ws(
        websocket,
        log_event=lambda msg: _log_event(_request, msg),
    )


@router.get("/{uuid}", response_model=InterfaceInfo)
def get_interface(
    uuid: str, request: Request, _p: str = Depends(project_context)
) -> InterfaceInfo:
    interface = get_or_create_interface(uuid, request)
    if isinstance(interface, Execution):
        raise HTTPException(status_code=404, detail="Interface not found")
    return interface_to_info(interface, get_interface_meta(request).get(uuid, {}))


@router.patch("/{uuid}/label", response_model=InterfaceInfo)
def set_interface_label(
    uuid: str,
    body: SetLabelRequest,
    request: Request,
    _p: str = Depends(project_context),
) -> InterfaceInfo:
    """Set/replace an interface's mutable label (FCFS / last-write-wins)."""
    interface = get_or_create_interface(uuid, request)
    interface.set_label(body.label)
    _log_event(request, f"PATCH /v1/interfaces/{uuid}/label -> {body.label!r}")
    return interface_to_info(interface, get_interface_meta(request).get(uuid, {}))


@router.delete("/{uuid}", status_code=204)
def delete_interface(
    uuid: str, request: Request, _p: str = Depends(project_context)
) -> None:
    if uuid not in _interfaces_for(request):
        get_or_create_interface(uuid, request)
    evict_interface(uuid, request)


@router.get("/{uuid}/executions", response_model=list[ExecutionInfo])
def list_interface_executions(
    uuid: str,
    request: Request,
    active: bool | None = None,
    limit: int = 100,
    _p: str = Depends(project_context),
) -> list[ExecutionInfo]:
    get_or_create_interface(uuid, request)
    return list_executions(active=active, parent=uuid, limit=limit)


@router.get("/{uuid}/provenance", response_model=ProvenanceGraph)
def get_provenance(
    uuid: str,
    request: Request,
    depth: int = 8,
    rels: str | None = None,
    _p: str = Depends(project_context),
) -> ProvenanceGraph:
    """The provenance graph: how this interface came to be.

    Recipe (config/context/derivation) plus history (executions, each with the
    Manifest it used), as a normalized node-link DAG. ``depth`` bounds the
    walk; ``rels`` (comma-separated edge labels, e.g.
    ``derivation,runs,manifest``) overrides the default policy.
    """
    rel_set = {r.strip() for r in rels.split(",") if r.strip()} if rels else None
    return interface_provenance(request, uuid, depth=depth, rels=rel_set)


@router.get("/{uuid}/data", response_model=DataStatusResponse)
def get_data_status(
    uuid: str, request: Request, _p: str = Depends(project_context)
) -> DataStatusResponse:
    """Whether the run's stored data is readable now (local / remote / evicted)."""
    return interface_data_status(request, uuid)


@router.get("/{uuid}/related", response_model=RelatedResponse)
def get_related(
    uuid: str, request: Request, _p: str = Depends(project_context)
) -> RelatedResponse:
    """The interface's lineage neighbours (derived, uses, executions, …)."""
    return interface_related(request, uuid)


@router.post("/{uuid}/archive", response_model=InterfaceInfo)
def archive_interface(
    uuid: str,
    request: Request,
    restore: bool = False,
    _p: str = Depends(project_context),
) -> InterfaceInfo:
    """Soft-archive (hide) an interface, or restore it with ?restore=true."""
    interface = get_or_create_interface(uuid, request)
    interface.hidden(not restore)
    return interface_to_info(interface, get_interface_meta(request).get(uuid, {}))


@router.get("/{uuid}/files")
def list_files(
    uuid: str, request: Request, _p: str = Depends(project_context)
) -> dict[str, list[str]]:
    interface = get_or_create_interface(uuid, request)
    return {"files": list_interface_files(interface)}


@router.get("/{uuid}/files/{path:path}")
def read_file(
    uuid: str, path: str, request: Request, _p: str = Depends(project_context)
) -> Any:
    interface = get_or_create_interface(uuid, request)
    return read_interface_file(interface, path)
