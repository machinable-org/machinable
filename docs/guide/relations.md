# Relations & lineage

Interfaces form a graph. machinable tracks the edges so you can ask "what derives from
what" and "what used what".

## Derivation

Derive a new interface *from* an existing one to record an ancestry edge:

```python
parent = get("dataset", {"split": "train"}).materialize()

child = parent.derive("model", {"layers": 12}).materialize()
child.ancestor          # -> parent
parent.derived          # -> a collection containing child
```

`derive(module, version)` is content-addressed within the parent, so deriving the same
configuration twice returns the same child.

## Uses

When one interface *uses* another (a dependency, an input), record it with the `uses`
relation, typically by passing `uses=` at construction:

```python
data = get("dataset").materialize()
run = get("train", uses=data)
run.uses               # -> a collection: [data]
data.used_by           # -> the inverse
```

A run can use a run of another project sharing the storage and index, whose module does not import here. `find_by_id(uuid, stub=True)` loads such a record as a plain `Interface` carrying its uuid, module, version, config and directory (where the module imports, it loads the run as usual), and relations load their neighbours this way, so `run.uses` and `run.provenance()` read back in any project:

```python
sort = Interface.find_by_id(sort_uuid, stub=True)
fit = get("fit", uses=sort)
```

## Data as a record

Raw data (a folder of recordings, a dataset) can be a record of its own, which runs `use` like any other input. Its module subclasses `machinable.Data`, and its `Config` is a `PlainConfig`, i.e. plain data that names the content, such as a format and the hash of the file listing. The files are the record's artifacts, and the class's methods read them:

```python
from machinable import Data, PlainConfig


class OpenEphysSession(Data):
    class Config(PlainConfig):
        format: str
        listing: str  # sha256 of the [path, size] list

    def recording(self):
        return read_open_ephys(self.local_directory("Record Node 101"))
```

A `Data` record is never executed (`launch()` refuses), has no run-records, and has `machinable.data` among its `inherits`, which is how `find` and a catalog tell inputs from runs. Data records usually live in a project of their own named `data` (`Project("data")`), so several projects use the same records.

A `PlainConfig` record is a function of plain inputs alone, so a program without Python (an uploader) writes the same record that Python would: same id, same home, same `model.json` (see [the format](/design/format#plain-config-records)). The price is that none of the configuration machinery applies:

- every field is required and identifying: no defaults, no `default_factory`, no
  `Field(identifying=False)`;
- the model is strict (`1` is not a float, give `1.0`) and forbids extra keys; no
  validators, aliases, serializers or computed fields; types are `str`, `int`, `float`,
  `bool`, `None`, `list`, `dict` (string keys), `Literal` and nested `PlainConfig`;
- the version is one mapping, the config itself: no `~versions`, `~~axes` or config
  methods, and `${...}` in a string is data, never interpolated;
- the interface overrides none of `on_before_configure`, `on_configure`,
  `on_after_configure`, `on_instantiate`, `on_compute_predicate`, the materialize hooks
  or `on_commit`;
- the predicate is always `{}`, whatever `Scope` is open, and the parent is always the
  project root, whatever storage is entered; a plain record is never derived and has no
  relations when it is made.

Breaking a rule raises `PlainConfigError` when the class is defined, or when the record is made for the rules only a value can break.

### Working copies

On the machine that holds a used record's files as a plain folder (not its home and not a pulled copy), a run can read that folder instead of fetching the record. Pass the record with the folder:

```python
session = Interface.find_by_id(session_uuid, stub=True)
get("sort", uses=[(session, "/data/rig2/2026-10-28_session")]).launch()
```

In the run, `session.local_directory(name)` resolves into the folder, and nothing is fetched or written there. The dispatch API takes the same as `working_copy`, a map of used uuid to folder. The path is kept in this index's private overlay; the edge log records the record's uuid, never the path, so provenance stays location-free.

## Traversing the graph

- `interface.inherits` is the tuple of base modules an interface inherits from (its
  class-MRO chain).
- `interface.lineage()` is the derivation chain: the ancestors from root down to the
  immediate parent (what `derive` recorded), not inheritance.
- `interface.related(deep=False)` returns the neighbours across every relation
  (`derived`, `ancestor`, `uses`, executions, ...) as a collection:

```python
for neighbour in run.related():
    print(neighbour.module, neighbour.uuid)
```

- `interface.walk(rels=..., depth=...)` traverses the typed graph as
  `(source, rel, target)` edge triples, and `interface.provenance()` assembles the full
  [provenance graph](./provenance.md), the same object the API server and
  [MCP](/mcp/overview) expose.

Relations are persisted alongside the run, so the graph survives a
[reindex](./storage.md) and remains queryable later.

::: tip Relations don't affect identity
A run's [identity](./identity.md) is its module + config + predicate. Relations are
metadata on top, so deriving or using something never changes a run's `identity_key`. When
an [inference](./inference.md) needs its operands to be part of identity, it folds them
into the predicate, not a relation.
:::
