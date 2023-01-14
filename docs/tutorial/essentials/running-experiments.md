# Running experiments

## Executing experiments

Once implemented and configured, experiments can be executed by calling <Pydoc caption="launch()">machinable.Experiment.launch</Pydoc>:

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

By design, experiment instances can only be executed once. They are automatically assigned a unique experiment ID, a random seed, as well as a timestamp for easy identification.

```python
>>> gravity = get('estimate_gravity')
>>> gravity.experiment_id
'GDCN4d'
>>> gravity.timestamp
1673648406
>>> gravity.seed
1632827863
```

Invocations of `launch()` after successful execution, do not trigger another execution since the experiment is already finished. On the other hand, if the execution failed, calling `launch()` will resume the execution with the same random seed.

To replicate or reproduce an experiment, create a new experiment instance with the same configuration. Learn more about [continuing and repeating experiments](../elements-in-depth/experiments.md#derivation).

## Implementing custom execution

Experiments can be executed in different ways. You may, for example, like to run experiments using multiprocessing or execute on a cloud environment. However, instead of adding the execution logic directly to your experiment code, machinable makes it easy to separate concerns. You can encapsulate the execution implementation in its own execution class that can then be used to execute the experiment. 

To implement an execution, create a module with a class that inherits from the <Pydoc>machinable.Execution</Pydoc> base class, for example:

_multiprocess_execution\.py_

<<< @/snippets/examples/execution/multiprocess.py

Much like in the case of experiments, the execution class provides a `Config` dataclass and implements the `on_dispatch` event that handles the execution of the given `self.experiments` by calling them within a subprocess (`experiment()`). 

Like before, we can instantiate this execution using the module convention:
```python
from machinable import get

multiprocessing = get("multiprocess_execution", {'processes': 2})
```

Then, to use it, we can wrap the launch in the execution context:

```python
with multiprocessing:
    experiment.launch()
```

Check out the [execution guide](../elements-in-depth/execution.md) to learn more about executions. You may also be interested in the [execution examples](../../examples/execution.md) that you may like to use in your projects.
