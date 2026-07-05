"""machinable MCP: a research-driving MCP server over machinable.

See the "Agents & MCP" documentation. ``create_server(project_dir)`` builds a
FastMCP server (requires the ``mcp`` extra); the ``machinable mcp`` CLI launches it
over stdio.
"""

from __future__ import annotations

from machinable.mcp.server import create_server

__all__ = ["create_server"]
