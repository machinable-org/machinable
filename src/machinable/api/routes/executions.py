"""Execution lifecycle routes."""

from __future__ import annotations

import contextlib
import threading
import time
from typing import cast

from fastapi import APIRouter, Depends, HTTPException, Request, WebSocket

from machinable.api._helpers import (
    _interfaces_for,
    execution_to_info,
    get_or_create_interface,
    list_executions,
    project_context,
    request_project_dir,
)
from machinable.api._helpers import (
    log_event as _log_event,
)
from machinable.api.models import DispatchRequest, ExecutionInfo
from machinable.api.ws import handle_interface_ws
from machinable.execution import Execution
from machinable.interface import Interface, connection_scope
from machinable.project import Project

router = APIRouter(prefix="/v1/executions", tags=["executions"])


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

    def _run() -> None:
        # the background thread re-enters the project in its own isolated
        # connection stack, independent of this request's teardown.
        try:
            with connection_scope(), Project(directory, username=username):
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
        except Exception as ex:
            _log_event(request, f"dispatch failed: {ex}")

    thread = threading.Thread(target=_run, daemon=True)
    thread.start()

    deadline = time.monotonic() + 10
    while time.monotonic() < deadline:
        execution = holder["execution"]
        if execution is not None and execution.uuid is not None:
            break
        time.sleep(0.01)

    execution = holder["execution"]
    if execution is None or execution.uuid is None:
        raise HTTPException(status_code=500, detail="Execution failed to start")

    _interfaces_for(request)[execution.uuid] = execution
    _log_event(request, f"POST /v1/executions -> {execution.uuid}")
    return execution_to_info(execution)


@router.get("", response_model=list[ExecutionInfo])
def list_all_executions(
    request: Request,
    active: bool | None = None,
    incomplete: bool | None = None,
    parent: str | None = None,
    limit: int = 100,
    _p: str = Depends(project_context),
) -> list[ExecutionInfo]:
    return list_executions(
        active=active,
        incomplete=incomplete,
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


@router.get("/{uuid}/output")
def get_execution_output(
    uuid: str, request: Request, _p: str = Depends(project_context)
) -> dict[str, str | None]:
    execution = get_or_create_interface(uuid, request)
    if not isinstance(execution, Execution):
        raise HTTPException(status_code=404, detail="Execution not found")
    return {"output": execution.output()}


@router.post("/{uuid}/cancel", status_code=204)
def cancel_execution(
    uuid: str, request: Request, _p: str = Depends(project_context)
) -> None:
    """Best-effort cancel: write a ``cancelled`` marker into the run's directory.

    A live dispatch's watcher polls for it and injects ExecutionInterrupted; a not-yet-
    started or already-finished run simply carries the marker (a no-op). No execution-
    engine coupling.
    """
    execution = get_or_create_interface(uuid, request)
    if not isinstance(execution, Execution):
        raise HTTPException(status_code=404, detail="Execution not found")
    execution.save_file(
        "cancelled", data="cancelled"
    )  # the watcher polls for this marker
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
