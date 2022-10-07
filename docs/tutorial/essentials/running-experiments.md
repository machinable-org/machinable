# Running experiments

## Executing experiments

Once implemented and configured, experiments can be executed by calling <Pydoc caption="execute()">machinable.Experiment.execute</Pydoc>:

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

## Reproducibility

By design, experiment instances can only be executed once. There are automatically assigned a unique experiment ID, a random seed as well as a nickname for easy identification.

```python
>>> gravity = Experiment.instance('estimate_gravity')
>>> gravity.experiment_id
'GDCN4d'
>>> gravity.nickname
'jet_oak'
>>> gravity.seed
1632827863
```

Repeated invocations of `execute()` after the initial execution, are simply ignored. On the other hand, if an execution failed, calling `execute()` will resume the execution with the same random seed.

To replicate or reproduce a experiment, create a new experiment instance with the same configuration. Learn more about [continuing and repeating experiments](../elements-in-depth/experiments.md#derivation).

## Modes of execution

Experiment may be executed in different ways.

For example, instead of the default single-threaded execution, you may like to run your experiment isolated using multiprocessing:

```python
experiment.execute('machinable.execution.local', {'processes': 1})
```

Execution on [Slurm](https://slurm.schedmd.com/documentation.html) can be as simple as:

```python
experiment.execute('machinable.execution.slurm')
```

Or delegating the execution to an external runner like [MPI](https://www.open-mpi.org/) may look like this:

```python
experiment.execute('machinable.execution.external', {
    'runner': ['mpi', '-n', 4]
})
```

You may have noticed that `execute()` follows the same convention as <Pydoc>machinable.Experiment.instance</Pydoc> to specify and load executions by their module name and an optional dictionary with configuration options. In fact, the execution modes are implemented just like experiments, but derive from the <Pydoc>machinable.Execution</Pydoc> base class. 

Check out the [reference documentation](../../reference/) for available execution modes. You may also be interested in implementing a [custom execution](../elements-in-depth/).



