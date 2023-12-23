# Slurm execution

Integration to submit to the [Slurm](https://slurm.schedmd.com/documentation.html) scheduler.

## Usage example

```python
from machinable import get

with get("slurm", {"ranks": 8, 'preamble': 'mpirun'}):
    ... # your component
```

## Source

::: code-group

<<< @/examples/slurm-execution/slurm.py

:::
