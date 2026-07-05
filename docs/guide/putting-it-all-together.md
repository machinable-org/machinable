# Putting it all together

Everything the guide covered, in one small project asking one question: is SGD better
than Adam? A `train` interface with a `loss()`
[quantity](/guide/inference#quantities-how-operands-supply-numbers), an `optimizers`
[aggregate](/guide/advanced-execution#aggregates-and-deferred-collection) that sweeps seeds for its
configured arm (named `~sgd`/`~adam`), and the question asked with an
[`Outperforms`](/guide/inference) inference. Everything is content-addressed, incremental,
and reproducible.

## The project

```python [train.py]
import random

from pydantic import BaseModel

from machinable import Interface


class Train(Interface):
    class Config(BaseModel):
        optimizer: str = "sgd"
        lr: float = 0.1

    def __call__(self):
        rng = random.Random(self.predicate.get("seed", 0))
        floor = 0.10 if self.config.optimizer == "sgd" else 0.16
        self.save_file("loss.json", {"final": floor + 0.02 * rng.random()})

    def loss(self):                      # the <quantity>(): one run's measurement
        return self.load_file("loss.json")["final"]
```

```python [optimizers.py]
from pydantic import BaseModel

from machinable import Interface, get


class Optimizers(Interface):
    class Config(BaseModel):
        seeds: int = 10

    def launch(self):                    # the aggregate lays out the sweep in code
        for seed in range(self.config.seeds):
            with get("machinable.scope", {"seed": seed}):
                get("train", [self.version()]).launch()

    def version_sgd(self):
        return {"optimizer": "sgd", "lr": 0.1}

    def version_adam(self):
        return {"optimizer": "adam", "lr": 1e-3}
```

## Run it and ask the question

```python
from machinable import get

a = get("optimizers", ["~sgd"])
b = get("optimizers", ["~adam"])
a.launch()                          # 10 seeded train runs (incremental, dedup'd)
b.launch()

verdict = (
    get("machinable.mcp.inferences.outperforms", {"quantity": "loss", "tail": "less"})
    .of(a, b)                       # operands fold into the predicate
    .launch()
    .verdict()
)
print(verdict["claim"], verdict["holds"], verdict["p_value"])
# -> "a is less b on 'loss'" True 0.00…
```

`tail="less"` because lower loss is better. The verdict is a stored interface: searchable
(`kind="Inference"`), cached on `(method × operands)`, and [widget](/guide/widgets)-ready.

## With an agent

The exact same loop runs from the [MCP](/mcp/overview), where the agent reads
`examples://investigate`, scaffolds `optimizers.py`, `launch`es each arm, and calls

```
outperforms(a="optimizers", a_version=["~sgd"],
            b="optimizers", b_version=["~adam"], quantity="loss", tail="less")
```

If `train` lacked `loss()`, the tool would return a contract naming the accessor to
write. See [the research workflow](/mcp/workflow).

## What to notice

- The grid is Python (`optimizers.launch()`), not config, and it is incremental.
- The measurement is a method (`loss()`), not a metrics file.
- The question is an interface (`Outperforms`), and its answer is reproducible.
- Re-running any of it only does the new work.
