"""Build the machinable MCP server (FastMCP) for a bound project."""

from __future__ import annotations

from typing import Any

from machinable.mcp.context import MCPContext

INSTRUCTIONS = """\
machinable research MCP: author interfaces and run scientific inferences over their
results, code all the way down. Read `guide://authoring` first. Config is always a
`pydantic.BaseModel`; encode experiment axes as `version_*` methods (`~versions`);
expose one run's measurement as a `<quantity>()` accessor. Ask questions with the
inference tools (`outperforms`, `converges_faster`, …); when one returns a `needs`
contract, `write_source` the named accessor and re-run. Verdicts are content-addressed
and cached, so re-asking unchanged operands is a no-op.
"""


def create_server(
    project_dir: str = ".",
    *,
    token: str | None = None,
    read_only: bool = False,
    name: str = "machinable",
) -> Any:
    """Create a FastMCP server bound to ``project_dir``.

    ``read_only`` omits/guards the write tools (untrusted sessions). ``token`` is the
    shared secret for remote transports. Requires the ``mcp`` extra (``fastmcp``).
    """
    from fastmcp import FastMCP

    from machinable.mcp.prompts import register_prompts
    from machinable.mcp.resources import register_resources
    from machinable.mcp.tools import register_tools

    ctx = MCPContext(project_dir=project_dir, token=token, read_only=read_only)
    mcp = FastMCP(name=name, instructions=INSTRUCTIONS)
    register_tools(mcp, ctx)
    register_resources(mcp, ctx)
    register_prompts(mcp, ctx)
    return mcp
