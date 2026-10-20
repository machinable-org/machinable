# Setup

## Install

The MCP server lives behind the `mcp` extra:

```bash
pip install machinable[mcp]
```

This adds `fastmcp` (the server), `scipy` (the reference inferences' statistics), and
`pandas`.

## Launch

Run the server over stdio, bound to a project:

```bash
machinable mcp --project /path/to/project
```

Flags:

| Flag | Purpose |
| --- | --- |
| `--project DIR` | the project the session binds to (defaults to the cwd) |
| `--token T` | shared secret for remote transports |
| `--read-only` | disable the write tools (untrusted sessions) |
| `--http` / `--host` / `--port` | serve over Streamable HTTP instead of stdio |

A session binds to one project (its modules, config, storage) and a user (for creator
attribution). Read-only mode disables `write_source`/`move_source`/`delete_source` so
an untrusted agent can explore and analyze but not edit code.

## Connect a client

**Claude Desktop / an IDE**: add an MCP entry pointing at the command (stdio) or a
remote URL + token. Tools, resources, and prompts then appear, and the client owns the
loop and the per-action approvals.

```json
{
  "mcpServers": {
    "machinable": {
      "command": "machinable",
      "args": ["mcp", "--project", "/path/to/project"]
    }
  }
}
```

**Programmatically** (tests, or building your own agent): the server is a
`fastmcp.FastMCP` instance you can drive in-process:

```python
from fastmcp import Client
from machinable.mcp.server import create_server

server = create_server("/path/to/project")
async with Client(server) as client:
    tools = await client.list_tools()
    result = await client.call_tool("get_module", {"module": "train"})
```

**Without an MCP client**: the tools, resources and prompts are plain functions by
name, bound to a context, so a caller that is not an MCP server invokes them directly:

```python
from machinable.mcp import prompts, resources, tools
from machinable.mcp.context import MCPContext

ctx = MCPContext(project_dir="/path/to/project", read_only=True)
tools.functions(ctx)["quantity"](operand="train", name="loss", version=["~~seeds"])
resources.read(ctx, "examples://axis")
prompts.functions(ctx)["investigate"]("sgd beats adam")
```

The [API server](/guide/server#the-mcp-over-rest) serves the same over REST
(`GET /v1/mcp`, `GET /v1/mcp/resources?uri=`, `POST /v1/mcp/tools/{name}`,
`POST /v1/mcp/prompts/{name}`), bound to the request's project, so a remote caller
needs no machinable of its own to read the guide or run a tool where the project is.

**Several machines on one home**: the tools read within
[`adopting()`](/guide/storage#reads-that-see-the-shared-home), so `quantity`, the
inferences and `run_status` on one machine see the runs another machine made in a
storage they share, and a verdict reached on one is read, not computed again, on
another. An axis or an aggregate dispatched through the API server
(`POST /v1/executions`) runs as `launch` runs it here, each run seeing its scope.

## Safety

- **Named, bounded, approvable tools.** Each call is rendered by the client for
  approval; this is not a generic `exec` or `http` tool.
- **Token-gated writes.** Source edits require the token; `--read-only` removes them.
- **The server never drives hardware.** It reads and writes source and calls interface
  methods. `call`/`launch` run *your* interface code server-side, so side effects are
  the interface author's responsibility.

Next: [the research workflow](./workflow.md).
