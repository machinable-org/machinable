# dmosopt component

Integration for [dmosopt](https://github.com/dmosopt/dmosopt).

## Usage example

```python
from machinable import get

with get("mpi", {"ranks": 8}):
    get("dmosopt", {'dopt_params': ...}).launch()
```

## Source

::: code-group

<<< @/examples/dmosopt-component/dmosopt.py

:::



