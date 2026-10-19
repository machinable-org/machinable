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
(`python -m machinable.corpus`, generated into `tests/corpus/` on the first test run;
the run state machine, claim states and the claim protocol as vectors among the rest)
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
| `abandoned_at` | the run's claim was taken over (executions; see [Claims](#claims)) |
| `related/metadata.jsonl` | the edge log |
| `results.json`, `results/` | the record's declared results (see [Results](#results)) |
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
literally correct for it).

Earlier versions also wrote per-relation mirror files (`related/<fn>`, one related uuid
per line) and, in some versions, `related/<id>/link` pointers (a symlink or, where
symlinks are unavailable, a text file holding the path to the related record). These
duplicated the log and could drift from it (links also did not survive copies and
archives), so they are no longer written. Stores created by earlier versions may still
carry them; they are never deleted and never read, so a store reads identically with or
without them. `related/metadata.jsonl` is the only edge representation.

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
relaxable per store (in Python, `MACHINABLE_HEARTBEAT_WINDOW`); a store whose markers
reach the reader on a delay, such as a node-local scratch rsynced to shared storage on
an interval, needs a window wider than that delay or every live run reads as died.

Staleness is the total elapsed time between the heartbeat and the reader's clock, not
the seconds component of a calendar difference. The two agree for the first day and then
diverge sharply, so a run that died yesterday must not read as live. Since the payload
and the reader are frequently different machines, their clocks disagree; a heartbeat
dated in the reader's future is treated as fresh, in keeping with preferring a false
"live" over a false "died".

The pending window is ambiguous by nature, since a job that dies in the queue stays "pending",
since no heartbeat ever existed to go stale. This is accepted. The scheduler eventually
starts the job or the user cancels; queue-accurate status is optional enrichment, not
required for correctness.

A fifth marker, `abandoned_at`, is written by *another* dispatcher: the one that took over
the run's [claim](#claims) after its heartbeat went stale. An abandoned run reads as
died whatever its other markers say (a fresh heartbeat or a pending `dispatched_at`
included), and it is never resumed. The one exception is `finished_at`: a finish that
raced the takeover wins, and the run reads as terminal.

## Claims

Content-addressed paths mean every dispatcher of one interface computes the same
directory, so anything that sees the same record directories (threads, processes, two
indexes over one folder, machines on a shared filesystem) could run the same interface at
once. A claim makes it run once. It is a small file of the format, readable without
machinable: whether an interface is claimed, by which run and whether that claim is live
is decided from files alone, by the rules below, in every implementation.

### The claim file

`<identity dir>/.claims/<predicate_key>`, beside the interface directories of that
identity: one claim per identity and predicate, so a run of any Execution fills the same
cache entry. Canonical JSON (the profile below):

```json
{"claimed_at":"2026-01-01T12:00:00+00:00","generation":3,"host":"node-7","pid":123,"record_id":"<run-record uuid>","state":"held"}
```

- `record_id`: the run-record that holds the claim. The run is minted with this id, so
  one folder holds one id for it, whichever index made it.
- `state`: `held` or `released`.
- `generation`: incremented on every write, so a replace names the version it read. A
  store with versions of its own (an object store's ETag) compares those and still writes
  the generation, for readers without them.
- `host`, `pid`, `claimed_at` (ISO-8601): who claimed, and when.

The claim is not an identity artifact. It lives outside every record directory, is never
indexed and is ignored by reindex. It is safe to delete when nothing runs, together with
its generation files (`<predicate_key>.<n>`, the disk storage's history of the claim); a
missing claim reads as unclaimed.

### Claim states, from files alone

| Claim file | The claimed run's markers | State |
|---|---|---|
| absent, or `released` | — | **unclaimed** |
| `held` | `finished_at` | **unclaimed** (finished; a release was lost) |
| `held` | fresh `heartbeat_at` (and no `abandoned_at`) | **held** |
| `held` | `claimed_at` within the claim timeout | **held** (starting) |
| `held` | otherwise: stale heartbeat or none, claimed past the timeout | **stale** |

The claim timeout defaults to the heartbeat window, freshness is measured as for runs
(total elapsed time; a timestamp in the reader's future is fresh), and a fresh `claimed_at`
counts whatever the heartbeat says, so a claimant resuming a died run in place is held
from the moment it claims, before its first beat. The claimant writes `heartbeat_at` as
soon as its run-record exists, before the payload starts (an environment to sync, a model
to load), so the timeout only covers a claimant dying between claiming and that first
beat. A Tracker answers "is this running somewhere?" with these rules.

### The two atomic operations

A store that supports claims offers two operations beside its ordinary reads:

- **create-if-absent**(path, bytes): writes only if nothing is there; reports which happened.
- **replace-if-unchanged**(path, bytes, version): writes only if the file is still the
  version read; reports which happened.

On a POSIX filesystem, create-if-absent writes a temporary file and `link()`s it to the
claim's name, which fails if the name exists (exclusive create, like `O_CREAT|O_EXCL`, in
the form NFS honours). Replace-if-unchanged writes the next generation `n + 1` to a
temporary file, `link()`s it to `<claim>.<n + 1>` (no-clobber, so of all writers replacing
generation `n` exactly one wins) and renames it over the claim (atomic, so a reader sees
the old claim or the new one, never half a file). A `link` reported as failing over NFS
(a retransmission finding the name it created) is told apart by the temporary file's link
count. A writer that dies between its link and
its rename would leave generation `n` unreplaceable; a generation file older than 30 s
while the claim still reads `n` is installed on its behalf. Object stores use conditional
writes (`If-None-Match: *`, `If-Match`). A store without either operation supports no
exclusive claim: dispatch still looks there (and adopts what finished), but runs without
exclusivity.

### The protocol

For one interface, a dispatcher:

1. **Looks.** Reads the claim, keeping its version, *then* lists the interface's
   run-records, then reads the interface's `cached` marker. The order matters: a run writes
   `finished_at`, then its `cached` marker, then releases, so a claim read as released means
   the listing includes its finished run and the marker is there.
   - `cached`: done.
   - a finished run: **adopt** it (index it where the dispatcher's index does not know it)
     and end cached. Finished runs the dispatcher's index already knew at its *first* look
     while no held claim named them are dismissed: the interface was un-cached, and
     un-caching reruns.
   - claim held: wait on it (look again, until the dispatch's timeout) or report it running
     elsewhere;
   - otherwise go on.
2. **Claims.** create-if-absent when the look saw no claim; replace-if-unchanged against the
   version the look saw when it saw a released or stale one, so a dispatcher never replaces
   a claim it has not seen. Losing either means another dispatcher acted in between: look
   again.
3. **Takes over.** When the replaced claim was held and stale, writes `abandoned_at` into
   the dead run-record, which is never resumed. If the dead run turns out finished after
   all, the dispatcher releases its claim and adopts that run instead.
4. **Runs**, with the run-record minted under the claimed record id.
5. **Releases** after `finished_at` is written: replace-if-unchanged to `released`, against
   the claim as it reads now, and only if it still names this run. Losing means a waiter
   took over a claim it judged stale; the release is dropped and the run's result stands
   (finished wins over the takeover's run, which finds it finished at its next look). A
   run that fails writes no `finished_at` and releases all the same, so the next
   dispatcher runs it again, as a dispatch after a failure always has.

Decisions are a pure function of what a look observed and what an operation reported; the
corpus pins them as sequences.

### Why a file, not a lock service or a database

A lock service (etcd, ZooKeeper, a Redis lock) or a shared database row would give
stronger primitives (leases, fencing tokens, notifications) and none of the properties the
format exists for. Each is a process somebody has to run and reach from every node,
laptop and CI job, which is exactly the server-free operation the run state machine was
built to keep. The truth of whether something runs would also move out of the
directories: a store copied, archived or handed to a collaborator would no longer say what
held it, and a Tracker reading files could not answer "is this running?". The index cannot
serve either, since indexes are per-context caches that never travel and two of them over
one folder know nothing of each other.

A file next to the records needs only what every store already offers or can: exclusive
create and a conditional replace, the operations an object store exposes as conditional
writes. It is coordinated by the same liveness oracle as runs (the heartbeat), so there is
no second clock, lease or timeout to reason about. The price is the heartbeat's: a claimant
that stalls past the window can be taken over while still alive, and both runs then
finish. The protocol orders writes so that this is the only way to run twice, and the
format prefers it to its opposite: a false "died" costs a duplicate run, a lock that never
expires would cost the interface.

### Interface ids shared by every dispatcher

The claim and the run-record's `parent` must agree across indexes, so an interface's record
id is derived, not minted, when it is first written: if the interface's directory already
holds an `id.json` with the same keys, its uuid is taken (and the run-records inside are
indexed with it); otherwise the id is a deterministic function of the parent id, identity
key and predicate key, 12 base62 characters of
`sha256(parent_id + "\0" + identity_key + "\0" + predicate_key)` (the project root's id was
already derived; this extends the rule one level down). An index that holds an interface
already keeps its id, so existing random ids stay. The sharing rule "same path, different
uuids" below stays for records made without claims.

## Results

A run's results are files in its record, declared in a manifest, so any implementation can read them without Python. The interface writes them as it runs via `save_result`.

### The manifest

`results.json` in the record directory, canonical JSON:

```json
{"complete":true,"results":{
  "summary":{"file":"results/summary.Xk2f9aQe.json","kind":"json"},
  "units":{"columns":[{"dtype":"int64","name":"unit_id"},{"dtype":"float64","name":"snr"},{"dtype":"string","name":"label"}],
           "file":"results/units.q8ZtP0aa.zarr","kind":"table","rows":105},
  "templates":{"chunks":[1,82,60],"dims":["unit","sample","channel"],"dtype":"float32",
               "file":"results/templates.Lm3nB7cd.zarr","kind":"array","shape":[105,82,60],"units":"uV"},
  "spike_trains":{"dtype":"int64","file":"results/spike_trains.R4tYu8ef.zarr","index":"unit",
                  "items":105,"kind":"ragged","length":512340}},
 "run":"<run-record uuid>","version":1}
```

- `version`: 1. A reader refuses a later version.
- `complete`: false while a run is still writing its results; true once it ended (a
  reader shows a result as it is either way).
- `run`: the run-record that wrote them, when a run did. A run's first save starts the
  manifest afresh (its results replace the last run's, as its files do) and marks it
  incomplete; the run's end marks it complete.
- `results`: each result by name (`[A-Za-z0-9_][A-Za-z0-9_.-]*`, up to 128 characters;
  the interface's own names), with its `kind`, its `file` (relative to the record,
  `/`-separated) and optionally `description` and `units` (the values' physical unit).
  Unknown fields are ignored, and a result of a kind a reader does not know is listed,
  not read.

| Kind | `file` | Fields | Item `i` |
|---|---|---|---|
| `json` | a JSON file (UTF-8) | | |
| `table` | a zarr v3 group, one 1-D array per column at `<file>/<column>` | `rows`; `columns`, in order: `name`, `dtype`, optional `units`, `description` | row `i` |
| `array` | a zarr v3 array, at least 1-D | `dtype`, `shape`, `chunks`, optional `dims` | `array[i]`, along the first axis |
| `ragged` | a zarr v3 group of `values` (1-D, `dtype`) and `offsets` (1-D `int64`, `items + 1` long, starting at 0) | `dtype`, `items`, `length` (of `values`), optional `index` (names the items) | `values[offsets[i]:offsets[i+1]]` |

Items are positions. Results describing the same things list them in one order, and a table column carries their labels (`unit_id`); a query that is not an item stays a result method.

### Encodings

json results are a JSON value, written as canonical JSON with NaN and infinities rejected. Tables, arrays and ragged results are zarr v3, in the subset a Reader implements:

- **Metadata**: `zarr.json` with `node_type` `array` (or `group` for a table or a
  ragged result), a `regular` chunk grid, the `default` chunk key encoding (separator
  `/`: chunk `(2, 0, 0)` is `c/2/0/0`; `.` is read too).
- **Data types**: `bool`, `int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`,
  `uint32`, `uint64`, `float32`, `float64`; and `string` for table columns.
- **Codecs**: `bytes` (`endian` `little` or `big`, absent for one-byte types) or, for
  `string`, `vlen-utf8`, optionally followed by `gzip`. A chunk holds the full chunk
  shape in C order, edge chunks padded with the `fill_value`. `vlen-utf8` is a `u32`
  little-endian count, then per element a `u32` little-endian byte length and the UTF-8
  bytes.
- **A chunk file that is not there** reads as the `fill_value` (zarr's rule).

These are plain zarr v3 arrays: zarr-python, zarrs (Rust) and zarrita (JS) read them as they are, and the subset is a few dozen lines without a zarr library. machinable's writer needs only numpy. It writes columns and ragged values 65536 rows to a chunk, and an array's chunks as whole items of about 64 KiB unless `chunks` says otherwise.

### Reading

A Reader reads `results.json`, then each result from its files:

1. **No further than the manifest.** A table reads `rows` rows, an array `shape[0]` items, a ragged result `items` items and `length` values, whatever the arrays' `zarr.json` says: while a run appends, the data and `zarr.json` run ahead of the manifest.
2. **By item, by chunk.** Item `i` of an array is the chunks with first index `i // chunks[0]` (all of them along the other axes); of a ragged result, `offsets[i]` and `offsets[i+1]` (the one or two `offsets` chunks holding them), then the `values` chunks covering that range. A table's rows `[a, b)` are the chunks covering them in each column.
3. **As JSON** (the server, the corpus): a json result is its value; a table an object of column name to list; an array nested lists; a ragged result a list of lists. NaN and infinities are `null`, and a `float32` is the `float64` of the same value (`0.1f` is `0.10000000149011612`).

The corpus (`results_store/`, `results_vectors.json`) has a record with every kind, data type, codec and a missing chunk, and a live record whose arrays hold an append the manifest does not declare yet. Its vectors give each result's value, single items and slices as JSON, with the record files reading each needs.

### Writing

Only the run's payload writes its record's results (the single-writer rule), in this order: the chunks, each array's `zarr.json`, a group's `zarr.json`, then `results.json`, then `updated_at`. A reader that sees a name in the manifest sees all of its files.

- **Replacing** a result writes it under a new `file` (a fresh name per write) and removes the old files after the manifest. A reader holding a manifest older than the replace can find them gone: it reads the manifest again.
- **Appending** (rows to a table, items to an array or a ragged result) keeps the `file`: chunks wholly within the earlier length never change, and the partial last chunk is rewritten whole (atomically, so a reader sees the old chunk or the new one, both right up to the length it read).

A remote home receives each save as it is made, in the same order, during the run too, and the store's catalog log names the record again, so a machine that follows the home sees results grow.

### The catalog and caching readers

`results.json` always comes with a record's catalog, and json results do up to `catalog_max_bytes`. Tables, arrays and ragged results never do: their files are fetched by name when a read needs them, chunk by chunk. A reader that keeps fetched files across updates of the manifest drops, when a newer manifest arrives:

- the files of a result whose `file` is no longer in the manifest (replaced or gone);
- of a result appended to, each array's `zarr.json` and the chunks whose first index `j` reaches past the length the reader had read, `(j + 1) * chunks[0]` greater than it.

### Why results are files

A result method answers a question by running the interface's code, so viewing a sort's units needed the sort's Python environment and a server, although nothing had to be computed. Results as files make viewing a Reader capability, like status and provenance already were: from a folder, a bucket or a zip, in any language, after the machine that ran the sort is gone. Live results need nothing new: they are the same files changing, under the rules every record follows (one writer, `updated_at`, the catalog log).

One encoding serves tables, arrays and ragged results so that a Reader implements one decoder, and zarr's file per chunk is what a `Storage` can fetch: the file methods read whole files, so a format that needs byte ranges (Parquet's row groups, an Arrow IPC file) would mean whole-file downloads or a range API on every backend. Parquet would also add the `arrow`/`parquet` crates to a Rust reader and a WebAssembly build to a JS one, and pyarrow to Python; a zarr reader is already in the Rust app this was made for (zarrs), small in JS (zarrita) and not needed in Python. JSON for small tables was declined because it would give one kind two encodings. The price is file count: a table of `c` columns is `2c + 1` small files, fetched in parallel.

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

Format v1 resolves this with four coupled decisions:

- **`directory` is non-identifying.** A project's identity must not encode its
  filesystem location: the same rule as every other record ([Storage](./storage.md)),
  applied to the root itself.
- **The provider is non-identifying.** A project's `interface/project.py` (or a
  `Project` subclass connected directly) supplies hooks such as `on_resolve_remotes`
  and its own config, but the root's identity is always the base `machinable.project`'s
  with an empty config: the same identity key for every project. Were the provider's
  module (`interface.project`) part of it, adding one to a project would move the root,
  and with it the first folder of every record path and every record's `id.json` parent,
  so every existing record would stop being found. A provider is how a project is run,
  not which project it is, so it falls under the same
  rule as the location. The fields a provider or a subclass adds to `Config` are left
  out for the same reason, leaving the directory name below as the root's only
  discriminator.
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
| **Reader** | browse records, config, edges, artifacts, results | directory parsing, the results' zarr subset |
| **Tracker** | the run state machine, claim states | status markers, claim files |
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
