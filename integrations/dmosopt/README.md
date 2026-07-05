Wraps [dmosopt](https://github.com/iraikov/dmosopt) as a machinable component; runs
under MPI (combine with the `mpi` integration).

## Usage

```python
from machinable import get

with get("mpi", {"ranks": 8}):
    get("dmosopt", {"dopt_params": ...}).launch()
```
