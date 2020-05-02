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

<<< @/docs/.vuepress/includes/getting_started/experiments/optimization.py

Note that it does not matter how you name the class as long as the class inherits from the components base class and is registered in the ``machinable.yaml``, for instance: 

<Annotated name="optimization" :debug="false">
```yaml
components:
 - optimization: 
     learning_rate: 0.1
```
</Annotated>

The components base provides a variety of interfaces that bootstrap the implementation of the components and are described below.


## Life cycle

Components expose a number of life cycle events that can be overwritten to hook into the execution cycle at a certain point. All event methods start with `on_` and are documented in the [event reference](../reference/component.md#on-after-create). In the example above, the ``on_create`` and ``on_execute`` events are implemented and will thus be triggered during execution.

The components life cycle allows you to implement using any framework and standard python methods without worrying about the execution logic (i.e. configuration parsing, parallel execution, etc.). Moreover, the event paradigm provides a clear semantic while the object orientation enables flexible code sharing mechanisms (e.g. inheritance, [mixins](./mixins.md), etc.).

## self.config

Components can consume their configuration via the `self.config` object:

<<< @/docs/.vuepress/includes/machinable_yaml/path/to_module.py

    >>> 1
        2
        2

For convenience, the dict interface can be accessed using the `.` object notation and provides a few helper methods like pretty-printing ``pprint`` etc.

## self.flags

Flags are configuration values that are associated with the particular execution, for example the random seeds or worker ids. They are accessible via the `self.flags` object, that supports the `.` object notation. You can add your own flags through basic assignment, e.g. ``self.flags.counter = 1``. To avoid name collision, all native machinable flags use UPPERCASE (e.g. ``self.flags.SEED``).

## self.store

The observer interface `self.store` allows for the storing of data and results of the components. Note that you don't have to specify where the observer data is being stored. You can specify the store location before the execution and machinable will manage unique directories automatically. The data can later be retrieved using the [Observations](./observations.md) interface.

**Log**

`self.store.log` or `self.log` provides a standard logger interface that outputs to the console and a log file.

``` python
self.log.info('Component created')
self.log.debug('Component initialized')
```

**Records**

`self.store.record` or `self.record` provides an interface for tabular logging, that is, storing recurring data points at each iteration. The results become available as a table where each row represents each iteration.

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

Sometimes it is useful to have multiple tabular loggers, for example to record training and validation performance separately. You can create custom record loggers using `self.store.get_record_writer(scope)` which returns a new instance of a record writer that you can use just like the main record writer.

**Store**

You can use `self.store.write()` to write any other Python object, for example:

```python
self.store.write('final_accuracy', [0.85, 0.92])
```
Note that to protect unintended data loss, overwriting will fail unless the ``overwrite`` argument is explicitly set. 

For larger data structures, it can be more suitable to write data in specific file formats by appending a file extension, i.e.:

``` python
self.store.write('data.txt', 'a string')
self.store.write('data.p', generic_object)
self.store.write('data.json', jsonable_object)
self.store.write('data.npy', numpy_array)
```

Refer to the observer [reference](./components.md#observer) for more details.

## Config methods

While config references allow you to make static references, configuration values can be more complex. They might, for example, evolve during the course of execution or obey non-trivial conditions. Config methods allow you to implement such complex configuration values. To define a config method just add a regular Python method to the components class. The method name must start with `config_`. You can then 'call' the method directly in the ``machinable.yaml`` configuration, for example:

<<< @/docs/.vuepress/includes/machinable_yaml/machinable_methods.yaml

Here, the learning rate parameter is defined as a config method that takes a base learning rate parameter. The config method `config_learning_rate` needs to be defined in the corresponding components:

<<< @/docs/.vuepress/includes/machinable_yaml/my_models/base_model.py

The method is executed whenever `self.config.learning_rate` is being accessed; as a result, the execution output prints:
```
0 0
1 0.01
2 0.02
3 0.03
4 0.04
```

Config methods hence allow for the expression of arbitrary configuration dependencies and are a powerful tool for implementing complex configuration patterns more efficiently. They can also be useful for parsing configuration values into Python objects. For instance, you might define a config method `dtype` where `dtype: dtype('f32')` returns `np.float32` etc.

## Child components

In many cases, it can be useful to organise components in a hierarchical way. For example, your components may implement a certain prediction problem and you want to encapsulate different prediction strategies in sub-components. 

machinable allows you to use components as ``child`` components, meaning they become available to a parent ``node`` components. Consider the following components:

```python
# child_component_example.py

from machinable import Component

class PredictionStrategy(Component):
    
    def on_create(self):
        self.model = ... # set up some model
    
    def predict(self, data):
        return self.model.predict(data)
```
```python
# node_component_example.py

from machinable import Component

class PredictionBenchmark(Component):

    def on_create(self, prediction_strategy):
        self.prediction_strategy = prediction_strategy

        # load data
        self.data = ...

        print(self.prediction_strategy.predict(self.data))
```

Here, the child components encapsulates the model while the node components implements the benchmark control flow. The child components becomes available as argument to the ``on_create`` event of the node components. 

In general, the child components can access the parent node via ``self.node`` while the node components can access its child components via ``self.components``.

To designate components as child use the ``components`` argument of [Experiment.components()](./tasks.md) that will be discussed in the following section.