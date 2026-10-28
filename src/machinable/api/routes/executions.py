"""Execution lifecycle routes."""

from __future__ import annotations

import asyncio
import contextlib
import json
import threading
import time
from typing import Any, cast

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    WebSocket,
    WebSocketDisconnect,
)

from machinable.api._helpers import (
    _interfaces_for,
    config_error,
    execution_to_info,
    get_or_create_interface,
    is_config_error,
    list_executions,
    project_context,
    request_attribution,
    request_project_dir,
    resolve_project_dir,
    results_record,
    serve_result,
    server_context,
)
from machinable.api._helpers import (
    log_event as _log_event,
)
from machinable.api.models import DispatchRequest, ExecutionInfo, OutputChunk
from machinable.api.ws import handle_interface_ws
from machinable.errors import NotFound
from machinable.execution import Execution
from machinable.interface import Interface, resolve_uses

router = APIRouter(prefix="/v1/executions", tags=["executions"])


def _cached_run(interface: Interface, record_id: str | None = None) -> Execution | None:
    """The latest run-record of a cached interface."""
    from machinable.api.models import FindRequest
    from machinable.index import Index

    if record_id is not None:
        run = Interface.find_by_id(record_id)
        if isinstance(run, Execution):
            return run
    children = (
        Index.get()
        .find(FindRequest(parent_id=interface.uuid, kind="Execution", limit=1))
        .items
    )
    if children:
        run = Interface.find_by_id(children[0].record_id)
        if isinstance(run, Execution):
            return run
    return None


def _running_run(interface: Interface, record_id: str) -> Execution | None:
    """The run-record ``record_id`` of ``interface``, running elsewhere."""
    from machinable.storage import claim_storages

    run = Interface.find_by_id(record_id, fetch=False)
    if isinstance(run, Execution):
        return run
    for storage in claim_storages():
        for found in storage.run_records(interface):
            if found.record_id == record_id and storage.adopt(found):
                run = Interface.find_by_id(record_id, fetch=False)
                return run if isinstance(run, Execution) else None
    return None


def _answers(execution: Execution) -> list[tuple[str, Interface, str | None]]:
    """Why each queued interface was not dispatched here, in queue order.

    ``("cached", interface, run id or None)`` or ``("running", interface, run id)``;
    a cached interface has its run id when it was finished elsewhere.
    """
    answers: list[tuple[str, Interface, str | None]] = []
    for interface in execution.interfaces:
        reason, record_id = execution.elsewhere.get(
            cast(str, interface.uuid), (None, None)
        )
        if interface.cached():
            finished = record_id if reason == "finished elsewhere" else None
            answers.append(("cached", interface, finished))
            continue
        if reason == "running elsewhere":
            answers.append(("running", interface, record_id))
    return answers


@router.post("", response_model=ExecutionInfo)
def dispatch_execution(
    body: DispatchRequest, request: Request, _p: str = Depends(project_context)
) -> ExecutionInfo:
    """Dispatch interfaces into an Execution, each under its context stack.

    Mirrors the CLI element chain (``machinable get … --launch``): for each
    interface, the context interfaces are entered in order (and exited in
    reverse) so their predicates fold into the interface's identity at
    materialization; the interfaces are added to the Execution container,
    which is then dispatched. Project is the request's ambient project.
    """
    entries = list(body.interfaces)
    if not entries:
        raise HTTPException(status_code=400, detail="No interfaces to dispatch")

    directory = request_project_dir(request)
    username = getattr(request.state, "username", None)
    holder: dict[str, Execution | None] = {"execution": None}
    failure: dict[str, BaseException | None] = {"error": None}
    answers: list[tuple[str, Interface, str | None]] = []
    # the interfaces dispatched, in request order (an axis as its members)
    added: list[str] = []
    app = request.app

    running = getattr(app.state, "dispatches", None)
    if running is None:
        running = app.state.dispatches = set()

    def _run() -> None:
        # counted while it runs, so the server is not idle (GET /v1/health)
        running.add(threading.current_thread())
        try:
            with server_context(app, directory, username=username):
                if body.execution_ref:
                    execution = cast(
                        Execution, Execution.find_by_id(body.execution_ref)
                    )
                    if not isinstance(execution, Execution):
                        raise ValueError(f"execution {body.execution_ref} not found")
                elif body.execution is not None:
                    execution = cast(
                        Execution,
                        Execution.make(
                            body.execution.target, version=body.execution.version
                        ),
                    )
                else:
                    execution = Execution()
                execution.wait_elsewhere(False)
                holder["execution"] = execution

                for entry in entries:
                    # Enter the interface's context interfaces in order
                    # (Scope or any interface); materialize WITHIN the stack
                    # so the context predicate is captured into the
                    # interface's identity; then add to the Execution.
                    with contextlib.ExitStack() as stack:
                        for ctx in entry.context:
                            stack.enter_context(
                                Interface.make(ctx.target, version=ctx.version)
                            )
                        uses = resolve_uses(entry.uses)
                        interface = Interface.make(
                            entry.target, version=entry.version, uses=uses
                        )
                        for member in _members(interface, entry.target, uses):
                            if member.uuid not in added:
                                added.append(cast(str, member.uuid))
                                execution.add(member)
                execution.dispatch()
                if execution.uuid is None:
                    answers.extend(_answers(execution))
        except Exception as ex:
            failure["error"] = ex
            _log_event(request, f"dispatch failed: {ex}")
        finally:
            running.discard(threading.current_thread())

    thread = threading.Thread(target=_run, daemon=True)
    thread.start()

    deadline = time.monotonic() + 10
    while time.monotonic() < deadline:
        execution = holder["execution"]
        if execution is not None and execution.uuid is not None:
            break
        if not thread.is_alive():
            break
        time.sleep(0.01)

    if answers and failure["error"] is None and not thread.is_alive():
        answered = _answer(request, directory, username, answers, deadline)
        if answered is not None:
            return answered.model_copy(update={"interface_uuids": list(added)})

    execution = holder["execution"]
    if execution is None or execution.uuid is None:
        error = failure["error"]
        if error is not None and is_config_error(error):
            raise config_error(cast(Exception, error)) from error
        if isinstance(error, NotFound):
            raise HTTPException(status_code=404, detail=str(error)) from error
        if error is not None:
            raise HTTPException(
                status_code=500,
                detail=f"Execution failed to start: {type(error).__name__}: {error}",
            ) from error
        raise HTTPException(
            status_code=500, detail="Execution failed to start (timed out)"
        )

    _interfaces_for(request)[execution.uuid] = execution
    _log_event(request, f"POST /v1/executions -> {execution.uuid}")
    return execution_to_info(execution).model_copy(
        update={"interface_uuids": list(added)}
    )


def _is_aggregate(interface: Interface) -> bool:
    """An interface whose own ``launch()`` lays out its runs.

    Not machinable's own overrides (the server's ``launch()`` serves).
    """
    launch = type(interface).launch
    return launch is not Interface.launch and not getattr(
        launch, "__module__", ""
    ).startswith("machinable.")


def _members(
    interface: Interface, target: str, uses: list[Interface] | None = None
) -> list[Interface]:
    """What launching ``interface`` runs, materialized, as ``launch()`` lays it out.

    ``interface`` itself; each member of its axis (``~~name``), made and
    materialized inside the contexts its axis element yields (a
    ``machinable.scope``); or the runs an aggregate's own ``launch()`` lays
    out (collected without running, :attr:`Interface.interfaces`), each
    materialized in the contexts it was laid out in. So each is the record an
    in-process launch makes, and it records its contexts, which its run enters
    again (so it sees its scope).
    """
    if _is_aggregate(interface):
        members = list(interface.interfaces)
        for member in members:
            with member._creation_context():
                member.materialize()
        return members
    if not interface.is_unexpanded():
        interface.materialize()
        return [interface]
    members = []
    for version, contexts in interface._expansion_spec():
        with contextlib.ExitStack() as stack:
            for context in contexts:
                stack.enter_context(context)
            member = Interface.make(target, version=version, uses=uses)
            member.materialize()
            members.append(member)
    return members


def _answer(
    request: Request,
    directory: str,
    username: str | None,
    answers: list[tuple[str, Interface, str | None]],
    deadline: float,
) -> ExecutionInfo | None:
    """The response when nothing was dispatched here."""
    cached: list[Execution] = []
    running: list[Execution] = []
    first: Execution | None = None
    with server_context(request.app, directory, username=username):
        for kind, interface, record_id in answers:
            run = None
            if kind == "cached":
                run = _cached_run(interface, record_id)
            else:
                # the claimant writes its run-record right after claiming
                while run is None:
                    run = _running_run(interface, cast(str, record_id))
                    if run is not None or time.monotonic() >= deadline:
                        break
                    time.sleep(0.05)
            if run is None:
                continue
            (cached if kind == "cached" else running).append(run)
            if first is None:
                first = run
        if first is None:
            return None
        for run in cached + running:
            _interfaces_for(request)[cast(str, run.uuid)] = run
        info = execution_to_info(first)
    _log_event(
        request,
        f"POST /v1/executions -> {'running elsewhere' if running else 'cached'}"
        f" {info.uuid}",
    )
    return info.model_copy(
        update={
            "cached": not running,
            "cached_uuids": [cast(str, r.uuid) for r in cached],
            "running_elsewhere": bool(running),
            "running_elsewhere_uuids": [cast(str, r.uuid) for r in running],
        }
    )


@router.get("", response_model=list[ExecutionInfo])
def list_all_executions(
    request: Request,
    active: bool | None = None,
    incomplete: bool | None = None,
    pending: bool | None = None,
    parent: str | None = None,
    limit: int = 100,
    _p: str = Depends(project_context),
) -> list[ExecutionInfo]:
    return list_executions(
        active=active,
        incomplete=incomplete,
        pending=pending,
        parent=parent,
        limit=limit,
    )


@router.get("/{uuid}", response_model=ExecutionInfo)
def get_execution(
    uuid: str, request: Request, _p: str = Depends(project_context)
) -> ExecutionInfo:
    execution = get_or_create_interface(uuid, request)
    if not isinstance(execution, Execution):
        raise HTTPException(status_code=404, detail="Execution not found")
    return execution_to_info(execution)


@router.get("/{uuid}/output", response_model=OutputChunk)
def get_execution_output(
    uuid: str,
    request: Request,
    offset: int | None = None,
    tail: int | None = None,
    limit: int = 65536,
    _p: str = Depends(project_context),
) -> OutputChunk:
    """A bounded window of the run's output log (never the whole file).

    ``offset`` reads forward from a byte position — poll with ``offset=size``
    to fetch only appended bytes; ``tail`` reads the last N bytes; the default
    is the last ``limit`` bytes. ``limit`` is capped server-side, so a client
    cannot accidentally pull a multi-GB log into memory.
    """
    from machinable.utils import read_output_window

    execution = get_or_create_interface(uuid, request)
    if not isinstance(execution, Execution):
        raise HTTPException(status_code=404, detail="Execution not found")
    data, start, size = read_output_window(
        execution.output_filepath(),
        offset=offset,
        tail=tail,
        limit=max(1, min(limit, 262144)),
    )
    return OutputChunk(output=data, offset=start, size=size)


@router.post("/{uuid}/cancel", status_code=204)
def cancel_execution(
    uuid: str, request: Request, _p: str = Depends(project_context)
) -> None:
    """Best-effort cancel: write a ``cancelled`` marker into the run's directory.

    A live dispatch's watcher polls for it and injects ExecutionInterrupted; a not-yet-
    started or already-finished run simply carries the marker (a no-op). No execution-
    engine coupling. The marker travels to wherever the payload is running, so a run
    handed to another machine is cancellable too (see :meth:`Execution.cancel`).
    """
    execution = get_or_create_interface(uuid, request)
    if not isinstance(execution, Execution):
        raise HTTPException(status_code=404, detail="Execution not found")
    execution.cancel()
    _log_event(request, f"POST /v1/executions/{uuid}/cancel")


@router.get("/{uuid}/results")
def get_results(
    uuid: str, request: Request, _p: str = Depends(project_context)
) -> dict[str, Any]:
    """The run's declared results: its ``results.json``, read from its files.

    ``uuid`` is a run-record (whose results are its interface's) or the
    interface itself. Served without importing the interface, so a server
    without its code (or its Python environment) serves them. A run that
    saved no results: ``{"results": {}}``.
    """
    from machinable.results import ResultError, read_manifest

    entry, directory = results_record(uuid)
    try:
        manifest = read_manifest(directory)
    except ResultError as ex:
        raise HTTPException(status_code=422, detail=str(ex)) from ex
    return {
        "uuid": entry.record_id,
        **(manifest or {"version": 1, "complete": False, "results": {}}),
    }


@router.get("/{uuid}/results/{name}")
def get_result(
    uuid: str,
    name: str,
    request: Request,
    item: int | None = None,
    start: int | None = None,
    stop: int | None = None,
    _p: str = Depends(project_context),
) -> dict[str, Any]:
    """One result, as JSON: a json result's ``value``; otherwise ``data``.

    A table's columns (rows ``start`` to ``stop``, or row ``item``), an
    array's item (``?item=12``: index 12 along the first axis) or items
    ``start`` to ``stop`` (nested lists), a ragged result's item or items.
    Without ``item`` or a slice, the whole result (413 past 4M values). NaN
    and infinities are null. Only the chunks asked for are read.
    """
    entry, directory = results_record(uuid)
    return serve_result(entry, directory, name, item=item, start=start, stop=stop)


@router.websocket("/{uuid}/results/ws")
async def results_ws(websocket: WebSocket, uuid: str) -> None:
    """Follow a run's results: a ``results`` frame now and whenever they change.

    ``{"type": "results", "uuid": ..., "manifest": {...}}``, the manifest as
    ``GET /v1/executions/{uuid}/results`` gives it; checked every
    ``?interval=`` seconds (default 1). A record that is not there:
    an ``error`` frame, then the socket closes.
    """
    from machinable.api.ws import _AppRequest
    from machinable.results import ResultError, read_manifest

    request = cast(Request, _AppRequest(websocket))
    await websocket.accept()
    try:
        interval = min(60.0, max(0.2, float(websocket.query_params.get("interval", 1))))
        directory = resolve_project_dir(request)
    except (ValueError, HTTPException) as ex:
        await websocket.send_text(
            json.dumps({"type": "error", "payload": {"message": str(ex)}})
        )
        await websocket.close()
        return
    username, claims = request_attribution(request)

    def look() -> dict[str, Any]:
        with server_context(websocket.app, directory, username=username, claims=claims):
            entry, record = results_record(uuid)
            try:
                manifest = read_manifest(record)
            except ResultError:
                manifest = None
            return {
                "type": "results",
                "uuid": entry.record_id,
                "manifest": manifest
                or {"version": 1, "complete": False, "results": {}},
            }

    sent: str | None = None
    try:
        while True:
            try:
                frame = await asyncio.to_thread(look)
            except HTTPException as ex:
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "error",
                            "payload": {"code": "not_found", "message": ex.detail},
                        }
                    )
                )
                await websocket.close()
                return
            text = json.dumps(frame, sort_keys=True)
            if text != sent:
                await websocket.send_text(text)
                sent = text
            try:
                message = await asyncio.wait_for(websocket.receive(), timeout=interval)
            except TimeoutError:
                continue
            if message.get("type") == "websocket.disconnect":
                return
    except WebSocketDisconnect:
        return


@router.websocket("/ws")
async def execution_ws(websocket: WebSocket) -> None:
    class _Request:
        app = websocket.app

    _request = cast(Request, _Request())

    await handle_interface_ws(
        websocket,
        connect_only_execution=True,
        log_event=lambda msg: _log_event(_request, msg),
    )
