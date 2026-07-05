Requires the Slurm command-line tools (`sbatch`, `squeue`, `scancel`) on the host.

## Usage

```python
from machinable import get

with get("slurm", {"ranks": 8, "preamble": "mpirun"}):
    ...  # your component
```
