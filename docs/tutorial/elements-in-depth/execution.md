# Execution

::: warning Coming soon

This section is currently under construction

:::

Using a queue system like [Slurm](https://slurm.schedmd.com/documentation.html) may be as simple as:

```python
with get('myproject.execution.slurm'):
    experiment.launch()
```

Delegating the execution to an external runner like [MPI](https://www.open-mpi.org/) may look like this:

```python
with get('myproject.execution.mpi', {'n': 4}):
    experiment.launch()
```

## Resources


## Schedules

