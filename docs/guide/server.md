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
| `api_token` | `None` | bearer token required for requests and WebSocket upgrades |
| `oidc_issuer` | `None` | accept access tokens from this OpenID Connect provider (see [below](#signing-requests-with-an-identity-provider)) |
| `project` | `None` | the default project a request binds to |
| `project_roots` | `None` | extra roots that may be opened per request |
| `python_allowlist` | `None` | interpreters a request may use besides a project's own `.venv` (see [workers](#process-isolated-workers)) |
| `project_default_python` | `False` | serve a request that names a project under `project_roots`, and no interpreter, by that project's own `.venv` |
| `worker_start_seconds` | `30` | how long a worker may take to start |
| `worker_idle_seconds` | `None` | end a worker idle this long (started again on its next request) |
| `enable_source_api` | `False` | allow writing project `.py` files (remote code execution, off by default) |
| `source_token` | `None` | token required for the source-editing API, sent as `X-Machinable-Source-Token` |

Clients authenticate with a bearer header instead of cookies, so the API's CORS policy allows any origin by default and grants credentialed requests (cookies, HTTP auth) only to explicitly listed origins (`create_app(allow_origins=[...])`).

Source writes need the `source_token` in `X-Machinable-Source-Token`, beside the server's own auth in `Authorization`, so a `source_token` different from `api_token` (or an OIDC token) works. `Authorization: Bearer <source_token>` is still accepted when the server has no other auth, or when `source_token` is unset and falls back to `api_token`.

### With a storage

Put a [storage](./storage.md) (or an index) before the server in the element chain and the server keeps its records there:

```bash
machinable get interface.remotes.s3 url=s3://my-bucket/lab/machinable region=us-east-1 \
  machinable.server project="/path/to/project" --launch
```

Here the [s3 integration](/integrations/s3), pulled into the project through `on_resolve_remotes`, makes the bucket the home of every record the server creates. The connections around the launch are re-entered, in order, wherever the server works: each request, the thread that runs a dispatched execution, the cached or running-elsewhere answer to `POST /v1/executions` (so servers on several machines over one bucket run a request once), each WebSocket connection, and the [workers](#process-isolated-workers). The server itself is only launched in them, not dispatched, so it is no run in the storage. A server started in-process (`Server.start()`, as a notebook does) takes the storage and index connected around it the same way.

### Process-isolated workers

A request or WebSocket for another interpreter (`X-Machinable-Python` or `?python=`) is proxied to a worker process on loopback, one per project and interpreter. The interpreter must be the gateway's own, the project's own `.venv`, or listed in `python_allowlist`. A worker starts in its project's folder, so the project's modules import their siblings by name and nothing in the gateway's folder shadows them.

The gateway gives each worker a random secret at spawn (in its environment) and the worker refuses every request without it, so other local users cannot call a worker directly or claim an `X-Machinable-User`. The client's `Authorization` is not forwarded to the worker. A request the gateway admitted by OIDC reaches the worker with the verified identity as its `X-Machinable-User` and the token's verified claims as `X-Machinable-Claims`, which the worker trusts only with its secret, so `Project.get().claims` reads the same in a worker as in-process. A socket is relayed frame by frame (text and binary), the worker's close code reaches the client, and an OIDC-admitted socket still closes with `4401` when its token expires.

### Several projects in their own environments

One server (one port, one identity provider, one [storage](#with-a-storage)) can serve many projects side by side, each with its own dependencies, for example two versions of one package checked out next to each other:

```bash
machinable get machinable.server project_roots='["/srv/projects"]' \
  project_default_python=true worker_idle_seconds=600 --launch
```

```
/srv/projects/
  analyses@769e03a5/   .venv/ ...
  analyses@1a2b3c4d/   .venv/ ...
```

With `project_default_python`, a client names only the project (`X-Machinable-Project: /srv/projects/analyses@769e03a5`, or `?project=`) and the server runs it in that project's own `.venv`; a project without one is served in-process. A request that names an interpreter keeps it.

`GET /v1/health` on the gateway asks each live worker for its own health (briefly; one that does not answer counts 0): `executions_active` counts the runs in the gateway and in its workers once each (`active_executions` lists them), and `workers` names each worker with what runs in it, so an idle check of the gateway alone sees a run in any worker.

A first start in a new environment can be slow (Python compiles the environment's modules on first import); `worker_start_seconds` gives it longer. With `worker_idle_seconds`, a worker with no request or socket in flight and no execution running in its process for that long is ended, and started again by the next request for it; a worker running an execution is never ended.

## Routing

A request binds to a project and a user:

- `X-Machinable-Project` (or `?project=`): the target project, restricted to the server's allowlist; defaults to the launch project.
- `X-Machinable-User`: attributes created interfaces (`created_by`); defaults to the OS user. A request signed by an [identity provider](#signing-requests-with-an-identity-provider) is attributed to its verified identity instead.

## Signing requests with an identity provider

A shared `api_token` says nothing about who sent a request and never expires. Alternatively, a server can instead trust the access tokens from an OpenID Connect provider. In this case, the bearer token is a JWT signed by the issuer. To use this, install the extra and set the issuer:

```bash
pip install 'machinable[oidc]'

machinable get machinable.server oidc_issuer=https://id.example.org/realms/lab \
  oidc_audience=machinable oidc_rules_file=/etc/machinable/rules.json --launch
```

| Field | Default | Purpose |
| --- | --- | --- |
| `oidc_issuer` | `None` | issuer URL; its `/.well-known/openid-configuration` names the signing keys |
| `oidc_audience` | `None` | one or more accepted audiences (required): the token's `aud` must contain one; with several `aud` values, an `azp` present must be one of them, and `azp` alone never admits a token |
| `oidc_rules` | `None` | claim rules every token must pass (inline) |
| `oidc_rules_file` | `None` | a JSON file of rules, re-read when it changes |
| `oidc_identity_claim` | `sub` | the claim that names the caller |
| `oidc_algorithms` | `RS256`, `ES256`, `EdDSA` | accepted signature algorithms; `none` and HMAC are never accepted |
| `oidc_leeway` | `60` | clock skew in seconds allowed on `exp`, `nbf` and `iat` |

The provider's keys are fetched at start and cached so a token naming an unknown key fetches them again, and a failed fetch keeps the last good keys. Only JWT access tokens are verified, and token issuance at sign in is left to the provider.

`api_token` keeps working beside OIDC, so an operator's scripts and the [console](#the-console) keep their token while people sign in. Source writes still need `source_token` (or `api_token`) in `X-Machinable-Source-Token`.

### Rules

A rule set is a list of rules that must all pass or may instead be `any_of` a list of rule sets, one of which must pass. A rule names a claim by its exact top-level name and one test (names may contain `/`, `:` and `.`, so there is no path syntax):

| Test | Passes when |
| --- | --- |
| `equals: v` | the claim equals `v` (no type coercion: `"311"` is not `311`) |
| `in: [v, …]` | the claim equals one of them |
| `contains: v` | the claim is a list containing `v`, or an object with the key `v` |
| `present: true` | the claim exists (`false`: it does not) |

A server for one lab, open to its admins and to one member:

```json
{ "rules": [
    { "claim": "https://aws.amazon.com/tags/principal_tags/team", "equals": "311" },
    { "any_of": [
        [ { "claim": "sub", "equals": "3950…196" } ],
        [ { "claim": "urn:zitadel:iam:org:project:roles", "contains": "admin" } ]
    ] }
] }
```

A rules file is re-read when it changes, so access changes without a restart. A rules file that is missing or does not parse refuses every OIDC request, with the reason in the server's log.

### Clients and WebSockets

Clients send the token on every request as `Authorization: Bearer <token>`. A refused request is answered with 401 and `WWW-Authenticate: Bearer error="invalid_token"`, with a short reason (`expired`, `wrong audience`, `rules`, …).

WebSocket upgrades need the token too (native clients set the `Authorization` header, browsers offer it as subprotocols `Sec-WebSocket-Protocol: bearer, <token>`). An upgrade without a valid token is refused before the socket opens (HTTP 403). A socket outlives its request, so the server closes a socket admitted by an OIDC token when the token's `exp` passes, with close code `4401`. In this case, the client refreshes its token and dials again. A socket admitted with the shared `api_token` is not closed.

Everything a signed request creates is attributed (`created_by`) to its verified identity claim, and `X-Machinable-User` is ignored. Interfaces can read the token's verified claims during the request as the read-only `Project.get().claims`.

## What it exposes

| Family | Examples | Purpose |
| --- | --- | --- |
| Interfaces | `POST /v1/interfaces`, `/search`, `/resolve`, `/{uuid}/provenance` `/data` `/related` | create, search, dry-run, inspect |
| Executions | `POST /v1/executions`, `GET /{uuid}`, `/output`, `/results` | run lifecycle, output, declared results |
| Project | `GET /v1/project[/{module}]`, `/remotes` | module discovery + schema reflection |
| Source | `GET/PUT/DELETE /v1/source/{path}` | the opt-in, token-gated source-editing API |
| MCP | `GET /v1/mcp`, `/resources?uri=`, `POST /prompts/{name}`, `/tools/{name}` | the [MCP](/mcp/overview)'s tools, resources and prompts, [over REST](#the-mcp-over-rest) |

`POST /v1/executions` runs only the interfaces that are not yet cached. When every
requested interface is already cached it returns at once without dispatching: the
answer is the existing run-record of the first interface with `cached: true`, and
`cached_uuids` lists the existing run-records of all requested interfaces.

The server looks before dispatching (see [concurrent dispatch](./advanced-execution.md#concurrent-dispatch)), so several servers (or a server and scripts) over one storage folder run a request once. An interface another dispatcher holds is never waited on: when nothing was dispatched because some requested interfaces are running elsewhere (and the rest are cached), the
answer is at once the run-record of the first interface, the one running elsewhere or the cached one, with `running_elsewhere: true`; `running_elsewhere_uuids` lists the runs held elsewhere and `cached_uuids` the cached ones. Follow the run with `GET /v1/executions/{uuid}` (or the executions WebSocket) as usual. The answer has indexed the run, so this server finds it, and while it is not finished here its status is read from its home: when the home is not the server's working copy (a bucket), each status read brings the home's status markers (small files, at most once a second per run) into the working copy, so the run reads live while the other machine beats, finished once it is (its catalog, output log and small results then come into the working copy, and its interface reads cached), and died when the other machine stops beating without finishing. A run whose home is a shared folder needs none of this, the folder being every server's working copy. A run finished elsewhere counts as cached.

A run's [declared results](./results.md#declared-results) are served from its files, never by importing its interface, so a server without the interface's code or Python environment serves them: `GET /v1/executions/{uuid}/results` is the manifest (`uuid` a run-record or its interface), `GET /v1/executions/{uuid}/results/{name}` one result as JSON (a json result's `value`; a table's columns as `data`, rows `?start=&stop=`; an array's or a ragged result's `?item=12` or `?start=&stop=`, reading only the chunks those need; NaN as null), and the WebSocket `/v1/executions/{uuid}/results/ws` sends a `results` frame with the manifest at once and whenever it changes. A record whose home is a bucket is refreshed from it on each request (one small read), so a live run's results are current.

An interface can have several runs (dispatched again after `cached(False)`, say), so every API response returns the newest by creation: `POST /v1/interfaces/lifecycle` reports the newest run's status and its `execution_uuid`, an interface's `latest_execution_uuid` is the newest run, and `GET /v1/executions` and `GET /v1/interfaces/{uuid}/executions` list runs newest first (so `?limit=1` is the newest).

Config reflection is first-class: `GET /v1/project/{module}` returns the config fields
and the [version-method vocabulary](./versions.md) (signatures + docstrings), and
`POST /v1/interfaces/resolve` dry-runs a compact version to its resolved config and CLI
without materializing.

## The MCP over REST

The [MCP](/mcp/overview)'s functions answer over the API too, bound to the request's project (and run in its [worker](#process-isolated-workers)), for a caller that is not an MCP client or has no machinable of its own. It forms a gateway that serves the MCP for many machines and runs each tool where the project is, or a client without Python reading the guide of the machinable a server runs.

| Route | Answers |
| --- | --- |
| `GET /v1/mcp` | the MCP's instructions, and each tool, resource and prompt with its doc |
| `GET /v1/mcp/resources?uri=guide://authoring` | a resource (`examples://axis`, `inferences://catalog`, `widget-sdk://docs`, `module://train`): `{"uri", "mime_type", "content"}` |
| `POST /v1/mcp/prompts/{name}` | a prompt's text, for `{"arguments": {...}}` |
| `POST /v1/mcp/tools/{name}` | a tool's answer, `{"result": ...}`, for `{"arguments": {...}}` |

The tools are read-only here (the source tools answer 403; sources are edited through the [source API](#what-it-exposes)), and a run is better dispatched with `POST /v1/executions`, which answers at once. In Python, `machinable.mcp.tools.functions(ctx)` (and `resources.functions`, `prompts.functions`) are the same functions by name, `resources.read(ctx, uri)` answers a URI.

The MCP's reads see the runs other servers made in a [shared home](./storage.md#reads-that-see-the-shared-home) without a sync: `quantity`, the inferences and `run_status` on one server answer for runs another server made, and a verdict another server reached is read, not computed again.

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
