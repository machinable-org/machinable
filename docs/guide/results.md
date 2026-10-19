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

## Declared results

`save_file` writes files tend to be tied to the Python interface code. To save durable resutls, use `save_result` whose format can be read without any dependencies (see [the directory format](../design/format.md#results)).

```python
import numpy as np
from machinable import Interface, result


class Sort(Interface):
    def __call__(self):
        ...
        self.save_result("summary", {"sorter": "kilosort4", "units": len(ids)})
        self.save_result("units", {"unit_id": ids, "snr": snr, "x_um": x})
        self.save_result(
            "templates", templates,               # unit × sample × channel
            chunks=[1, *templates.shape[1:]],     # one unit is one read
            dims=["unit", "sample", "channel"], units="uV",
        )
        self.save_result("spike_trains", trains, index="unit")  # a list of 1-D arrays

    @result
    def peak_channels(self):                      # saved when the run ends
        return {"unit_id": ids, "channel": peak}
```

The value decides the kind, or pass `kind=`:

| Value | Kind | `result(name)` returns |
| --- | --- | --- |
| a dict, list, number, string | `json` | the value |
| a mapping of numpy columns, a DataFrame | `table` | a dict of numpy columns |
| a numpy array | `array` | a lazy array: `a[12]` reads item 12 only |
| a list of 1-D numpy arrays | `ragged` | lazy: `r[12]` is item 12's array |

Tables, arrays and ragged results need numpy and nothing else (they are zarr v3, written without a zarr library). `pd.DataFrame(run.result("units"))` gives a DataFrame back.

```python
run = get("sort", {...}).launch()
run.result("summary")["units"]
templates = run.result("templates")
templates.shape, templates[3]            # (105, 82, 60), unit 3's template
run.result("spike_trains")[3]            # unit 3's spikes
run.results_manifest()["results"]        # what there is
```

**Live results.** `save_result(name, rows, append=True)` adds rows to a table or items to an array or a ragged result while the run goes. Each save writes the data first and the manifest last, and during a run the manifest reads `complete: false` until the run ends (`results_complete()` marks it by hand outside a run). A run's first save replaces the results of the interface's last run. With a remote home, each save reaches the home as it is made, so a machine following it ([storage](./storage.md)) sees them grow.

**Reading elsewhere.** A record indexed from a remote home brings `results.json` and the small json results with its catalog. A table's or an array's files come when a read needs them, chunk by chunk: `templates[3]` on a laptop downloads one unit's chunk from the bucket. The server serves them the same way, without importing the interface: `GET /v1/executions/{uuid}/results` and `/results/{name}?item=3` (see [the server](./server.md)).

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
