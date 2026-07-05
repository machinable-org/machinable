"""Terminal console for machinable: a Textual client of the HTTP API.

The console attaches to any running machinable API server (local or remote)
over HTTP/WebSocket; it never touches the index or storage directly, so it
exercises exactly the contract other clients (agents, web UIs) use.
"""

from machinable.console.app import run_console

__all__ = ["run_console"]
