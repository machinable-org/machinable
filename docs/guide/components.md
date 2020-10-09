---
annotations: {
    optimization: [
        {
          x: 42, 
          y: 40, 
          width: 110,
          height: 25, 
          value: "
          machinable will search for the components class in the specified module 'optimization.py'
          "
        },
        {
          x: 42, 
          y: 65, 
          width: 200,
          height: 25, 
          value: "
          The components is automatically constructed and the corresponding configuration will be injected
          "
        }
    ]
}
---

# Components

Components are the core interface to implement functionality in a machinable project. Technically, they are simply classes that inherit from the base class ``machinable.Component`` as defined in the python module that is specified in the
`machinable.yaml`. For instance, to implement a components that encapsulates some optimization problem, we could create the following source file:

```python
# optimization.py
from machinable import Component

class DummyOptimization(Component):
    def on_create(self):
        print(
            "Creating the optimization model with the following configuration: ",
            self.config,
        )

    def on_execute(self):
        for i in range(3):
            print("Training step", i)
```

Note that it does not matter how you name the class as long as the class inherits from the components base class and is registered in the ``machinable.yaml``, for instance: 

<Annotated name="optimization" :debug="false">
```yaml
components:
 - optimization: 
     learning_rate: 0.1
```
</Annotated>

## Execution

The key idea of a component is to encapsulate an executable unit of your code. It is useful to think of them as 'functions' that you can call with different configuration arguments. In fact, executing a component is not very different from a standard function call:

```python
from machinable import execute
execute("optimization")
```

Component [execution](execution.md) will be covered in greater detail later, but at this point, it is useful to think of it as a function call that provides arguments (i.e. the configuration, a random seed, a directory to store results etc.) and that triggers the component code. 
The Component class can thus be seen as providing a variety of interfaces that bootstrap the implementation of the 'component function' for given arguments.


## Life cycle

Components expose a number of life cycle events that can be overwritten to hook into the execution 'function call' at a certain point. All event methods start with `on_` and are documented in the [event reference](../reference/component.md). In the example above, the ``on_create`` and ``on_execute`` events are implemented and will thus be triggered during execution.

The components life cycle allows you to implement using any framework and standard python methods without worrying about the execution logic (i.e. configuration parsing, parallel execution, etc.). Moreover, the event paradigm provides a clear semantic while the object orientation enables flexible code sharing mechanisms (e.g. inheritance, [mixins](./mixins.md), etc.).

## self.config

Components can consume their configuration via the `self.config` object:

```python
from machinable import Component

class MyComponent(Component):
    def on_create(self):
        print(self.config.config_value)
        print(self.config.nested.value)
        print(self.config["nested"]["value"])

```

    >>> 1
        2
        2

For convenience, the dict interface can be accessed using the `.` object notation and provides a few helper methods like pretty-printing ``pprint`` etc.

## self.flags

Flags are configuration values that are associated with the particular execution, for example the random seeds or worker IDs. They are accessible via the `self.flags` object, that supports the `.` object notation. You can add your own flags through basic assignment, e.g. ``self.flags.counter = 1``. To avoid name collision, all native machinable flags use UPPERCASE (e.g. ``self.flags.SEED``).

## self.storage

`self.storage` provides access to the storage directory of the component (each component directy name is unique and managed automatically so you don't have to specify where the data is being stored). The data can later be retrieved using the [storage interfaces](./storage.md).

**Log**

`self.storage.log` or `self.log` provides a standard logger interface that outputs to the console and a log file.

``` python
self.log.info('Component created')
self.log.debug('Component initialized')
```

**Records**

`self.storage.record` or `self.record` provides an interface for tabular logging, that is, storing recurring data points at each iteration. The results become available as a table where each row represents each iteration.

``` python
for iteration in range(10):
    self.record['iteration'] = iteration
    loss, acc = ...
    # write column values
    self.record['accuracy'] = acc
    self.record['loss'] = loss

    # save at the end of the iteration to start a new row
    self.record.save()
```

If you use the `on_execute_iteration` event, iteration information and `record.save()` will be triggered automatically at the end of each iteration.

Sometimes it is useful to have multiple tabular loggers, for example to record training and validation performance separately. You can create custom record loggers using `self.storage.get_record_writer(scope)` which returns a new instance of a record writer that you can use just like the main record writer.

**Custom data**

Any other data can be stored in the `data/` subdirectory. 

You can use `self.storage.write_data()` to write any other Python object, for example:

``` python
self.storage.save_data('data.txt', 'a string')
self.storage.save_data('data.p', generic_object)
self.storage.save_data('data.json', jsonable_object)
self.storage.save_data('data.npy', numpy_array)
```

To protect against unintended data loss, you can set `overwrite=False`.

## Config methods

While config references allow you to make static references, configuration values can be more complex. They might, for example, evolve during the course of execution or obey non-trivial conditions. Config methods allow you to implement such complex configuration values. To define a config method just add a regular Python method to the components class. The method name must start with `config_`. You can then 'call' the method directly in the ``machinable.yaml`` configuration, for example:

```yaml
components:
  - my_network:
      batch_size: 32
      learning_rate: base_learning_rate(2**-5)
```

Here, the learning rate parameter is defined as a config method that takes a base learning rate parameter. The config method `config_base_learning_rate` needs to be defined in the corresponding component:

```python
from machinable import Component

class MyBaseModel(Component):
    def on_create(self):
        print('Training with lr=', self.config.learning_rate)

    def config_base_learning_rate(self, lr):
        return lr * self.config.batch_size
```

The method is executed whenever `self.config.learning_rate` is being accessed; as a result, the execution output prints:

    >>> 'Training with lr=1'

Config methods hence allow for the expression of arbitrary configuration dependencies and are a powerful tool for implementing complex configuration patterns more efficiently. They can also be useful for parsing configuration values into Python objects. For instance, you might define a config method `dtype` where `dtype: dtype('f32')` returns `np.float32` etc.

## Composition

Components can be composed together to form new components. Learn more about [Reusability & Composition](composition.md) of components.