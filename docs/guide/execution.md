# Execution

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
