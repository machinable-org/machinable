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

## Local, remote, and availability

A run's data may be local, available in a remote store, or evicted (indexed but not
present locally). machinable tracks this so you can fetch on demand:

```python
run.is_mounted()     # is the data here right now?
run.fetch()          # pull it from a connected remote store if needed
```

[Storage backends](/integrations/) (e.g. [Globus](/integrations/globus))
are interfaces too. Connect one as a context and committed runs are mirrored to it.

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
