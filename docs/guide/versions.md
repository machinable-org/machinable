# Versions

A **version** is how you dial in a configuration without spelling out every field.
Instead of a 40-key dict, you name an experiment with reusable `~versions`. machinable's
[CLI](./cli.md), [API](./server.md), and [MCP](/mcp/overview) all speak versions, and so
should your code.

A version is a list of `~versions` and override dicts, applied left to right:

```python
get("train", ["~bert", "~large", {"batch_size": 256}])
```

## Version methods → `~versions`

Define an experiment axis as a `version_<name>` method that returns a config patch. It
is invoked as `~name`:

```python
class Train(Interface):
    class Config(BaseModel):
        optimizer: str = "sgd"
        lr: float = 0.1

    def version_sgd(self):              # ~sgd
        return {"optimizer": "sgd", "lr": 0.1}

    def version_adam(self, lr=1e-3):    # ~adam   or   ~adam(lr=3e-4)
        return {"optimizer": "adam", "lr": lr}
```

```python
get("train", ["~sgd"])                  # optimizer=sgd, lr=0.1
get("train", ["~adam"])                 # optimizer=adam, lr=1e-3
get("train", ["~adam(lr=3e-4)"])        # adam arm, lr overridden
get("train", ["~adam", {"lr": 5e-4}])   # same, via an override dict
```

Version methods can take arguments (`~adam(lr=3e-4)`) and can be stacked
(`["~bert", "~large"]`). Patches are deep-merged in order, so later `~versions` and override
dicts win key-by-key. Override dicts accept
[dotted paths](./configuration.md#dotted-paths) for nested fields:
`{"optimizer.lr": 3e-4}` is `{"optimizer": {"lr": 3e-4}}`.

`~versions` keep a grid legible, since a comparison reads `~sgd` vs `~adam` instead of two
parameter blobs, both in your loops and when a human reviews an agent's work. (See
[Design notes → Philosophy](/design/philosophy#legibility).)

```python
for opt in ["~sgd", "~adam"]:
    get("train", [opt]).launch()
```

## Axes

Often an experiment is one interface over many inputs. You can declare this as an axis `axis_<name>` static method returning a list of patches, invoked as `~~name`.

```python [spike_sort.py]
from glob import glob

from pydantic import BaseModel

from machinable import Interface


class SpikeSort(Interface):
    class Config(BaseModel):
        path: str = "?"
        threshold: float = 5.0

    def __call__(self):
        ...

    @staticmethod
    def axis_sessions(root="data"):          # ~~sessions
        return [{"path": p} for p in sorted(glob(f"{root}/*.nwb"))]
```

```python
get("spike_sort", ["~~sessions"]).launch()      # every session, dedup'd
```

```bash
machinable get spike_sort ~~sessions --launch
```

`get(...)` returns the interface in an [unexpanded](./interface.md#lifecycle) state where it denotes many runs rather than one. Iterate it, or take `.interfaces`, to get them.

```python
sweep = get("spike_sort", ["~~sessions"])
len(sweep)                                   # how many runs it denotes
sweep.interfaces.filter(lambda x: x.cached()) # the ones with results
```

An axis takes arguments like a version method (`~~sessions(root='raw')`) and expands where the token sits so surrounding patches still merge left to right. Additionally, several axes form a product:

```python
get("spike_sort", ["~~sessions", "~strict"])     # every session, strict threshold
get("spike_sort", ["~~sessions", "~~thresholds"]) # sessions × thresholds
```

An axis may also yield a [scope](./identity.md#scopes), which is how you sweep something that is not configuration, like seeds:

```python
class Train(Interface):
    @staticmethod
    def axis_seeds(n=10):                    # ~~seeds
        return [get("machinable.scope", {"seed": s}) for s in range(n)]
```

```python
get("train", ["~sgd", "~~seeds"]).launch()   # 10 seeded runs of the sgd arm
```

Three rules keep axes predictable:

- An axis is a `@staticmethod` to present a pure function of its arguments. It has no `self` so it cannot read the interface's configuration. Write a relative sweep as `~~variants(base=0.5)`. If the sweep really depends on the interface's config, you want an [aggregate](./advanced-execution.md#axis-or-aggregate) instead.
- Elements must differ so an expansion whose elements resolve to the same interface are rejected rather than silently collapsed.
- Sort your elements because a group is identified by the set it expands into.

Axes are reflected like `~versions`, so the CLI completes them and the [API](./server.md) and [MCP](/mcp/overview) present them before an agent composes an execution. An `axis_*` on the [project provider](./advanced-configuration.md) is available to every module. See [Design notes → Axes](/design/axes) for the why.

## Versions are UX, not identity

Two versions that evaluate to the same configuration share one identity. `["~large"]` and the dict it expands to are the same run; `~adam` and `{optimizer: "adam", lr: 1e-3}` are the same run. The version layer is how you asked for a config, identity tracks the config you got. The same holds for axes where a run launched through `~~sessions` is the same record as that configuration launched on its own, so a sweep adopts the runs you already have. You can rename or restructure your version vocabulary without orphaning past results. See [Identity & dedup](./identity.md).

## Inspecting a version

```python
run = get("train", ["~adam", {"lr": 3e-4}])
run.version()      # the compact version list, the way you asked for it
run.config         # the fully resolved configuration
run.to_cli()       # "train ~adam lr=0.0003", runnable on the CLI
```

`version_*` signatures and docstrings are reflected by the [API](./server.md)
(`get_module`) and [MCP](/mcp/overview), so tools can present your version vocabulary to
an agent before it composes a run.
