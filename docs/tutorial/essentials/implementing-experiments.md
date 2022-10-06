# Implementing experiments

## Events

The experiments that we have created so far have been nothing more than an empty shell. Let's add an actual implementation:

```python
from machinable import Experiment

class EstimateGravity(Experiment):
  """An experiment to estimate gravity"""

  def on_execute(self):
      height = 52
      time = 0.3
      g = 2 * height / time ** 2
      print("The gravity on the exoplanet is: ", g)
```

Here, we have placed our algorithm in the <Pydoc>machinable.Experiment.on_execute</Pydoc> method. The <Pydoc>machinable.Experiment</Pydoc> base class provides a variety of different lifecycle events (all starting with `on_`), such as <Pydoc>machinable.Experiment.on_create</Pydoc>, <Pydoc>machinable.Experiment.on_success</Pydoc>, etc.

The event methods will be called automatically during the execution of the experiment, so you don't have to call them manually. Of course, you are free to add other methods or properties to your class if needed. 

::: details How can I use existing code?

If you have some existing code, you can call it from the experiment without any additional changes, for example:

```python
from machinable import Experiment

from my_code import existing_implementation

class EstimateGravity(Experiment):
  def on_execute(self):
      # call into your existing code without any further changes
      existing_implementation()
```

:::


## Configuration

In the above example, we simply hardcoded the basic arguments of the algorithm. In practice, of course, experiments tend to have varying parameters, so let's make our parameters configurable. 

We can define configuration options of the experiment using a `Config` dataclass:

```python
from dataclasses import dataclass
from machinable import Experiment

class EstimateGravity(Experiment):
  """An experiment to estimate gravity"""

  @dataclass
  class Config:
      height: float = 52
      time: float = 0.3

  def on_execute(self):
      g = 2 * self.config.height / self.config.time ** 2
      print("The gravity on the exoplanet is: ", g)
```

The parameter become available under `self.config` and can be accessed with object-notation (`self.config.my.value`) or dict-style access (`self.config['my']['value']`).

The `Config` dataclass allows for many advanced features such as validation, parameter documentation, computed values and much more.


## Verify your implementation

Let's test the implementation. 

```python
>>> from machinable import Experiment
>>> gravity = Experiment.instance('estimate_gravity')
Experiment [8wqSsj]
>>> gravity.config.height
52
```
