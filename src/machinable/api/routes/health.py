"""Health route."""

from __future__ import annotations

import time

from fastapi import APIRouter, Request

import machinable
from machinable.api._helpers import (
    active_execution_count,
    default_project_dir,
    open_projects,
)
from machinable.api.models import HealthResponse
from machinable.interface import connection_scope
from machinable.project import Project

router = APIRouter(prefix="/v1/health", tags=["health"])


@router.get("", response_model=HealthResponse)
def health(request: Request) -> HealthResponse:
    default = default_project_dir(request)
    with connection_scope(), Project(default):
        active = active_execution_count()
    return HealthResponse(
        status="ok",
        version=machinable.__version__,
        project=default,
        projects=open_projects(request),
        executions_active=active,
        uptime_seconds=time.monotonic() - request.app.state.started_at,
    )
