# Interfaces

The [`Interface`](/reference/python/interface) is the unit of machinable. Everything you run,
store, or analyze is an interface: a piece of research code with a typed
[`Config`](./configuration.md), a place to save results, and an identity derived from
its configuration.

```python
from pydantic import BaseModel

from machinable import Interface


class MnistData(Interface):
    """A dataset of handwritten characters."""

    class Config(BaseModel):
        split: str = "train"

    def __call__(self):
        # produce and persist the dataset
        self.save_file("data.npy", download_and_prepare(self.config.split))

    def load(self):
        return self.load_file("data.npy")
```

## Resolving an interface

You rarely instantiate an interface directly. Instead, `machinable.get` (a
[`Query`](/reference/python/query)) resolves one by module name and an optional
[version](./versions.md):

```python
from machinable import get

data = get("mnist_data", {"split": "test"})
```

`get` is content-addressed, so if a run with this exact configuration already
exists, the existing record is returned; otherwise you get a fresh, unmaterialized interface.
(`get` is a [`Query`](#querying) object, so `get.by_id(uuid)`, `get.all(...)`, and so
on also work.)

## Lifecycle

An interface moves through a few states:

| State | How | Meaning |
| --- | --- | --- |
| **unmaterialized** | `get(...)` | configured, no storage yet |
| **materialized** | `.materialize()` / `.launch()` | has a `uuid` and a directory; config is now immutable |
| **computed** | `.launch()` | `__call__` has run; results are on disk |

```python
run = get("optimize", {"lr": 0.5})
run.launch()              # materialize + run __call__
run.uuid                  # a stable identifier
run.local_directory()     # where its files live
```

- `materialize()` registers the interface in the [index](./storage.md) and writes its
  `model.json`, but does not run `__call__`.
- `launch()` materializes (if needed) and computes it through an
  [`Execution`](./execution.md). Launching an already-computed interface is a no-op.

## Saving and loading results

Inside `__call__` (or any method), persist and read results through the interface:

```python
class Optimize(Interface):
    def __call__(self):
        self.save_file("result.json", {"loss": 0.1})   # serialization by extension

    def loss(self):
        return self.load_file("result.json")["loss"]
```

File formats, attributes, where the files live, and cache invalidation are covered in
[Results & files](./results.md).

## Useful methods and properties

| Member | What it gives you |
| --- | --- |
| `config` | the resolved, read-only configuration |
| `version()` | the compact `~version`/override [version](./versions.md) list |
| `uuid` / `id` | identifiers; `id` is a short form |
| `predicate` | the [predicate](./identity.md) (scopes + `on_compute_predicate`) |
| `cached()` | whether this run is marked ready/cached |
| `launch()` / `materialize()` | run / register it |
| `all()` / `singleton()` | [find](./identity.md#finding-and-matching) sibling runs |
| `derive(...)` / `related()` | [relations & lineage](./relations.md) |
| `to_cli()` | the run rendered as its compact CLI command |

## Events

Override `on_*` hooks to run code at lifecycle points without touching `__call__`:
`on_before_configure`, `on_configure`, `on_after_configure`, `on_before_materialize`,
`on_materialize`, `on_after_materialize`, `on_compute_predicate`.

## Querying

`get` doubles as a query entry point:

```python
get.by_id("…uuid…")              # a specific run
get("optimize").all()            # all Optimize runs (an InterfaceCollection)
get("optimize", {"lr": 0.5})     # find-or-build a specific configuration
```

Collections are covered in [Collections](./collections.md); how "the same" run is
decided in [Identity & dedup](./identity.md).
