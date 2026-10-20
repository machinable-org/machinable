"""The MCP's functions over REST: its tools, resources and prompts.

What machinable's MCP server (``machinable mcp``) serves, for a caller that is
not an MCP client or has no machinable of its own: a gateway that serves the
MCP for many machines and runs each tool where the project is, or a client
without Python reading the guide of the machinable a server runs. Each answers
as the MCP does, bound to the request's project, read-only (sources are edited
through the source API).
"""

from __future__ import annotations

import inspect
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from machinable.api._helpers import json_payload, project_context

router = APIRouter(prefix="/v1/mcp", tags=["mcp"])


class MCPArguments(BaseModel):
    """The arguments of a tool or prompt, by name."""

    arguments: dict[str, Any] = Field(default_factory=dict)


def _context(directory: str):
    from machinable.mcp.context import MCPContext

    return MCPContext(project_dir=directory, read_only=True)


def _doc(fn: Any) -> str:
    return inspect.cleandoc(fn.__doc__ or "")


def _invoke(fn: Any, arguments: dict[str, Any]) -> Any:
    """``fn(**arguments)``: 400 for arguments it does not take, 403 for a write."""
    try:
        inspect.signature(fn).bind(**arguments)
    except TypeError as ex:
        raise HTTPException(status_code=400, detail=str(ex)) from ex
    try:
        return fn(**arguments)
    except PermissionError as ex:
        raise HTTPException(status_code=403, detail=str(ex)) from ex
    except Exception as ex:  # noqa: BLE001 - the tool's error, named for the caller
        raise HTTPException(
            status_code=500, detail=f"{type(ex).__name__}: {ex}"
        ) from ex


@router.get("")
def describe(directory: str = Depends(project_context)) -> dict[str, Any]:
    """The MCP's instructions, tools, resources and prompts, each with its doc."""
    from machinable.mcp import prompts, resources, tools
    from machinable.mcp.server import INSTRUCTIONS

    ctx = _context(directory)
    return {
        "instructions": INSTRUCTIONS,
        "tools": {
            name: {"doc": _doc(fn), "signature": str(inspect.signature(fn))}
            for name, fn in tools.functions(ctx).items()
        },
        "resources": {
            uri: {"doc": _doc(fn), "mime_type": resources.MIME_TYPES.get(uri)}
            for uri, fn in resources.functions(ctx).items()
        },
        "prompts": {
            name: {"doc": _doc(fn), "signature": str(inspect.signature(fn))}
            for name, fn in prompts.functions(ctx).items()
        },
    }


@router.get("/resources")
def read_resource(uri: str, directory: str = Depends(project_context)) -> dict:
    """One resource, by its URI (``guide://authoring``, ``examples://axis``).

    ``module://<module>`` is a module of the request's project. Answers
    ``{"uri", "mime_type", "content"}``: the content is text, or JSON for the
    inference catalog and a module's schema. 404 for a URI no resource serves.
    """
    from machinable.mcp import resources

    ctx = _context(directory)
    matched = resources.match(uri, resources.MIME_TYPES)
    try:
        content = resources.read(ctx, uri)
    except LookupError as ex:
        raise HTTPException(status_code=404, detail=str(ex)) from ex
    return {
        "uri": uri,
        "mime_type": resources.MIME_TYPES.get(matched[0]) if matched else None,
        "content": json_payload(content),
    }


@router.post("/prompts/{name}")
def get_prompt(
    name: str, body: MCPArguments, directory: str = Depends(project_context)
) -> dict:
    """The text of the prompt ``name`` with ``arguments``."""
    from machinable.mcp import prompts

    fn = prompts.functions(_context(directory)).get(name)
    if fn is None:
        raise HTTPException(status_code=404, detail=f"No prompt {name!r}")
    return {"name": name, "text": _invoke(fn, body.arguments)}


@router.post("/tools/{name}")
def call_tool(
    name: str, body: MCPArguments, directory: str = Depends(project_context)
) -> dict:
    """The tool ``name`` called with ``arguments``: ``{"result": ...}``, as the MCP.

    The tool runs in this server (or the request's worker), in the request's
    project. Read-only: the source tools answer 403. A run is better dispatched
    with ``POST /v1/executions``, which answers at once; the ``launch`` tool
    answers when its runs did.
    """
    from machinable.mcp import tools

    fn = tools.functions(_context(directory)).get(name)
    if fn is None:
        raise HTTPException(status_code=404, detail=f"No tool {name!r}")
    return {"result": json_payload(_invoke(fn, body.arguments))}
