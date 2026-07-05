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

## Recipe: ordering dependent runs

An execution can reorder its interfaces before dispatching, and the ordering strategy
can itself be an ordinary interface (no special kind): stored, shareable, and part of
provenance like everything else. This `DependencyGraph` topologically sorts executables
by their [`uses`](./relations.md) relations, skipping anything already cached:

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

## Execution metadata

A materialized execution exposes its lifecycle and a memorable handle:

```python
run = get("train", ["~sgd"])
run.launch()
ex = run.execution
ex.nickname        # e.g. "chocolate_mosquito"
ex.is_started(), ex.is_finished(), ex.is_live()
```

Executions are never deduplicated, since each run is a distinct event; the interfaces
they compute are.
