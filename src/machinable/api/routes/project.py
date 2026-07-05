"""Project introspection routes."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Request, Response

from machinable.api._helpers import (
    default_project_dir,
    discover_project_modules,
    list_remotes,
    module_schema,
    open_projects,
    project_context,
    resolve_project_dir,
)
from machinable.api.models import ModuleSchema, ProjectIndex, RemotesResponse
from machinable.interface import Interface
from machinable.project import import_interface
from machinable.widget import is_widget, widget_css, widget_esm

router = APIRouter(prefix="/v1/project", tags=["project"])
projects_router = APIRouter(prefix="/v1/projects", tags=["project"])


def _project_dir(request: Request) -> str:
    # honours ?project= / X-Machinable-Project, falling back to the default
    return resolve_project_dir(request)


@projects_router.get("")
def list_open_projects(request: Request) -> dict:
    """List the projects the server can serve.

    The default, any with live state, the allowlist roots, and any
    process-isolated workers currently running.
    """
    workers = getattr(request.app.state, "workers", None)
    return {
        "default": default_project_dir(request),
        "open": open_projects(request),
        "roots": list(getattr(request.app.state, "project_roots", []) or []),
        "workers": workers.listing() if workers is not None else [],
    }


@router.get("", response_model=ProjectIndex)
def list_project_modules(request: Request) -> ProjectIndex:
    return discover_project_modules(_project_dir(request))


# registered before the greedy /{module:path} schema route so it matches first
@router.get("/remotes", response_model=RemotesResponse)
def get_remotes(
    request: Request, _p: str = Depends(project_context)
) -> RemotesResponse:
    """Shareable interfaces the project resolves by URL (slurm, globus, …)."""
    return list_remotes(request)


# registered before the greedy /{module:path} schema route so it matches first
@router.get("/{module}/widget/{asset}")
def get_widget_asset(module: str, asset: str, request: Request) -> Response:
    """Serve a widget's ES module or stylesheet (module-level assets)."""
    if asset not in ("esm", "css"):
        raise HTTPException(status_code=404, detail="Unknown widget asset")
    # resolve outside the try so a project-authorization 403 is not masked as 404
    project_dir = _project_dir(request)
    try:
        interface_class = import_interface(project_dir, module, Interface)
    except Exception as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex
    if not is_widget(interface_class):
        raise HTTPException(status_code=404, detail="Module declares no widget")

    if asset == "esm":
        source = widget_esm(interface_class)
        media_type = "text/javascript"
    else:
        source = widget_css(interface_class)
        media_type = "text/css"
    if source is None:
        raise HTTPException(status_code=404, detail=f"Widget has no {asset}")
    return Response(content=source, media_type=media_type)


@router.get("/{module:path}", response_model=ModuleSchema)
def get_module_schema(module: str, request: Request) -> ModuleSchema:
    try:
        return module_schema(_project_dir(request), module)
    except Exception as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex
