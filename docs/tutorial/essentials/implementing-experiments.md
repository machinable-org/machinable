# Implementing experiments

## Events

The experiments that we have created so far have been nothing more than an empty shell. Let's add an actual implementation by overriding <Pydoc caption="on_execute()">machinable.Experiment.on_execute</Pydoc>

```python
from machinable import Experiment

class EstimateGravity(Experiment):
  """An experiment to estimate gravity"""

  def __call__(self):
      time_dilation = 1.0
      height = 52
      time = 0.3
      g = 2 * height / time ** 2
      print("The gravity on the exoplanet is: ", g)
```

The <Pydoc>machinable.Experiment</Pydoc> base class provides a variety of these lifecycle event methods that are prefixed with `on_`, such as <Pydoc caption="on_create()">machinable.Experiment.on_create</Pydoc>, <Pydoc caption="on_success()">machinable.Experiment.on_success</Pydoc>, etc.

When you implement your algorithm, pick an appropriate event and add your code in the event method. Of course, you are free to add other methods or properties to your class if needed.

The event methods will be called automatically at the appropriate time, so you don't have to call them manually. For example, code placed in the <Pydoc caption="on_failure()">machinable.Experiment.on_failure</Pydoc> event is automatically invoked if an exception occurs.

Feel free to explore all available events in the [reference documentation](../../reference/); in most cases, placing your algorithm in the <Pydoc caption="on_execute()">machinable.Experiment.on_execute</Pydoc> method is the right choice.

::: details Aside: How can I use existing code?

If you have some existing code, you can call it from the experiment without any additional changes, for example:

```python
from machinable import Experiment

from my_code import existing_implementation

class EstimateGravity(Experiment):
  def __call__(self):
      # call into your existing code without any further changes
      existing_implementation()
```

:::

## Configuration

In practice, of course, experiments tend to have a number of varying parameters.

We can define configuration options of the experiment using a `Config` dataclass placed at the top of the experiment class definition:

```python
from dataclasses import dataclass
from machinable import Experiment

class EstimateGravity(Experiment):
  """An experiment to estimate gravity"""

  @dataclass
  class Config:
      time_dilation: float = 1.0
      verbose: bool = True

  def __call__(self):
      height = 52
      time = 0.3 * self.config.time_dilation
      if self.config.verbose:
        print(f"Assuming height of {height} and time of {time}")
      g = 2 * height / time ** 2
      print("The gravity on the exoplanet is: ", g)

```

The parameters become available under `self.config` and can be accessed with object-notation (`self.config.my.value`) or dict-style access (`self.config['my']['value']`).

Notably, the `Config` dataclass allows for many advanced features such as validation, parameter documentation, computed values, etc., which will be covered in [later sections of the tutorial](../elements-in-depth/advanced-configuration.md).

---

To instantiate the experiment with different parameters, you can pass a dictionary as argument to <Pydoc>machinable.get</Pydoc>, for example:

```python
>>> from machinable import get
>>> gravity = get('estimate_gravity')
>>> gravity.config.time_dilation
1.0
>>> gravity = get('estimate_gravity', {'time_dilation': 2})
>>> gravity.config.time_dilation
2.0
```

In the last line, it is worth noting that the `int` 2 was automatically casted to a `float` as the dataclass specified. Generally, the experiment configuration types will be enforced to prevent subtle configuration errors.

## Design considerations

As you may have noted above, experiments can be instantiated and accessed without side-effects (e.g. without necessarily triggering the gravity computation). As a result, we can inspect the configuration and catch mistakes like the following typo early:

```python
>>> gravity = get('estimate_gravity', {'time_diliation': 2})
>>> gravity.config
E  ValidationError: 1 validation error for Config
E  time_diliation
```

Early validation is a key design principle of the experiments; when implementing an experiment, we encourage you to perform checks as early as possible and separate them from your main code. Learn more about [early-validation techniques](../elements-in-depth/advanced-configuration.md#validation).

Finally, it is good practice to design your code in a way that it can be resumed automatically if failures occur. For example, you may checkpoint and automatically reload intermediate results. Check out the [checkpointing example](../../examples/checkpointing.md) to see this in action.
