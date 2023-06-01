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
>>> mnist.is_finished()
True
```

By design, component instances can only be executed once. They are automatically assigned a timestamp, random seed, as well as a nickname for easy identification.

```python
>>> mnist.seed
1632827863
```

Invocations of `launch()` after successful execution, do not trigger another execution since the component is marked as cached. On the other hand, if the execution failed, calling `launch()` will resume the execution with the same configuration.


## Implementing custom execution

Components can be executed in different ways. You may, for example, like to run components using multiprocessing or execute in a cloud environment. However, instead of adding the execution logic directly to your component code, machinable makes it easy to separate concerns. You can encapsulate the execution implementation in its own execution class that can then be used to execute the component. 

To implement an execution, implement an interface that inherits from the <Pydoc>machinable.Execution</Pydoc> base class, for example:

::: code-group

```python [multiprocess.py]
from multiprocessing import Pool

from machinable import Execution


class Multiprocess(Execution):
    Config = {"processes": 1}

    def __call__(self):
        pool = Pool(processes=self.config.processes, maxtasksperchild=1)
        try:
            pool.imap_unordered(
                lambda component: component.dispatch(),
                self.pending_executables,
            )
            pool.close()
            pool.join()
        finally:
            pool.terminate()
```

:::

Much like a component, the execution class implements multiprocessing of the given `self.pending_executables` by dispatching them within a subprocess (`component.dispatch()`). 

As usual, we can instantiate this execution using the module convention:
```python
from machinable import get

multiprocess = get("multiprocess", {'processes': 2})
```

Then, to use it, we can wrap the launch in the execution context:

```python
with multiprocessing:
    mnist.launch()
```

Check out the [execution examples](../examples/) that include generally useful implementations you may like to use in your projects.


## Using the CLI

Components can be launched directly from the command-line. The CLI works out of the box and closely mirrors the Python interface. To run a component, type its module name and method name, optionally followed by the configuration options, for example:
```bash
machinable mnist_data batch_size=4 --launch
```
To use multiprocessing, you may type:
```bash
machinable mnist_data batch_size=4 \
  multiprocess processes=4 --launch
```



