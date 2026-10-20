"""Health route."""

from __future__ import annotations

import asyncio
import time

from fastapi import APIRouter, Request

import machinable
from machinable.api._helpers import (
    active_execution_ids,
    default_project_dir,
    open_projects,
    server_context,
)
from machinable.api.models import HealthResponse, WorkerHealth

router = APIRouter(prefix="/v1/health", tags=["health"])


def _local_active(app, directory: str) -> list[str]:
    with server_context(app, directory):
        return active_execution_ids()


@router.get("", response_model=HealthResponse)
async def health(request: Request) -> HealthResponse:
    """The server's health; a gateway's counts the runs in its workers too.

    Each live worker is asked for its own health (briefly; one that does not
    answer counts 0), so an idle check of the gateway sees a run in any
    worker. A run seen by several (a shared index) is counted once.
    """
    app = request.app
    default = default_project_dir(request)
    registry = getattr(app.state, "workers", None)
    workers = registry.workers() if registry is not None else []
    local, answers = await asyncio.gather(
        asyncio.to_thread(_local_active, app, default),
        asyncio.gather(*(worker.health() for worker in workers)),
    )
    active = set(local)
    unlisted = 0
    reports: list[WorkerHealth] = []
    for worker, answer in zip(workers, answers, strict=True):
        answer = answer or {}
        count = int(answer.get("executions_active") or 0)
        ids = answer.get("active_executions")
        if isinstance(ids, list):
            active.update(str(i) for i in ids)
        else:  # an older worker: counted, not de-duplicated
            unlisted += count
        reports.append(
            WorkerHealth(
                directory=worker.directory,
                python=worker.python,
                pid=worker.proc.pid,
                responding=bool(answer),
                executions_active=count,
                executions_running=int(answer.get("executions_running") or 0),
                requests_active=worker.active,
            )
        )
    running = getattr(app.state, "dispatches", None) or ()
    return HealthResponse(
        status="ok",
        version=machinable.__version__,
        project=default,
        projects=open_projects(request),
        executions_active=len(active) + unlisted,
        executions_running=sum(1 for t in list(running) if t.is_alive()),
        active_executions=sorted(active),
        workers=reports,
        uptime_seconds=time.monotonic() - app.state.started_at,
    )
