# Storage & the index

When you materialize an interface, machinable writes it to **storage** (a directory of
files) and records it in an **index** (a SQLite catalog used for fast lookup and
search). A directory is just a location; a run's identity is content-addressed and
independent of where its directory lives.

## Where results live

```python
run = get("optimize", {"lr": 0.5})
run.launch()
run.local_directory()    # e.g. ./storage/0f2a…/, this run's files
run.uuid                 # the content-addressed id
```

By default storage is `./storage` under the connected project. Inside the directory you
will find the run's `model.json` (its module, config, version, predicate) and whatever
your code saved via [`save_file`](./results.md).

To place results somewhere else, connect a [`Storage`](/reference/python/storage) with
the desired location:

```python
from machinable import Storage, get

with Storage("/data/experiments"):
    get("optimize", {"lr": 0.5}).launch()   # results go to /data/experiments
```

Relative paths resolve against the connected project; absolute paths are used as-is.
The same works [on the CLI](./cli.md#choosing-where-results-live).

## Projects

A **project** is just the directory your interface modules live in. By default
machinable uses the current working directory as the project, so running a script from
your project folder needs no setup, and results go to `./storage` there.

To bind to a specific directory explicitly (when a script runs from elsewhere, or when
you juggle several projects), open one as a context:

```python
from machinable import Project, get

with Project("/path/to/project"):
    get("optimize", {"lr": 0.5}).launch()   # resolves modules and stores here
```

See [the API server](./server.md) for serving multiple projects from one gateway.

## The index

The [`Index`](/reference/python/catalog) is a SQLite database that maps identities to
locations and powers search. It lives at `.machinable.sqlite` in the project directory
(set the `MACHINABLE_INDEX` environment variable to move it) and needs no
configuration. You rarely touch it directly (`get`, `all`, and search use it for you),
but it is the answer to "what runs exist".

```python
from machinable import Index

Index.get().local_directory(uuid)   # resolve a uuid to its directory
```

## Rebuilding the index

Because directories carry their own identity header and `model.json`, the index can
always be rebuilt from storage after a move, a copy, or a fresh checkout. Identities
survive a rebuild.

```python
Index.get().reindex()                 # rebuild the whole index from storage
Index.get().ingest_directory(path)    # ingest a single run directory
```

This is why you can hand a results folder to a collaborator and they can index it
as-is.

## Sharing one folder

Several processes, indexes or machines can use one storage folder at once (point `Storage("/shared/experiments")` at it from each; a separate index per machine is the normal case). Records keep the same content-addressed paths and the same ids in every index, and an interface dispatched from several of them at once runs once (see [concurrent dispatch](./advanced-execution.md#concurrent-dispatch)). The `.claims/` directories beside interface directories hold the claims that make that work; they are
not records, are never indexed, and can be deleted when nothing runs.

## Homes and mirrors

A record's home is where it durably lives. The innermost connected storage is the home new records are laid out in while storages connected around it are mirrors, i.e. every commit reaches them too, and they are read when the home lacks a record.

```python
from machinable import Storage, get

with get("s3", {"url": "s3://my-bucket/experiments"}):   # a mirror
    with Storage("/data/experiments"):                  # the home
        get("optimize", {"lr": 0.5}).launch()
```

A home need not be a directory. The [`s3` integration](/integrations/s3) makes a bucket the home (`with get("s3", {...}):` alone), and any store that can list, read, write and remove files can be one. A `Storage` implements those four [file methods](/reference/python/storage) (and, to [claim](./advanced-execution.md#concurrent-dispatch),  two conditional writes), and machinable does the rest. Every record's place is a URI the storage derives from the record's identity (`file://…` on disk, `s3://…` in a bucket); the index stores it and never derives one location from another.

Dispatch looks for an interface in the home first, then in the mirrors from the inside out, and claims it in the first of them that can claim exclusively.

## The working copy

A run always writes into a local directory, its working copy (`run.local_directory()`). On disk the working copy is the home itself, so nothing is ever copied. For a remote home, the working copy sits under the storage's local `directory` (`./storage` by default, in the same layout as the bucket), and dispatch keeps the home current:

- the run-record goes to the home when the run starts, and each status marker as it is written (heartbeats at most every half liveness window), so another machine sees a live run in the home;
- when the run ends, its files and the results it wrote into its interface are pushed, then `finished_at`, then the interface's `cached` marker, then the claim is released;
- outside a run, every change through a machinable API (`save_file`, `set_label`, …) is written through as it is made.

A resumed run pulls its files from the home first, so the working copy can be lost at any time, e.g. delete it and the next read fetches the record again.

## Availability

A record ingested from a remote home arrives catalog-first with its small files (up to `catalog_max_bytes`, 1 MB by default), markers and edge log, but not its large artifacts. It is indexed as `bytes_missing`, and each file is fetched from the home when something reads it:

```python
storage.sync()                    # index what other machines added to the store
run = get("optimize", {"lr": 0.5})
run.load_file("metrics.json")     # small: already here
run.local_directory("model.pt")   # large: fetched now, on first use
run.local_directory("analyzer")   # a folder: the files it lacks, fetched now
run.is_mounted()                  # is a working copy here?
run.fetch()                       # bring everything
```

A folder read by name (`local_directory("analyzer")`, a zarr store, a model checkpoint directory) may already be here with only its small files, the ones that came with the catalog. While the record is `bytes_missing`, reading the folder fetches every file under it that is not here at the home's size, so it is complete when the call returns; once it is, asking again reads nothing, and the record stops being `bytes_missing` when its last file arrives.

`reindex(storage)` rebuilds an index from a store the same way. `storage.sync(since)` returns the records ingested or refreshed and a position to pass next time; an object store keeps a small log of new and changed records (`.catalog/` under its root) for it, because its listing is alphabetical rather than in time order.

## Following a remote home

A record another machine is still writing (a run in progress, an interface whose results it saves later) changes after this machine indexed it. `sync` keeps up with it. The machine that writes a record is never refreshed from the home, since its working copy is at least as new. To keep an index current without a loop of your own, follow the store:

```python
with get("s3", {"url": "s3://my-bucket/lab"}) as storage:
    with storage.follow(15):          # sync now, then every 15 s in the background
        get("machinable.server", {...}).launch()
```

`follow` syncs once before it returns, then in a background thread with the connections of the context it was called in, and `stop()` (or leaving the `with`) ends it. Elsewhere, call `position = storage.sync(position)[1]` on a schedule of your own.

### Reads that see the shared home

A read that names an interface by its module and version can look in the home itself instead of waiting for a sync. Within `adopting()`, `get` looks an interface the index lacks up where its record would be in the home (one small read) and, when another machine made it there, indexes it here with its runs; an interface the index has but that is not cached here gets the runs other machines finished since:

```python
from machinable.interface import adopting

with adopting():
    run = get("optimize", {"lr": 0.5})   # made on another machine: indexed now
    run.cached()                          # True once it finished there
```

`interface.adopted()` does it for one interface and returns it as indexed. An [inference](./inference.md) resolves its operands' runs this way, and the [MCP](/mcp/overview) reads within `adopting()`, so servers on one home answer the same. A lookup by record id cannot know where a record is; the MCP's `run_status` then syncs the homes that keep a catalog log (`machinable.storage.sync_homes()`, from where it last read the log, at most every 5 s).

[Storage backends](/integrations/) (e.g. [S3](/integrations/s3),
[Globus](/integrations/globus)) are interfaces too.

## Remotes: shareable interfaces

A project can resolve shareable interfaces by URL through `on_resolve_remotes`; this is
how [integrations](/integrations/) like `slurm` and `globus` get pulled into a
project. The same mechanism distributes shared [inferences](./inference.md) and
components. Declare remotes in your project's provider:

```python
# interface/project.py — your project's provider
from machinable import Project


class MyProject(Project):
    def on_resolve_remotes(self):
        return {
            "slurm": "url+https://raw.githubusercontent.com/…/<ref>/…/slurm.py",
        }
```

How resolution works:

- **Fetched on first use.** Resolving the module downloads the file into
  `interface/remotes/<module>.py`, from where it imports like any project module.
- **Cached, never re-fetched.** Once the file exists, machinable does not download it
  again. To update, delete `interface/remotes/<module>.py` and change the source.
- **Pin a git ref.** Pointing the URL at a tag or commit (rather than a branch) makes
  the dependency reproducible, so the same project checkout always pulls the same code.
- Besides `url+`, the schemes `file+` (copy) and `link+` (symlink) resolve local
  sources, which is handy for sharing within a monorepo.

::: warning Remotes execute arbitrary code
A remote module runs with your full permissions the moment it is imported, so only
declare URLs you trust — and remember that even a trusted URL is subject to supply-chain
attacks (a compromised host serves different code than you reviewed). Pinning a commit
narrows the window, and `machinable fetch` downloads declared remotes *without*
importing them, so you can inspect the code in `interface/remotes/` before anything
executes:

```bash
machinable fetch            # fetch every declared remote, import nothing
machinable fetch slurm      # fetch one
```
:::

The reasoning behind separating location from identity is in
[Design notes → Storage](/design/storage).
