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
