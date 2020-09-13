# Experiments

The experiment interface allows for dynamic configuration adjustments in a clear and systematic way. It eliminates global for-loops or manual re-runs of python scripts with different command-line parameters.

## Defining experiments

An experiment entails an arbitrary amount of components that can be added using the ``component`` method which specifies the component name as defined in the ``machinable.yaml``.

```python
Experiment().component('A').component('B').component('C')
```

::: tip
Note that all experiment methods can be chained, e.g. ``Experiment().component('B').repeat(5)``.
:::

### Combining, repeating and splitting

The components can be proliferated using the ``repeat()`` functionality, for example:
```python
Experiment().component('A').repeat(3)
# -> [A], [A], [A]
``` 
Note that a repeat includes every components of the task and that it can be used recursively:
```python
Experiment().component('A').component('B').repeat(2)
# -> [A, B], [A, B]
Experiment().component('A').component('B').repeat(2).repeat(2)
# -> [[A, B], [A, B]], [[A, B], [A, B]]
```
machinable will inject the flags ``REPEAT_NUMBER`` and ``REPEAT_TOTAL`` into each of the components accordingly. By default, the repeats are independent meaning machinable will inject a different ``SEED`` flag for each of the repeated components.

Another form of repetition is induced by the ``split()`` method that injects ``SPLIT_SEED``, ``SPLIT_NUMBER`` and ``SPLIT_TOTAL`` flags into the components. Using the flag information, you can implement customized splitting operations. For example, to implement a cross-validation algorithm the components can split the dataset using the ``SPLIT_SEED`` and use the split that is specified by the ``SPLIT_NUMBER`` for training. As a result, the split components will conduct a k-fold cross-validation.

## Adjusting configuration

A key feature of Experiments is the programmatic adjustment of configuration; you can use experiments to capture a specific execution of components with a particular configuration -- an experiment as-they-say.

In the simplest case, you can use a dictionary to override the default component configuration as defined in the ``machinable.yaml``.

```yaml
components:
  - optimization:
      learning_rate: 0.001
      data:
        name: cifar10
        augmentation: False
      ~mnist:
        data:
          name: mnist
      ~alexnet:
        learning_rate: 0.1
        data:
          name: imagenet
```

```python
Experiment().component('optimization', {'dataset': 'mnist', 'learning_rate': 0.5})
```

### Versions

Since dictionaries can be cumbersome, it is possible to pass configuration patches directly as YAML:

```python
Experiment().component("optimization", """
learning_rate: 0.1
data:
  name: mnist
""")

# is equivalent to:

Experiment().component("optimization", {
    "learning_rate": 0.1, 
    "data": {"name": "mnist"}
})
```

However, rather retrieving YAML from variables, it is more suitable to define the versions directly in the [machinable.yaml](./machinable-yaml.md#versions). To define a version, specify the configuration difference under a key that starts with `~`, for instance:
```yaml
~alexnet:
  learning_rate: 0.1
  data:
    name: imagenet
```

The version can then be accessed using its key name `~<version-name>`, for example:

```python
Experiment().component('optimization', '~alexnet')
# is equivalent to 
Experiment().component('optimization', {
  'learning_rate': 0.1, 
  'data': {'name': 'imagenet'}
})
```

It is also possible to reference [mixins configuration](./mixins.md) using
`_<mixin-name>_`:

```python
Experiment().component('optimization', '_imagenet_')
```

You can merge and iterate over configuration adjustments using tuples and lists. 

#### Merging

Tuples are interpreted as a merge operators that merge the containing elements together. Consider the following example:

```python
Experiment().component('optimization', ({'a': 1}, {'a': 2, 'b': 3}))
# is equivalent to                     ^ - merge operation ------ ^
Experiment().component('optimization', {'a': 2, 'b': 3})
```

#### Iterating

To compare two different learning rates, you could declare the following experiment:

```python
Experiment().component('optimization', {'learning_rate': 0.1})\
            .component('optimization', {'learning_rate': 0.5})
```

Since the experiment will execute every components with their adjusted configuration, the `optimization` will proceed with a learning rate of `0.1` and `0.5`. To express these types of iterations more effectively, you can use lists to induce the same repetition as above:

```python
Experiment().component('optimization', [{'learning_rate': lr} for lr in (0.1, 0.5)])
#                                      ^ -- list of patches induces a repeat ---- ^
```

#### Combinations

Taking these concepts together, experiments allow you to manage complex configuration adjustments in a flexible way. Consider the following example:

```python
Experiment().component('optimization', ('~alexnet', '~mnist', {'learning_rate': 0.5}))
```

This would result in the following components configuration:
```yaml
learning_rate: 0.5
network: alexnet
data:
    name: mnist
```

Can you work out what the following experiment entails?

```python
Experiment().component('optimization', [
   (
    '~mnist', 
    {'network': 'resnet', 'learning_rate': lr * 0.01 + 0.1}
   ) 
   for lr in range(10)
]).repeat(2)
```

### Other component options

In summary, the `Experiment.component()` method has the following signature:
```python
(
 name,       # components name, see above
 version,    # configuration adjustment, see above
 checkpoint, # see below
 flags       # see below
)
``` 

#### Checkpoints

If the checkpoint option is specified, machinable will trigger the components's ``on_restore`` event with the given filepath. This allows for restoring components from previously saved checkpoints

#### Flags

In addition to the default execution flags, you can use the flags parameter to extend the ``flags`` dictionary of the components.   

### Sub-components

You can organise components in a [hierarchical way](./components.md#sub-components) using the ``components()`` method which allows to add one or a list of many [sub-components]. You can specify the sub-components with the same arguments of the `component()` method, for example:

```python
Experiment.components(('alexnet', {'lr': 0.1}), [('imagenet_component', {'augmentation': True})])
```


For a comprehensive description of the Experiment API, consult the [reference](../reference/execution.md#experiment).

## Hyperparameter tuning

While Experiments allow for simple configuration iteration, complex hyperparameter tuning is supported through [Ray tune](https://ray.readthedocs.io/en/latest/tune.html) using the `tune()` method of the Experiment object:

```python
import numpy as np

import machinable as ml

random_search = (
    ml.Experiment()
    .component("optimization")
    .tune(
        stop={"episodes_total": 50},
        num_samples=50,
        config={
            "stepsize": lambda spec: np.random.uniform(1e-6, 0.1),
            "noise_std": lambda spec: np.random.uniform(1e-6, 0.1),
            "l2coeff": lambda spec: np.random.uniform(1e-6, 0.1),
        },
    )
)

grid_search = (
    ml.Experiment()
    .component("optimization")
    .tune(
        stop={"accurary": 80},
        num_samples=100,
        config={"learning_rate": {"grid_search": [0.1, 0.05, 0.01]}},
    )
)

```

Please refer to [Ray's project documentation](https://ray.readthedocs.io/en/latest/tune.html) to learn more about available options.
