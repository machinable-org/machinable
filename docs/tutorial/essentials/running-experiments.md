# Running experiments

## Executing experiments

Once implemented and configured, experiments can be executed by calling the `execute()` method.

```python
>>> from machinable import Experiment
>>> experiment = Experiment.instance('estimate_gravity')
>>> experiment.execute()
Assuming height of 52 and time of 0.3
The gravity on the exoplanet is:  1155.5555555555557
```

If the execution is successful, the experiment is marked as finished. 
```python
>>> experiment.is_finished()
True
```

By design, experiments can only be executed once. Repeated invocations of `execute()` after the initial execution, are simply ignored. On the other hand, if an execution failed, calling `execute()` will resume the execution.

## Modes of execution

By default, experiments are executed locally, but it is easy to use other modes of execution. 

For example, execution on [Slurm](https://slurm.schedmd.com/documentation.html) can be as simple as:

```python
experiment.execute('machinable.execution.slurm')
```

Or delegating the execution to an external runner like [MPI](https://www.open-mpi.org/) may look like this:

```python
experiment.execute('machinable.execution.external', {
    'runner': ['mpi', '-n', 4]
})
```

Notice that `execute()` follows the same convention as `Experiment.instance()` to specify and load <Pydoc>machinable.Execution</Pydoc>s by their module name, where configuration options can be passed as a dictionary.

To learn more about available options, check out the [reference documentation](../../reference/). You may also be interested in [implementing a custom execution](../elements-in-depth/).



