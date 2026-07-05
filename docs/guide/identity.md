# Identity & dedup

machinable is content-addressed, so a run's identity is computed from what it *is*, not
where or when it ran. This is what makes results reproducible, sweeps incremental, and
`get(...)` able to reload prior work.

## The identity of a run

A run is identified by three things:

- **`identity_key`**: `hash(module + canonical(config))`. The configuration's canonical
  normal form, so equivalent configs collapse to one key.
- **`predicate_key`**: a hash of the run's [predicate](#predicates-and-scopes) (ambient
  scopes + `on_compute_predicate()`), which distinguishes runs that share a config.
- **`parent_id`**: the enclosing project or interface.

Two interfaces with the same `(parent, identity_key, predicate_key)` are the same
record. `get(...).launch()` for an existing one is a cached no-op.

## Canonical configuration

`identity_key` hashes a canonical form of the config, not its raw bytes, so it is robust
to incidental differences:

- **Version spelling is ignored.** `["~large"]` and the dict it expands to hash the same
  (see [Versions](./versions.md)).
- **Defaults don't count.** A field left at its default contributes nothing; setting it
  explicitly to the default is the same run. Consequently, adding a new config field
  with a default does not orphan prior runs.
- **Key order is irrelevant**, and pydantic coercion means `1` and `1.0` agree for typed
  fields.

You can therefore evolve a `Config` (add an option, rename a `~version`, restructure
versions) without your existing results disappearing.

## Predicates and scopes

Two runs can share a configuration yet be genuinely different: ten seeds of the same
experiment, say. The **predicate** captures that. The cleanest way to set one is a
[`Scope`](/reference/python/scope):

```python
from machinable import get

for seed in range(10):
    with get("machinable.scope", {"seed": seed}):
        get("train", ["~sgd"]).launch()    # 10 distinct runs, same config
```

Each run inside the scope is tagged `seed=<n>`, giving it a distinct `predicate_key`.
Find a group back by entering the same scope:

```python
with get("machinable.scope", {"seed": 3}):
    get("train", ["~sgd"]).all()           # runs tagged seed=3
```

You can also compute a predicate from data:

```python
class Train(Interface):
    def on_compute_predicate(self):
        return {"dataset_id": read_manifest(self.config.data_uri)["id"]}
```

### Recipe: a custom scope

A scope is an interface, so grouping conventions can be encoded once and reused. This
`Group` scope resolves a time pattern into a stable label, tagging every run created
inside it:

```python
from datetime import datetime

from machinable.scope import Scope


class Group(Scope):
    """Tag runs with a date-resolved group label, e.g. runs/2026-07-04."""

    def __init__(self, pattern: str = ""):
        super().__init__(version=None)
        self.path = datetime.now().strftime(pattern.lstrip("/"))

    def __call__(self):
        return {"group": self.path}
```

```python
with Group("runs/%Y-%m-%d"):
    get("train", ["~sgd"]).launch()        # tagged with today's group
```

Scopes are how aggregates lay out a grid; the
[concluding example](./putting-it-all-together.md) wraps each seed in a scope so its
runs don't collapse to one record.

Two refinements build on this and are covered in
[Advanced configuration](./advanced-configuration.md): excluding environment-dependent
fields from identity (`Field(identifying=False)`), and referencing objects or other
interfaces in a way that keeps identity stable.

## Finding and matching

Because identity is canonical, finding tracks the computation, not the spelling:

```python
get("train", [{"layers": 12}]).launch()        # store one spelling
get("train", ["~large"]).all()                  # finds it since ~large expands to layers=12
```

- `interface.all()` returns every matching run (an
  [InterfaceCollection](./collections.md)).
- `get(module, version)` (a singleton lookup) returns the existing run if one matches,
  else builds a fresh one.

A result caches on its identity; invalidating one deliberately is covered in
[Results & files → Caching and invalidation](./results.md#caching-and-invalidation).
The rationale behind all of this is in
[Design notes → Config identity](/design/identity).
