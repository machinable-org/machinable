# Execution

::: warning Coming soon

This section is currently under construction

:::

For instance, execution using a queue system like [Slurm](https://slurm.schedmd.com/documentation.html) may be as simple as:

```python
experiment.execute('myproject.execution.slurm')
```

Delegating the execution to an external runner like [MPI](https://www.open-mpi.org/) may look like this:

```python
experiment.execute('myproject.execution.mpi', {'n': 4})
```
