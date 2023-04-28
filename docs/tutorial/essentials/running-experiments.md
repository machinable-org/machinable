# Running components

## Executing components

Once implemented and configured, components can be executed by calling <Pydoc caption="launch()">machinable.Component.launch</Pydoc>:

```python
>>> from machinable import get
>>> component = get('estimate_gravity')
>>> component.launch()
Assuming height of 52 and time of 0.3
The gravity on the exoplanet is:  1155.5555555555557
```

If the execution is successful, the component is marked as finished.

```python
>>> component.is_finished()
True
```

By design, component instances can only be executed once. They are automatically assigned a unique component ID, a random seed, as well as a timestamp for easy identification.

```python
>>> gravity = get('estimate_gravity')
>>> gravity.id
'GDCN4d'
>>> gravity.timestamp
1673648406
>>> gravity.seed
1632827863
```

Invocations of `launch()` after successful execution, do not trigger another execution since the component is already finished. On the other hand, if the execution failed, calling `launch()` will resume the execution with the same configuration.

To replicate or reproduce an component, create a new component instance with the same configuration. Learn more about [continuing and repeating components](../elements-in-depth/components.md#derivation).

## Implementing custom execution

Components can be executed in different ways. You may, for example, like to run components using multiprocessing or execute on a cloud environment. However, instead of adding the execution logic directly to your component code, machinable makes it easy to separate concerns. You can encapsulate the execution implementation in its own execution class that can then be used to execute the component. 

To implement an execution, create a module with a class that inherits from the <Pydoc>machinable.Execution</Pydoc> base class, for example:

::: code-group

<<< @/snippets/examples/execution/multiprocess.py

:::

Much like in the case of components, the execution class provides a `Config` dataclass and implements the `on_dispatch` event that handles the execution of the given `self.components` by calling them within a subprocess (`component()`). 

Like before, we can instantiate this execution using the module convention:
```python
from machinable import get

multiprocessing = get("multiprocess_execution", {'processes': 2})
```

Then, to use it, we can wrap the launch in the execution context:

```python
with multiprocessing:
    component.launch()
```

Check out the [execution guide](../elements-in-depth/execution.md) to learn more about executions. You may also be interested in the [execution examples](../../examples/execution.md) that you may like to use in your projects.


## Using the CLI

machinable provides a powerful CLI out of the box that closely mirrors the Python interface. To run an component, type its module name and method name, optionally followed by the configuration options, for example:
```bash
machinable estimate_gravity time_dilation=1.5 --launch
```
To use multiprocessing, you can type:
```bash
machinable estimate_gravity time_dilation=1.5 \
  multiprocess_execution processes=4 --launch
```
To learn more refer to the [CLI guide](../extra-topics/cli.md).
