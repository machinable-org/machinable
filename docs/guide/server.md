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
| `enable_source_api` | `False` | allow writing project `.py` files (remote code execution, off by default) |
| `source_token` | `None` | token required for the source-editing API, sent as `X-Machinable-Source-Token` |

Clients authenticate with a bearer header instead of cookies, so the API's CORS policy allows any origin by default and grants credentialed requests (cookies, HTTP auth) only to explicitly listed origins (`create_app(allow_origins=[...])`).

Source writes need the `source_token` in `X-Machinable-Source-Token`, beside the server's own auth in `Authorization`, so a `source_token` different from `api_token` (or an OIDC token) works. `Authorization: Bearer <source_token>` is still accepted when the server has no other auth, or when `source_token` is unset and falls back to `api_token`.

### Process-isolated workers

A request for another interpreter (`?python=`) is proxied to a worker process on loopback. The gateway gives each worker a random secret at spawn (in its environment) and the worker refuses every request without it, so other local users cannot call a worker directly or claim an `X-Machinable-User`. The client's `Authorization` is not forwarded to the worker, and a request the gateway admitted by OIDC reaches the worker with the verified identity as its `X-Machinable-User`.

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
