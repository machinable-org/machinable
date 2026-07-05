# Execution

An [`Execution`](/reference/python/execution) is the mechanism that runs interfaces: locally,
with multiprocessing, on a Slurm cluster, over MPI. Keeping "how it runs" separate from
"what it computes" means the same interface can run anywhere.

`Execution` is itself an `Interface`, so it has a `Config`, but that config describes
the resources and mechanism, never the interfaces it runs. Those arrive via `.add(...)`.

```python [multiprocess.py]
from multiprocessing import Pool

from pydantic import BaseModel

from machinable import Execution


class Multiprocess(Execution):
    class Config(BaseModel):
        processes: int = 4

    def __call__(self):
        with Pool(processes=self.config.processes) as pool:
            pool.map(self.dispatch_interface, self.interfaces)
```

`self.interfaces` is the collection of interfaces added to this execution;
`dispatch_interface(x)` runs one.

## Running interfaces

The simplest path is `interface.launch()`, which runs the interface through the default
local execution:

```python
get("train", ["~sgd"]).launch()
```

To use a specific execution, open it as a context and launch inside it:

```python
with Multiprocess({"processes": 8}):
    for seed in range(8):
        with get("machinable.scope", {"seed": seed}):
            get("train", ["~sgd"]).launch()
```

Every interface launched inside the `with` block is collected by the execution and run
by its `__call__`. Execution is content-addressed like everything else:
already-computed interfaces are skipped, so re-running a sweep only does the new work.

## Ready-made executions

You don't have to write an execution for every backend. The
[integrations library](/integrations/) covers common ones
([Slurm](/integrations/slurm), [MPI](/integrations/mpi), and
[Require](/integrations/require)), and because an execution is just an interface,
you write your own the same way. (Reusing interfaces like these across projects is
covered in [Storage](./storage.md).)

## Going further

[Execution in depth](./advanced-execution.md) covers laying out grids in code
(**aggregates** and deferred collection), reordering dependent runs, and reading a
run's lifecycle metadata.
