# MPI execution

Integration to launch [MPI](https://en.wikipedia.org/wiki/Message_Passing_Interface) jobs.

## Usage example

```python
from machinable import get

with get("mpi", {"ranks": 8}):
    ... # your MPI ready component
```

## Source

::: code-group

<<< @/examples/mpi-execution/mpi.py

:::

