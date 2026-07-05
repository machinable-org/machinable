# Quickstart

This walks you from an empty folder to a stored, reproducible result.

## 1. A project is just a folder of Python modules

Create a directory and a module with an `Interface`:

```python [optimize.py]
from pydantic import BaseModel

from machinable import Interface


class Optimize(Interface):
    class Config(BaseModel):
        lr: float = 0.1
        steps: int = 100

    def __call__(self):
        # toy "training": a loss that depends on the config
        loss = 1.0 / (1 + self.config.lr * self.config.steps)
        self.save_file("result.json", {"loss": loss})

    def loss(self):
        return self.load_file("result.json")["loss"]
```

A folder containing `optimize.py` *is* a machinable project; there is nothing to
configure. Run the snippets below from that folder (a script or a REPL).

## 2. Resolve, launch, read

```python
from machinable import get

run = get("optimize", {"lr": 0.5})   # resolve with a config override
run.launch()                         # compute it (stored under ./storage)
print(run.loss())                    # read the result back
```

`get("optimize", {"lr": 0.5})` builds the interface; `launch()` runs `__call__` and
persists `result.json`; `run.loss()` reads it. The whole thing is content-addressed:

```python
again = get("optimize", {"lr": 0.5})
again.launch()        # no recompute: same config, same record
assert again == run
```

## 3. Or drive it from the CLI

```bash
$ machinable get optimize lr=0.5 --launch
```

`--launch` runs the interface; trailing `--<method>` calls a method (`--loss` prints the
result). See [the CLI](./cli.md).

## 4. Sweep, incrementally

Because identical configs dedup, a sweep is just a loop, and re-running only computes
the new cells:

```python
for lr in [0.1, 0.5, 1.0]:
    get("optimize", {"lr": lr}).launch()

# collect and analyze
runs = get("optimize").all()           # every stored Optimize run
df = runs.as_dataframe()               # -> pandas (needs machinable[all])
print(df[["uuid", "config.lr"]])
```

::: tip Where do results go?
By default machinable treats the current directory as the project and stores results in
`./storage`. To bind to a specific project directory (from a script run elsewhere, or
when working with several projects), open one explicitly; see
[Storage → Projects](./storage.md#projects).
:::

## Where to go next

You now have the loop: resolve, launch, read, with storage and deduplication handled for
you. Next:

- [Interfaces](./interface.md): the lifecycle and the methods you get.
- [Configuration](./configuration.md) and [Versions](./versions.md): typed config and
  the `~version` shorthand for experiment axes.
- [Results & files](./results.md): saving, loading, and invalidating results.
- [Identity & dedup](./identity.md): exactly what makes two runs "the same".
