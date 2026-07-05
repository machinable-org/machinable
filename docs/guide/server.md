# The API server

machinable ships an HTTP + WebSocket server that exposes a project's interfaces to
remote clients: a JSON control plane, a binary data plane, the config/identity
[index](./storage.md) with search, and the [execution](./execution.md) lifecycle. Each
interface decides what its bytes and method calls mean; the server stays use-case
agnostic. (The [MCP](/mcp/overview) is a curated, agent-facing facade over this same
surface.)

## Launching

The server is itself an interface (`machinable.server`). Launch it with the
[CLI](./cli.md):

```bash
machinable get machinable.server project="/path/to/project" --launch
```

Its `Config` controls the bind and the security surface:

| Field | Default | Purpose |
| --- | --- | --- |
| `host` / `port` | `127.0.0.1` / `8000` | bind address |
| `console` | `None` (auto) | attach the [console](#the-console) when launched from a terminal |
| `api_token` | `None` | bearer token required for requests |
| `project` | `None` | the default project a request binds to |
| `project_roots` | `None` | extra roots that may be opened per request |
| `enable_source_api` | `False` | allow writing project `.py` files (remote code execution, off by default) |
| `source_token` | `None` | token required for the source-editing API |

## Routing

A request binds to a project and a user:

- `X-Machinable-Project` (or `?project=`): the target project, restricted to the
  server's allowlist; defaults to the launch project.
- `X-Machinable-User`: attributes created interfaces (`created_by`); defaults to the OS
  user.

## What it exposes

| Family | Examples | Purpose |
| --- | --- | --- |
| Interfaces | `POST /v1/interfaces`, `/search`, `/resolve`, `/{uuid}/provenance` `/data` `/related` | create, search, dry-run, inspect |
| Executions | `POST /v1/executions`, `GET /{uuid}`, `/output` | run lifecycle + output |
| Project | `GET /v1/project[/{module}]`, `/remotes` | module discovery + schema reflection |
| Source | `GET/PUT/DELETE /v1/source/{path}` | the opt-in, token-gated source-editing API |

Config reflection is first-class: `GET /v1/project/{module}` returns the config fields
and the [version-method vocabulary](./versions.md) (signatures + docstrings), and
`POST /v1/interfaces/resolve` dry-runs a compact version to its resolved config and CLI
without materializing.

## The console

`machinable console` attaches a terminal UI to a running server, local or remote. It is
a pure API client, so everything it shows travels through the same contract as any
other client:

```bash
pip install 'machinable[console]'

machinable console                              # http://127.0.0.1:8000
machinable console http://cluster:8000 --token SECRET
```

The console browses and filters the record catalog, opens a record to inspect its
resolved config, run history, and stored files, follows a live run's output, and
cancels runs (`y` copies the record's CLI reproduction command). A server launched from
a terminal attaches the console automatically when it is installed; set `console=true`
to require it (launching fails with an install hint when it is missing) or
`console=false` for a headless server.

Beyond browsing, the console drives the full loop:

- **Launch pad** (`n`): pick a module, see its config fields and `~version`
  vocabulary, and type a version exactly like the [CLI](./cli.md)
  (`~sgd lr=0.1 nested.k=2`). The preview resolves live, so typos surface as precise
  unknown-key errors, and an identity badge shows whether this configuration is a
  `draft` (launching runs it) or already `cached` (launching opens the existing
  record) before anything executes.
- **Provenance** (record detail tab): the record's provenance graph as a navigable
  tree of derivation, runs, and manifest edges; selecting a node jumps to that
  record.
- **Call** (record detail tab): invoke a method with the shared `method(args)`
  grammar (e.g. `summary(top=3)`) and read the returned value, with the equivalent
  `machinable … --method(args)` command shown for reproduction.
- **Remotes** (`R`): the project's declared remote modules, with the
  [inspect-before-import](./storage.md#remotes-shareable-interfaces) workflow.
- `ctrl+p` opens the command palette; `?` shows the key reference.

## The full contract

The server documents itself, so there is no static copy to keep in sync:

- **REST/OpenAPI**: `GET /openapi.json` and the interactive `/docs`.
- **WebSocket protocol**: `GET /v1/protocol` returns a machine-readable description of
  the connect / call / stream / chunk-upload / event frames, which OpenAPI can't model.
- Regenerate a markdown snapshot any time with `python -m machinable.api.docs`.

For agent-facing usage, prefer the [MCP server](/mcp/overview), which wraps this API as
curated tools, resources, and prompts.
