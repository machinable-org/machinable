Requires an MPI launcher (`mpirun` or compatible) on the host.

## Usage

```python
from machinable import get

with get("mpi", {"ranks": 8}):
    ...  # your MPI-ready component
```
