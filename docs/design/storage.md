# Storage

The mechanics of [storage and the index](/guide/storage) are in the guide. The design
choice worth recording is the strict separation of location from identity.

## Location ≠ identity

A run's directory is a location. Its identity is content-addressed
([canonical config](./identity.md) + predicate) and entirely independent of where the
directory sits. This is deliberate, and it enables several things:

- **The index is a cache, not the source of truth.** Each run directory carries its own
  `model.json` (module, config, version, predicate, inherits, context) and, since
  [format v1](./format.md), an `id.json` identity header. The SQLite index maps
  identities to locations for fast lookup and search, but it can always be rebuilt from
  the directories. Move a results folder, copy it to a cluster, hand it to a
  collaborator, check it out fresh: `reindex()` restores every identity and the catalog
  is whole again.
- **Reindex copies; verify re-derives.** Identity keys are persisted in `id.json` at
  materialization, so a rebuild is a pure copy with no `Config` import, implementable in
  any language ([the directory format](./format.md)). The schema-consulting
  re-derivation (which fields are non-identifying, what the defaults are) lives in
  `verify`/`repair`, where consulting the current code as the source of identity
  semantics is the point: detecting drift, rather than silently re-keying a catalog on a
  machine where the project happens not to import.
- **Data can be elsewhere.** A run can be local, in a remote store, or
  indexed-but-evicted. Separating identity from location lets machinable track
  availability and fetch on demand, and lets storage backends (mirrors like
  Globus/Aimstack) be ordinary interfaces you connect as a context.

## Why not store identity in the index alone?

Putting identity only in the database would make the database load-bearing: lose it and
you lose the meaning of the directories. By writing `model.json` next to the data, the
directories remain self-describing and portable, and the index is a rebuildable
convenience. This is the same instinct as content-addressing the config: keep the
durable truth in the artifact, not in a mutable side-channel.
