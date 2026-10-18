"""Execution lifecycle routes."""

from __future__ import annotations

import contextlib
import threading
import time
from typing import cast

from fastapi import APIRouter, Depends, HTTPException, Request, WebSocket

from machinable.api._helpers import (
    _interfaces_for,
    config_error,
    execution_to_info,
    get_or_create_interface,
    is_config_error,
    list_executions,
    project_context,
    request_project_dir,
    server_context,
)
from machinable.api._helpers import (
    log_event as _log_event,
)
from machinable.api.models import DispatchRequest, ExecutionInfo, OutputChunk
from machinable.api.ws import handle_interface_ws
from machinable.execution import Execution
from machinable.interface import Interface

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
    app = request.app

    def _run() -> None:
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
                        interface = Interface.make(entry.target, version=entry.version)
                        interface.materialize()
                        execution.add(interface)
                execution.dispatch()
                if execution.uuid is None:
                    answers.extend(_answers(execution))
        except Exception as ex:
            failure["error"] = ex
            _log_event(request, f"dispatch failed: {ex}")

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
            return answered

    execution = holder["execution"]
    if execution is None or execution.uuid is None:
        error = failure["error"]
        if error is not None and is_config_error(error):
            raise config_error(cast(Exception, error)) from error
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
    return execution_to_info(execution)


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
