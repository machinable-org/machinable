# Introduction

## What is machinable?

**machinable** is a Python system for research code. It gives your experiments an
object-oriented skeleton, the [`Interface`](./interface.md), and handles the tedious
housekeeping (configuration, execution, storage, results, provenance) behind a single
abstraction.

The core idea is to unify running code and retrieving its results. You write a piece of
research code once; machinable makes running it and reading back what it produced the
same operation. Because results are content-addressed, asking for the same thing twice
is free.

Here is the whole idea in one example.

**1. Write some code** as an `Interface` with a typed `Config`:

::: code-group

```python [montecarlo.py]
from random import random

from pydantic import BaseModel

from machinable import Interface


class EstimatePi(Interface):
    class Config(BaseModel):
        samples: int = 100

    def __call__(self):
        count = 0
        for _ in range(self.config.samples):
            x, y = random(), random()
            count += int((x**2 + y**2) <= 1)
        pi = 4 * count / self.config.samples
        self.save_file("result.json", {"count": count, "pi": pi})

    def summary(self):
        pi = self.load_file("result.json")["pi"]
        print(f"After {self.config.samples} samples, PI is approximately {pi}.")
```

:::

**2. Run it and read its results** through one abstraction:

::: code-group

```python [Python]
from machinable import get

# Resolve the interface in montecarlo.py with samples=150.
# If a run with this exact configuration already exists, it is reloaded.
experiment = get("montecarlo", {"samples": 150})

# Compute it unless it has already been computed (content-addressed).
experiment.launch()

experiment.summary()
# >>> After 150 samples, PI is approximately 3.1466666666666665.
```

```bash [CLI]
$ machinable get montecarlo samples=150 --launch --summary
> After 150 samples, PI is approximately 3.146666...
```

:::

The same `get(...)` call resolves an interface, reloads it if it already ran, and gives
you back an object whose methods (`summary()`, your own analysis) read the stored
results. Run it again with `samples=150` and nothing recomputes; machinable recognizes
it as the same experiment.

## The principles

- **Modularity.** Each unit of research is an `Interface` in its own module, configured
  by a typed `Config`. The Monte-Carlo algorithm above is reusable and parameterizable.
- **Content-addressing.** A run's identity is a hash of its module and canonical
  configuration. Identical configurations share one stored record, so sweeps are
  incremental and results are reproducible by construction. See
  [Identity & dedup](./identity.md).
- **Code all the way down.** There is no metrics schema and no sweep DSL. Grids,
  measurements, and even statistical questions are ordinary interface code; machinable
  supplies identity, storage, search, and a few contracts. This is also what lets an AI
  agent drive machinable; see [Agents & MCP](/mcp/overview).

## Where to go next

- New here? Start with [Installation](./installation.md) and the
  [Quickstart](./quickstart.md).
- Learn the model: [Interfaces](./interface.md) → [Configuration](./configuration.md) →
  [Versions](./versions.md) → [Results & files](./results.md) →
  [Execution](./execution.md) → [Identity](./identity.md).
- Work with it: the [CLI](./cli.md), [Collections](./collections.md), and the
  [API server](./server.md).
- Ask questions: [Inference](./inference.md), or let an agent do it via
  [Agents & MCP](/mcp/overview).
- Going deeper: [advanced configuration](./advanced-configuration.md),
  [execution in depth](./advanced-execution.md), and
  [storage & the index](./storage.md).
