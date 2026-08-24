# ssh

Runs an execution on another machine while API server, the index, etc. stay local (see [Transport](https://machinable.org/reference/python/transport)).

```bash
machinable get ssh slurm my_interface --launch
```

## Configuration

```python
from machinable import get

with get("ssh", {
    "host": "gpu.lan",                # anything ssh takes, including a config alias
    "directory": "/home/me/project",  # the project, on the far side
    "storage": "/scratch/me/storage", # the storage root, on the far side
}):
    get("my_interface").launch()
```

## Monitoring

Nothing runs on the far side, so watching a run is a poll:

```python
status = transport.wait(interface, timeout=3600)   # markers only, cheaply
transport.sync(interface)                          # the whole record, once
```

`wait` returns when the run finishes or when its heartbeat goes stale.

The poll fetches the `*_at` markers, the run's `output.log`, and the scheduler's `job.out` so following a job's log does not cost much. Artifacts come back on an explicit `sync`.

## What it needs on the far side

Each command opens a connection and closes it again, with a short `ControlPersist` window so a burst shares one connection without holding it open. The far side needs the scheduler, and an interpreter for the job itself (e.g. Slurm's `node_local` + `venv_tar`)

