# Reference

Generated reference documentation, regenerated from the source on every docs build
(`npm run gen`).

## Python API

The public surface of the `machinable` package. Each page documents one class with a
per-method anchor you can link to.

- [Interface](/reference/python/interface) — the unit of machinable
- [Execution](/reference/python/execution) — the mechanism that runs interfaces
- [Inference](/reference/python/inference) — scientific questions as interfaces
- [Widget](/reference/python/widget) — results a human can look at
- [Project](/reference/python/project) — the directory a session binds to
- [Storage](/reference/python/storage) — durable homes for run directories
- [Index](/reference/python/catalog) — the SQLite catalog behind lookup and search
- [Scope](/reference/python/scope) — predicate tagging for grouped runs
- [Query](/reference/python/query) — the `machinable.get` entry point
- [Collections](/reference/python/collections) — result collections
- [Helpers](/reference/python/helpers) — `Field`, references, `from_cli`

## HTTP API

The server's contract, rendered from the live application:

- [HTTP endpoints](/reference/api/endpoints) — the REST surface, by route family
- [WebSocket protocol](/reference/api/ws-protocol) — frames, binary flows, hooks
- [Schemas](/reference/api/schemas) — every request/response model

The running server also documents itself: `GET /openapi.json`, the interactive
`/docs`, and `GET /v1/protocol`.
