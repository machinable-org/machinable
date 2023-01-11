# Running experiments

## Executing experiments

Once implemented and configured, experiments can be executed by calling <Pydoc caption="execute()">machinable.Experiment.execute</Pydoc>:

```python
>>> from machinable import get
>>> experiment = get('estimate_gravity')
>>> experiment.launch()
Assuming height of 52 and time of 0.3
The gravity on the exoplanet is:  1155.5555555555557
```

If the execution is successful, the experiment is marked as finished.

```python
>>> experiment.is_finished()
True
```

## Reproducibility

By design, experiment instances can only be executed once. They are automatically assigned a unique experiment ID, a random seed, as well as a nickname for easy identification.

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

## Execution implementations

Experiments can be executed in different ways. You may, for example, like to run experiments using multiprocessing. To configure the execution, <Pydoc caption="execute()">machinable.Experiment.execute</Pydoc> adopts the same module convention as <Pydoc>machinable.Experiment.instance</Pydoc>. You can specify the execution implementation that you like to use by its module name and optionally provide configuration options in form of a dictionary, for example:

```python
with get('myproject.execution.multiprocessing', {'processes': 1}):
    experiment.launch()
```

Just like in the case of experiments, this will instantiate a <Pydoc>machinable.Execution</Pydoc> class in the module `myproject.execution.multiprocessing` which will handle the execution.

Check out the [execution guide](../elements-in-depth/execution.md) to learn more about executions. You may also be interested in the [execution examples](../../examples/execution.md) that you may like to use in your projects.
