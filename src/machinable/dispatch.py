"""Serverless dispatch: run an Execution without a server.

Reads a ``DispatchRequest`` (byte-for-byte the model ``POST /v1/executions``
accepts) and runs it in three phases:

1. **Dispatch-time, always synchronous**: connect the ambient Project,
   materialize each interface within its ordered ``with``-context stack,
   materialize (or find continuable) the run-record, and write
   ``dispatched_at``, so malformed dispatches fail loudly on the caller's
   stderr, before any supervision.
2. **Print the handle** (uuid / record_dir / storage_uri per run;
   ``with_metadata`` inlines the kilobyte record bundle so a remote caller
   can ingest the records into its own index in the same round trip).
3. **Supervise the payload**, the only branch:
   - ``foreground``: run the payload inline (the caller owns it, e.g. CI, or a
     scheduler job re-entering recursively: a handoff Execution's generated
     script invokes ``machinable dispatch --foreground`` itself).
   - handoff Execution (``Execution.handoff``): call its ``dispatch()``,
     which *submits* (fast); the scheduler owns the payload; no detach.
   - otherwise (``detach``, the default): re-invoke
     ``machinable dispatch --foreground`` as a detached child that survives
     the caller (SSH disconnects, laptop sleep); the parent returns as soon
     as the handle is printed.

Continuation is what makes the phases compose: the payload, wherever it
runs, finds the phase-1 run-record via ``Execution._resumable_run``
(dispatched-or-started, unfinished, same runner identity) and continues it
in place, so ``dispatched_at → started_at → finished_at`` land in one
record directory and the filesystem state machine reads
``pending → live → finished`` with no server anywhere.
"""

from __future__ import annotations

import contextlib
import json
import os
import subprocess
import sys
import time
from typing import cast

from machinable.utils import load_file, save_file, uri_to_path

REQUEST_FILENAME = "dispatch_request.json"
LOG_FILENAME = "dispatch.log"


def _build(request: dict):
    """Phase 1 (minus markers) of a serverless dispatch.

    Materializes the Execution container and each interface under its context
    stack; mirrors ``POST /v1/executions``.
    """
    from machinable.execution import Execution
    from machinable.interface import Interface

    if request.get("execution_ref"):
        execution = Execution.find_by_id(request["execution_ref"])
        if not isinstance(execution, Execution):
            raise ValueError(f"execution {request['execution_ref']} not found")
    elif request.get("execution"):
        spec = request["execution"]
        execution = cast(
            "Execution", Execution.make(spec["target"], version=spec.get("version"))
        )
    else:
        execution = Execution()

    entries = list(request.get("interfaces") or [])
    if not entries:
        raise ValueError("No interfaces to dispatch")

    interfaces = []
    for entry in entries:
        with contextlib.ExitStack() as stack:
            for ctx in entry.get("context") or []:
                stack.enter_context(
                    Interface.make(ctx["target"], version=ctx.get("version"))
                )
            interface = Interface.make(entry["target"], version=entry.get("version"))
            interface.materialize()
            execution.add(interface)
            interfaces.append(interface)
    return execution, interfaces


def _record_bundle(directory: str) -> dict:
    """The kilobyte metadata bundle for one record directory.

    Header, model, status markers, edges: everything a remote index needs to
    ingest the record at ``bytes_missing``.
    """
    from machinable.format import ID_FILENAME, UPDATED_AT_FILENAME

    bundle = {
        "id": load_file([directory, ID_FILENAME], None),
        "model": load_file([directory, "model.json"], None),
        "markers": {},
        "edges": load_file([directory, "related", "metadata.jsonl"], []),
    }
    for marker in (
        "dispatched_at",
        "started_at",
        "heartbeat_at",
        "finished_at",
        "resumed_at",
        UPDATED_AT_FILENAME,
    ):
        value = load_file([directory, marker], None)
        if value is not None:
            bundle["markers"][marker] = str(value).strip()
    return bundle


def dispatch_request(
    request: dict,
    *,
    project: str | None = None,
    mode: str = "detach",
    with_metadata: bool = False,
    wait: bool = False,
) -> dict:
    """Execute a serverless dispatch; returns the handle dict.

    ``mode``: ``"foreground"`` (payload inline), ``"detach"`` (default; a
    handoff Execution submits instead of detaching), or ``"prepare"``
    (phase 1 + handle only, the building block for tests/tools).
    """
    directory = os.path.abspath(project or os.getcwd())
    # Run with cwd = project dir, like the CLI inside a project, so module
    # resolution and relative project paths behave identically for the
    # dispatch parent and its detached/scheduler-run child (which always
    # executes with cwd=project). Project *identity* no longer depends on the
    # cwd (location-free since format v1), so this is about import parity,
    # not identity.
    previous_cwd = os.getcwd()
    os.chdir(directory)
    try:
        return _dispatch_connected(
            request,
            directory,
            mode=mode,
            with_metadata=with_metadata,
            wait=wait,
        )
    finally:
        os.chdir(previous_cwd)


def _dispatch_connected(
    request: dict,
    directory: str,
    *,
    mode: str,
    with_metadata: bool,
    wait: bool,
) -> dict:
    from machinable.interface import connection_scope
    from machinable.project import Project

    with connection_scope(), Project(directory):
        execution, interfaces = _build(request)

        runs = []
        pairs = []  # (run, interface); cached interfaces produce no run
        for interface in interfaces:
            if interface.cached():
                continue  # finished result exists, nothing to dispatch
            entry = execution.prepare_dispatch(interface)
            record_dir = uri_to_path(entry.local_uri or entry.storage_uri)
            run = {
                "uuid": entry.record_id,
                "parent_uuid": interface.uuid,
                "record_dir": record_dir,
                "storage_uri": entry.storage_uri,
            }
            runs.append(run)
            pairs.append((run, interface))

        handle: dict = {"runs": runs, "project": directory}
        if runs:
            handle.update(runs[0])  # spec shape for the single-interface case
        if with_metadata:
            metadata = {}
            for run, interface in pairs:
                metadata[run["parent_uuid"]] = _record_bundle(
                    interface.local_directory()
                )
                metadata[run["uuid"]] = _record_bundle(run["record_dir"])
            handle["metadata"] = metadata

        if not runs:
            # everything cached means terminal already; nothing to supervise
            return handle

        if mode == "prepare":
            return handle

        if mode == "foreground":
            if execution.handoff:
                # inside the scheduler job (recursive re-entry): the caller IS
                # the supervisor: run the payload, not the submission.
                for interface in interfaces:
                    if not interface.cached():
                        execution.dispatch_interface(interface)
            else:
                execution.dispatch()
        elif execution.handoff:
            # dispatch-time submits; the scheduler owns the payload from here
            execution.dispatch()
        else:
            _spawn_detached(request, directory, runs[0]["record_dir"])

        if wait and mode != "foreground":
            _wait_for(runs)
    return handle


def _spawn_detached(request: dict, project: str, record_dir: str) -> None:
    """Re-invoke ``machinable dispatch --foreground`` as a detached child.

    The child survives the caller (setsid on POSIX; DETACHED_PROCESS on
    Windows), reads the request from a file persisted in the run directory
    (provenance + no stdin plumbing), and logs to ``dispatch.log``.
    """
    request_path = save_file([record_dir, REQUEST_FILENAME], request)
    log_path = os.path.join(record_dir, LOG_FILENAME)

    args = [
        sys.executable,
        "-m",
        "machinable",
        "dispatch",
        "--foreground",
        "--project",
        project,
    ]
    kwargs: dict = {}
    if os.name == "nt":
        DETACHED_PROCESS = 0x00000008
        CREATE_NEW_PROCESS_GROUP = 0x00000200
        kwargs["creationflags"] = DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP
    else:
        kwargs["start_new_session"] = True  # setsid: survive SIGHUP
    with (
        open(request_path, encoding="utf-8") as stdin,
        open(log_path, "a", encoding="utf-8") as log,
    ):
        subprocess.Popen(
            args,
            stdin=stdin,
            stdout=log,
            stderr=log,
            cwd=project,
            close_fds=True,
            **kwargs,
        )


def _wait_for(runs: list[dict], poll_seconds: float = 0.5) -> None:
    """Block until every run's ``finished_at`` marker appears."""
    pending = {run["record_dir"] for run in runs}
    while pending:
        pending = {d for d in pending if load_file([d, "finished_at"], None) is None}
        if pending:
            time.sleep(poll_seconds)


def main(args: list[str]) -> int:
    """CLI entry point for ``machinable dispatch``.

    ``machinable dispatch [--foreground|--detach|--prepare] [--wait]
    [--with-metadata] [--project DIR]`` with the DispatchRequest JSON on stdin.
    """
    mode = "detach"
    wait = False
    with_metadata = False
    project = None
    it = iter(args)
    for arg in it:
        if arg == "--foreground":
            mode = "foreground"
        elif arg == "--detach":
            mode = "detach"
        elif arg == "--prepare":
            mode = "prepare"
        elif arg == "--wait":
            wait = True
        elif arg == "--with-metadata":
            with_metadata = True
        elif arg == "--project":
            project = next(it, None)
        elif arg == "--json":
            pass  # the handle is always JSON
        else:
            print(f"Unrecognized option '{arg}'", file=sys.stderr)
            return 128

    try:
        request = json.load(sys.stdin)
    except json.JSONDecodeError as ex:
        print(f"Invalid DispatchRequest on stdin: {ex}", file=sys.stderr)
        return 128

    sys.path.append(project or os.getcwd())
    handle = dispatch_request(
        request,
        project=project,
        mode=mode,
        with_metadata=with_metadata,
        wait=wait,
    )
    print(json.dumps(handle), flush=True)
    return 0
