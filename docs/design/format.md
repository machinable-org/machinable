# The directory format

[Storage](./storage.md) records the founding decision: directories are the source of
truth, the index is a rebuildable cache. This note records the step after that, which is
making the on-disk layout a versioned, language-portable contract ("format v1") rather
than an implementation detail of the Python code, and why each piece of the contract
looks the way it does.

## Why a contract at all

"Files are the source of truth" is only as strong as a second, independent reader. The
moment a desktop app, a Rust tracker, a sync tool, or a collaborator's script wants to
read a store without importing machinable, every implicit convention becomes a
reverse-engineering exercise that silently drifts. The format contract turns those
conventions into pinned, testable facts. A conformance corpus
(`python -m machinable.corpus`, generated into `tests/corpus/` on the first test run)
enforces it: any implementation, in any language, must reproduce the corpus's hashes
byte-for-byte and its index rows row-for-row.

A useful side effect of the contract is that the boundary between what needs Python and
what doesn't becomes explicit. Reading, tracking, and indexing a store is pure data; any
language can do it. Only writing (config resolution, config methods) is Python-semantic,
and stays so by design.

## The record directory

A record directory is self-describing:

| Entry | Role |
|---|---|
| `.machinable` | discovery sentinel (cheap to walk for) |
| `id.json` | the identity header: `format`, `uuid`, `kind`, `identity_key`, `predicate_key`, `parent` |
| `model.json` | the full record model (module, config layers, version, predicate, ...) |
| `updated_at` | per-record sync marker |
| `dispatched/started/heartbeat/finished/resumed_at` | run-status markers (executions) |
| `related/metadata.jsonl` | the edge log |
| everything else | the record's artifact namespace |

### `id.json`: identity written down, not re-derived

Before format v1, a rebuild (`reindex`) recomputed each record's identity from
`model.json`, which required re-importing the record's `Config` class to recover its
non-identifying fields, and recovered parenthood from the record's position in the
directory tree. Both are liabilities because a store rebuilt on a machine where the project
doesn't import silently changes identities (breaking dedup), a non-Python reader cannot
recompute at all, and moving a directory silently changed its parent, the exact opposite
of [location ≠ identity](./storage.md).

`id.json` persists the keys once, at materialization. Ingest becomes a pure copy (no
imports, no hashing, no nesting walk) and is therefore implementable exactly in any
language. The Python re-derivation survives only where it belongs: `verify` (detect
drift between `id.json` and `model.json`) and `repair`.

It is a separate file rather than an extension of the `.machinable` sentinel because the
`.json` extension makes the format self-evident to any tool that opens the directory,
and the sentinel stays a pure existence check.

The header is written once and is immutable. Config is immutable after materialization,
so the keys cannot legitimately change; mutable state never goes in `id.json`.

### `updated_at`: a sync signal you can rely on

The immutability boundary, stated once: identity artifacts (`id.json`, the config layers
in `model.json`) are read-only after materialization; everything else is a legitimate
post-hoc write, including labels, status markers, relation appends, and artifacts. To
make those writes observable without trusting directory mtimes (worthless across copies
and archives), every official mutating API (`save_file`, `update_status`, `relate`,
`set_label`, `to_directory`) bumps a per-record `updated_at` marker automatically; a
direct write by other means opts in via `Interface.touch()` / `machinable touch`. The
guarantee is deliberately one-sided: write through machinable APIs and `updated_at` is
reliable for synchronization; bypass them and it's your job to declare the change.
Granularity is per-record by choice. One cheap file covers cache refresh and sync
ordering; per-file delta tracking belongs to specialized tools.

### The edge log

`related/metadata.jsonl` is the one authoritative on-disk edge representation: an
append-only JSON-lines log, crash-safe and merge-friendly. Duplicate lines are legal and
readers deduplicate on `(name, uuid, related_uuid, fn)`, which makes the log a grow-only
set, so merging two copies of a record is a line union (git's `merge=union` driver is
literally correct for it). The older per-relation mirror files under `related/` are
non-normative conveniences that readers must not require.

### Status markers and the run state machine

Run status is plain-text ISO-8601 markers, written by the real dispatch code wherever
the payload runs. Four markers give a complete, server-free state machine:

| Markers present | State |
|---|---|
| `dispatched_at` only | **pending** (submitted; payload not yet running) |
| + `started_at`, fresh `heartbeat_at` | **live** |
| + `started_at`, stale heartbeat, no `finished_at` | **died mid-run** |
| `finished_at` | **terminal** (success *or* failure; the result carries which) |

`dispatched_at` exists because scheduler handoff (Slurm, queues) has a genuine
"submitted but not started" window; without it a queued job is indistinguishable from an
undispatched one. Heartbeat staleness is the single liveness oracle for inline and
scheduler-run payloads alike. The heartbeat is written by the payload itself, so no
per-scheduler reconciliation (`squeue` polling and the like) is ever needed and
monitoring stays pure filesystem. The default window is 90 s (about six missed 15 s
beats) rather than a tighter bound because heartbeats crossing a shared/NFS store lag on
metadata visibility, and a false "died" is worse than a slow one. The window is
relaxable per store.

The pending window is ambiguous by nature, since a job that dies in the queue stays "pending",
since no heartbeat ever existed to go stale. This is accepted. The scheduler eventually
starts the job or the user cancels; queue-accurate status is optional enrichment, not
required for correctness.

## Canonical JSON and the float profile

Every identity key is a sha256 over a canonical JSON serialization (sorted keys, compact
separators, `ensure_ascii` escapes). The one place implementations genuinely diverge is
floats: the contract pins the Python `repr` profile. Shortest round-trip digits,
scientific notation only outside `1e-4 ≤ |x| < 1e16`, signed two-digit exponents
(`1e+16`, `1e-05`), trailing `.0` on integral values, `-0.0` preserved. This is not the
prettiest possible profile; it is pinned because every deployed identity key was
produced by it, and pinning anything else would re-key existing catalogs. Rust's
`ryu`/serde_json defaults differ (`1e16`, `1e15`), so a conforming implementation
re-formats shortest digits under Python's rules; the corpus carries the tricky vectors
(`1e15` vs `1e16` boundaries, `-0.0`, 2^53±1, subnormals, astral-plane strings) so the
claim is tested, not hoped. `NaN`/`Infinity` are rejected at write time. All format
files are UTF-8, never the locale encoding.

## The index: a per-context cache with a small private side

Everything in [Storage](./storage.md) still holds: the index is rebuildable, never
load-bearing. The format work sharpened three points.

**Ingest is total and loud.** Re-ingesting an existing record refreshes its derived
columns and preserves its birth date from `model.json`. If an incoming record claims a
`record_id` the index already holds with different identity keys, ingest fails with a
dedicated collision error rather than silently merging two distinct records. `id.json`
is exactly what makes this check possible, and the failure mode matters because
ingesting a collaborator's store is a first-class operation. (Record ids are minted at
12 characters of base62 to keep the collision case rare in the first place.)

**The private overlay.** Not everything about a record is a fact *of* the record.
`hidden` is a per-person judgment; in a shared world, your hiding must not impose on a
collaborator. It therefore lives only in the index (never as a file in the record),
together with a free-form `private_json` object the index owner may use for personal
annotations (tool-namespaced by convention). Overlay writes never bump `updated_at` and
never travel when a record is shared; the rebuild invariant becomes "row-equivalent
modulo the overlay", the one class of state that is legitimately index-local, named and
fenced rather than left as an accident.

**Indexes never travel.** Record directories are what move between people (zip, then
ingest); index files are per-context caches and are never merged or shipped. What the
frozen schema buys is narrower: multiple tools on the same machine sharing one cache
file. That is why the connection profile is pinned (WAL, `busy_timeout`,
`synchronous=NORMAL`), so a UI, a detached run, and a server can share it without
`SQLITE_BUSY` storms. Foreign keys stay unenforced on purpose, because parent and relation rows
may forward-reference records that ingest later, which is precisely what makes reindex
order-independent.

**The Index is a contract, not a storage engine.** `Index` is itself an interface, so
alternative backends (a lab's shared Postgres catalog over a shared store) are ordinary
interface modules, conforming if they satisfy the same operation semantics and the
rebuild invariant. SQLite is the reference implementation, and where SQL semantics leak
into behavior (mixed-type ordered comparison: `NULL < numeric < text`), SQLite's
semantics are normative; the behavioral suite in the corpus enforces them. Because truth
stays in the directories, a centralized index changes availability, never authority:
losing it is a reindex, not data loss.

## Project identity: location-free, name-discriminated, deterministic root

The project root is the record every other record scopes under, and it originally
violated the format's own principle in a subtle way, in that its identity included its
`directory` config, whose default was the caller's working directory. Because canonical
identity strips values equal to their default, the path vanished from the identity only
when the process was launched from inside the project. The same project therefore had
two identities depending on where you stood when you ran it (a serverless dispatch
parent and its detached child could scatter one dispatch across two roots).

Format v1 resolves this with three coupled decisions:

- **`directory` is non-identifying.** A project's identity must not encode its
  filesystem location: the same rule as every other record ([Storage](./storage.md)),
  applied to the root itself.
- **The directory name is the discriminator**, contributed as the root's predicate.
  Something portable must distinguish two different projects sharing one index, and the
  folder name is the pragmatic choice, since two checkouts of `my-study` on different machines
  are the same project, which is exactly what makes a collaborator's ingested records
  land under the receiver's own root. The accepted edge: two unrelated projects that
  share both a name and an index will merge, so use distinct names (or distinct indexes,
  the normal case). The root's predicate deliberately does not absorb ambient scopes;
  the root materializes lazily inside whatever context first touched it, and a
  scope-polluted root would fragment per scope.
- **The root record id is deterministic**, derived from the root's identity triple
  rather than randomly minted. This is the piece that makes sharing actually work:
  `id.json` records each record's parent by uuid, so with per-index random root ids
  every shared record arrived as a parent-orphan and the cross-peer dedup triple
  `(parent, identity, predicate)` could never match. With deterministic roots, every
  index derives the same root uuid for the same project, and foreign records resolve
  under it on ingest. (Deterministic ids also mean two threads can legitimately race to
  create the same row; `materialize` treats a lost insert race as a reuse, guarded by
  the same key comparison as any collision.)

## Sharing: decentralized in people space

Research collaboration is decentralized per person. One collaborator holds the cluster
allocation; another only ever sees results on a laptop. The format is deliberately
sync-friendly under that reality, and the property falls out of the mutability
discipline rather than a sync protocol: identity artifacts are immutable, every mutable
file has exactly one writer (the machine running the payload), and edges are a
union-mergeable log. Finished records therefore cannot conflict, and generic tools (git,
syncthing, rsync, a zip in an email) are the sync layer. The remaining rules are small:

- Same uuid on both sides: merge per-file (immutables identical, markers single-writer,
  edge log unions, `label` last-writer-wins by `updated_at`).
- Same path, different uuids: two peers independently materialized the same config
  (content-addressed paths collide by construction). Both records are valid; relocate
  one. This is allowed precisely because identity lives in files, never paths.
- What travels: the record, including `label` (curation by the person who did the work
  is signal) and `created_by`. What doesn't: the private overlay.
- Sharing can be metadata-first: send the kilobytes (`id.json`, `model.json`, markers,
  edge log), ingest at `bytes_missing`, stream artifacts on demand through a storage
  provider. Serverless dispatch over SSH is the degenerate case of this flow; the
  dispatching machine ingests the record it caused to exist on the target.

## Conformance classes

The contract is layered so implementations can claim exactly what they need:

| Class | Can do | Needs |
|---|---|---|
| **Reader** | browse records, config, edges, artifacts | directory parsing only |
| **Tracker** | the run state machine | status markers only |
| **Indexer** | build/refresh/query an index | + ingest & the find algebra |
| **Verifier** | recompute keys, detect drift | + canonical JSON & hashing |
| **Writer** | materialize new records | config resolution (**Python only**) |

The Writer row is the honest boundary: config resolution (omegaconf semantics, config
methods) is Python, and non-Python applications write by driving
[`machinable dispatch`](/guide/cli) rather than by reimplementing resolution. One
implementation of identity, many of reading.

## Migration

There is no compatibility mode. `machinable migrate` upgrades a store in place: it
harvests the exact keys from the pre-v1 index database before the schema bump discards
it (recomputing in Python only for directories the old index didn't know), writes
`id.json` and `updated_at`, folds legacy `hidden` marker files into the overlay, and
reindexes. A tool, not a mode: after migration every reader sees exactly one format.
