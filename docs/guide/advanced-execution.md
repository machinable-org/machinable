# Execution in depth

Building on [Execution](./execution.md): laying out grids in code, controlling
dispatch order, and reading a run's lifecycle.

## Aggregates and deferred collection

A common pattern is an **aggregate interface**: one whose `launch()` lays out a grid of
other runs in code. The aggregate is an ephemeral coordinator and is never materialized
itself.

```python
class Optimizers(Interface):
    class Config(BaseModel):
        seeds: int = 10

    def launch(self):
        for seed in range(self.config.seeds):
            with get("machinable.scope", {"seed": seed}):
                get("train", [self.version()]).launch()

    def version_sgd(self):  return {"optimizer": "sgd"}
    def version_adam(self): return {"optimizer": "adam"}
```

To gather an aggregate's runs without executing them, use `.interfaces`, which runs
`launch()` inside a deferred execution and returns the collected interfaces:

```python
agg = get("optimizers", ["~sgd"])
runs = agg.interfaces                      # the grid, collected (not run)
ready = runs.filter(lambda x: x.cached())  # the ones with results
```

This deferred-collection mechanism is what [inferences](./inference.md) use to gather
the runs they measure.

## Axis or aggregate?

An [axis](./versions.md#axes-one-token-many-runs) covers the flat case with the same interface over N inputs. An aggregate is a whole interface, so it covers everything else.

Use an axis when the sweep is a set of points you can enumerate without running anything:

```python
@staticmethod
def axis_sessions(root="data"):
    return [{"path": p} for p in sorted(glob(f"{root}/*.json"))]
```

Use an aggregate interface when the sweep is a procedure:

- it has parameters that should be part of a record (`seeds: int = 10` in a `Config`)
- runs depend on each other, or the order matters (see the recipe below);
- it needs results to decide what to run next;
- it opens contexts an axis cannot, or interleaves launching with other work.

An adaptive sweep (one that reads prior results to choose the next points) belongs in an aggregate since it records its dependencies as [`uses`](./relations.md), while an axis leaves no trace in [provenance](./provenance.md) at all.

## Recipe: ordering dependent runs

An execution can reorder its interfaces before dispatching, and the ordering strategy can itself be an ordinary interface. The following `DependencyGraph` topologically sorts executables by their [`uses`](./relations.md) relations, skipping anything already cached:

```python
from machinable import Interface
from machinable.collection import InterfaceCollection


class DependencyGraph(Interface):
    """Orders executables so that their dependencies (``uses``) run first."""

    def __call__(self, executables: InterfaceCollection) -> InterfaceCollection:
        ordered = InterfaceCollection()
        done = set()

        def _key(interface):
            return interface.uuid if interface.uuid is not None else id(interface)

        def _resolve_dependencies(_executables):
            for e in reversed(_executables):
                if e.uses:
                    _resolve_dependencies(e.uses)
                if e.cached():
                    done.add(_key(e))
                    continue
                if _key(e) not in done:
                    ordered.append(e)
                    done.add(_key(e))

        _resolve_dependencies(executables)  # depth-first
        return ordered
```

An execution receives the strategy via `uses=` and applies it in its dispatch:

```python
class Trace(Execution):
    @property
    def scheduler(self):
        return self.uses.first()

    def __call__(self):
        executables = self.interfaces
        if self.scheduler is not None:
            executables = self.scheduler(executables)
        for executable in executables:
            self.dispatch_interface(executable)


with Trace(uses=get(DependencyGraph)):
    a = get(A).launch()
    b = get(B, uses=[a]).launch()
    get(D, uses=[b]).launch()   # runs after a and b
```

## Concurrent dispatch

An interface dispatched from several places at once runs once. That holds for threads in one process, for processes sharing one index, for processes or servers with an index each over one storage folder, and for machines whose storage is the same shared filesystem, i.e. anything that sees the same record directories. Nothing to set up; dispatch claims an interface before it runs it:

1. A run of the interface that finished elsewhere is adopted (indexed here if another index made it) and the interface ends cached, with `cached()` reason `"finished elsewhere"`. An interface whose claim another dispatcher holds is running elsewhere.
2. Otherwise it claims the interface and runs it as the claimed run-record, then releases the claim once the run's `finished_at` is written. The claim is a small file, `<identity>/.claims/<predicate>` beside the interface's directory in the storage, described in [the directory format](/design/format#claims).

By default a dispatcher that finds the interface running elsewhere waits for that run and then ends cached on it. If the run dies instead (its heartbeat goes stale), exactly one waiter takes the claim over, marks the dead run-record `abandoned_at` (it reads as died and is never resumed) and runs the interface. `wait_elsewhere` changes that:

```python
from machinable import Execution, get

execution = Execution().wait_elsewhere(False)        # or timeout=60, interval=1
with execution:
    get("train", {"lr": 0.1}).launch()

execution.elsewhere   # {interface id: ("running elsewhere" | "finished elsewhere", run id)}
```

With `wait=False`, or once `timeout` seconds pass, dispatch leaves the interface uncached and goes on; `elsewhere` names the run that holds it. Waiting looks again every `interval` seconds (a second by default).

With several storages connected, dispatch looks in all of them; the claim goes to the [home](./storage.md#homes-and-mirrors) (the innermost connected storage), or, when it cannot claim exclusively, to the first mirror that can, from the inside out. An object store claims with conditional writes; machines sharing one bucket run an interface once just as processes sharing one folder do (see the [s3 integration](/integrations/s3#several-machines-on-one-bucket)).

## Execution metadata

A materialized execution exposes its lifecycle and a memorable handle:

```python
run = get("train", ["~sgd"])
run.launch()
ex = run.execution
ex.nickname        # e.g. "chocolate_mosquito"
ex.is_started(), ex.is_finished(), ex.is_live()
```

Executions are never deduplicated, since each run is a distinct event.
