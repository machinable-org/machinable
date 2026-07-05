# Results & files

Every materialized interface owns a **record directory**, the durable home of its
results. Saving and loading go through the interface, so you never construct paths or
invent file layouts.

## Saving and loading files

```python
class Optimize(Interface):
    def __call__(self):
        self.save_file("result.json", {"loss": 0.1})
        self.save_file("weights.p", model)

    def loss(self):
        return self.load_file("result.json")["loss"]
```

`save_file(path, data)` writes into the record directory and `load_file(path,
default=None)` reads back; the extension picks the serialization:

| Extension | Format |
| --- | --- |
| `.json` | JSON |
| `.jsonl` | JSON lines (a list of records) |
| `.npy` | numpy |
| `.p` | pickle |
| anything else (`.txt`, `.log`, `.sh`, …) | plain text |

Both accept nested paths, and a list of segments joins like `os.path.join`, so
`save_file(["plots", "curve.json"], data)` writes `plots/curve.json` with the folders
created automatically. Files written *before* the interface is materialized are
buffered and flushed to disk on materialize, so you can save from anywhere in the
lifecycle.

## Markers

Markers tag the **live object** in memory. They are not persisted, so they disappear when
the Python object goes away, which makes them a lightweight way to flag runs while
iterating or filtering, never a place for results:

```python
runs = get("train").all()
for run in runs:
    if run.loss() < 0.1:
        run.mark("promising")               # value defaults to True

promising = runs.filter(lambda r: r.marker("promising"))
run.marker("missing", default=False)        # -> False
```

`mark(name, value=True)` sets, `marker(name, default=None)` reads. Anything that
should survive the session belongs in a file via `save_file`.

## Where the files live

`local_directory()` is the record directory; results sit inside it next to the run's
`model.json` (its module, config, and version):

```python
run = get("optimize", {"lr": 0.5}).launch()
run.local_directory()             # e.g. ./storage/0f2a…/
run.local_directory("plots")      # a path inside the record
```

By default records live under `./storage` in the connected project. Changing that
location, mirroring to remote backends, and how records are found again is covered in
[Storage & the index](./storage.md).

## Caching and invalidation

A finished run is **cached**: launching it again is a no-op, and that is what makes
sweeps incremental. `cached()` tells you whether results are ready:

```python
run.cached()        # True after a successful launch
```

machinable never guesses that results went stale, because identity tracks the
config, not the outputs (see [Identity & dedup](./identity.md)). If a
run's outputs change while its config doesn't, invalidate deliberately:

```python
run.cached(False)   # clear the marker
run.launch()        # recompute
```
