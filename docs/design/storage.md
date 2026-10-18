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

## Home ≠ working copy

The same separation holds one level down. A record's **home** is where it durably lives, a URI its storage derives from the record's identity (`file://…`, `s3://…`); its **working copy** is the local directory a run writes in. On disk they coincide, which is why most people never meet the distinction. For a home that is not a directory, the working copy is a cache of it: dispatch writes the run-record and each status marker through to the home as they are written, pushes the run's files at the end (`finished_at` after them, then `cached`, then the release, the [claims](./format.md#claims) ordering), and pulls them back for a resume. Lose the working copy and nothing is lost. The cache runs the other way for a run another machine is running: such a run's working copy here is only what was there when it was indexed, so a status read of a run not finished here reads its markers from the home (never its artifacts), and once the home has `finished_at` re-ingests it.

This is what makes the `Storage` contract small. The index stores whatever URI a storage returns and never derives one location from another, and dispatch never assumes a home is a path, so a backend is four file methods (`list`, `read`, `write`, `remove`) and, to claim, the two conditional writes. Committing, fetching, catalog-first ingest and the claim protocol's reads are written once in core over them.

## Why not store identity in the index alone?

Putting identity only in the database would make the database load-bearing: lose it and
you lose the meaning of the directories. By writing `model.json` next to the data, the
directories remain self-describing and portable, and the index is a rebuildable
convenience. This is the same instinct as content-addressing the config: keep the
durable truth in the artifact, not in a mutable side-channel.
