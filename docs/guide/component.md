# Component

While interfaces are designed to associate data with code, <Pydoc caption="components">machinable.Component</Pydoc> are the special case that allows for execution. 

Consider the following example where we implement a preprocessing step to download a dataset:

```python
from machinable import Component

class MnistData(Component):
  """A dataset of handwritten characters"""
  Config = {
    "batch_size": 8,
    "name": "mnist"
  }

  def __call__(self):
    self.download_data(self.config.name, self.local_directory())

  def download_data(dataset_name, target_directory):
    print(f"Downloading '{dataset_name}' ...")
    ...
```


## Executing components

Once implemented and configured, components can be executed by calling <Pydoc caption="launch()">machinable.Component.launch</Pydoc>:

```python
>>> from machinable import get
>>> mnist = get('mnist_data', {"batch_size": 4})
>>> mnist.launch()
Downloading 'mnist' ...
```

If the execution is successful, the component is marked as finished.

```python
>>> mnist.execution.is_finished()
True
```

By design, component instances can only be executed once. They are automatically assigned a timestamp, random seed, as well as a nickname for easy identification.

```python
>>> mnist.seed
1632827863
```

Invocations of `launch()` after successful execution, do not trigger another execution since the component is marked as cached. On the other hand, if the execution failed, calling `launch()` will resume the execution with the same configuration.
