# Collections

Queries that can return many runs hand you an
[`InterfaceCollection`](/reference/python/collections#interfacecollection): a thin
handle over live interfaces. Each element is a real interface (with its methods, relations, and lazy
I/O), not a row of values.

```python
runs = get("train").all()                     # an InterfaceCollection
runs.filter(lambda x: x.cached())             # -> a smaller collection
runs.map(lambda x: x.loss())                  # -> a list of values
runs.first(), runs.last(), len(runs)
```

## Object operations

A collection keeps only the operations you perform on live interfaces:

| Method | Purpose |
| --- | --- |
| `filter(fn)` / `map(fn)` | select / project with Python lambdas |
| `first()` / `last()` | endpoints |
| `singleton()` | the single expected match |
| `find_many_by_id(ids)` | re-hydrate a set of uuids |
| `launch()` | launch every run in the collection |
| relation traversal | follow `derived`/`uses`/… across the collection |

It does not implement analytics (`pluck`, `avg`, `groupby`, ...); for analysis, hand
off to pandas. The reasoning is in
[Design notes → Key decisions](/design/decisions#the-collection-clean-break).

## Analysis: `as_dataframe()` → pandas

`as_dataframe()` flattens a collection into a tidy pandas DataFrame with one row per run
and flat columns (`uuid`, `module`, `version`, `cached`, `label`, `created_by`, and
`config.<field>`):

```python
df = runs.as_dataframe()                       # needs machinable[all]
df.groupby("config.optimizer")["uuid"].count()
best = df.query("config.lr == 0.5")
```

`pandas` is a lazy, optional import, so it never enters machinable's core.

## Round-trip by uuid

Use pandas for selection and analysis, then go back to the collection for behavior:

```python
df = runs.as_dataframe()
ids = df.query("config.optimizer == 'sgd'")["uuid"]
subset = runs.find_many_by_id(ids)             # -> a Collection of live interfaces
subset.map(lambda x: x.loss())                 # call domain methods again
```
