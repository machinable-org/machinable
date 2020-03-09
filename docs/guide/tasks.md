# Tasks

While components encapsulate functionality using life cycle events, tasks specify their execution. The event paradigm of the component enables a powerful abstraction since we can compose arbitrary schedules for triggering the component life cycles. To make this more concrete, consider the following simple example:

<<< @/docs/.vuepress/includes/getting_started/tasks/example.py{4}

The task definition can be read as *Import component 'optimization' and repeat its execution in three independent trials*. Note that the task object does not trigger the execution but merely describes the execution plan and is then triggered using the ``execute`` method. 

Crucially, machinable can take care of the intricacies of the execution based on this high-level description, i.e. import and construction of the component and trigger of its event life cycle. The engine can also keep track of the used configuration, generate seeds for controlled randomness and prepare a unique storage path to keep results. Since the execution details are abstracted away, it does not matter whether you run on a local computer or a distributed remote cluster. The engine comes with native support for distributed remote execution based on [Ray](https://ray.readthedocs.io/en/latest/) as well as support for remote file systems like S3 storage.

The task interface allows for dynamic configuration adjustments in a clear and systematic way. It eliminates global for-loops or manual re-runs of python scripts with different command-line parameters.

## Defining tasks

A task entails an arbitrary amount of components that can be added using the ``component`` method that specifies the component name as defined in the ``machinable.yaml``.

```python
ml.Task().component('A').component('B').component('C')
```

::: tip
Note that all task methods can be chained, e.g. ``Task().component('B').repeat(5)``.
:::

### Combining, repeating and splitting

The components can be proliferated using the ``repeat()`` functionality, for example:
```python
ml.Task().component('A').repeat(3)
# -> [A], [A], [A]
``` 
Note that a repeat includes every component of the task and that it can be used recursively:
```python
ml.Task().component('A').component('B').repeat(2)
# -> [A, B], [A, B]
ml.Task().component('A').component('B').repeat(2).repeat(2)
# -> [[A, B], [A, B]], [[A, B], [A, B]]
```
machinable will inject the flags ``REPEAT_NUMBER`` and ``REPEAT_TOTAL`` into each of the components accordingly. By default, the repeats are independent meaning machinable will inject a different ``SEED`` flag for each of the repeated component.

Another form of repetition is induced by the ``split()`` method that injects ``SPLIT_SEED``, ``SPLIT_NUMBER`` and ``SPLIT_TOTAL`` flags into the components. Using the flag information, you can implement customized splitting operations. For example, to implement a cross-validation algorithm the component can split the dataset using the ``SPLIT_SEED`` and use the split that is specified by the ``SPLIT_NUMBER`` for training. As a result, the split component will conduct a k-fold cross-validation.

### Adjusting configuration

While configuration values can be manually edited in the ``machinable.yaml``, in practice it is often useful to declare certain configuration adjustments programmatically.

#### Tuples and lists

You can pass a tuple with the component name and a configuration patch to adjust the default configuration of a component. In the following example, a dictionary is used to override the default dataset and learning rate that has been specified in the `machinable.yaml`.

```python
ml.Task().component(('optimization', {'dataset': 'mnist', 'learning_rate': 0.5}))
                  # ( |-component-| , |-- configuration patch ---------------| )
```

More general, tuples are interpreted as a merge operators that merge the containing elements together. Consider the following example:

```python
ml.Task().component(('optimization', ({'a': 1}, {'a': 2, 'b': 3})))
# is equivalent to                   ^ - merge operation ------ ^
ml.Task().component(('optimization', {'a': 2, 'b': 3}))
```

To compare two different learning rates, you could declare the following task:

```python
ml.Task(name='learning_rates').component(('optimization', {'learning_rate': 0.1}))\
                              .component(('optimization', {'learning_rate': 0.01}))
```

Since the task will execute every component with their adjusted configuration, the `optimization` will proceed with a learning rate of `0.1` and `0.01`. To express these types of iterations more effectively, you can use lists to induce the same repetition as above:

```python
ml.Task().component(('optimization', [{'learning_rate': lr} for lr in (0.1, 0.01)]))
#                                    ^ -- list of patches induces a repeat ----- ^
```

#### Versions

Since dictionaries can be cumbersome, it is possible to pass configuration patches directly as YAML:

<<< @/docs/.vuepress/includes/tasks/yaml_inline_version.py

However, rather retrieving YAML from variables, it is more suitable to define the versions directly in the [machinable.yaml](./machinable-yaml.md#versions). To define a version, specify the configuration difference under a key that starts with `~`, for instance:

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

The version can then be accessed using its key name `~<version-name>`, for example:

```python
task = ml.Task().component(('optimization', '~alexnet'))
# is equivalent to 
task = ml.Task().component(('optimization', {'learning_rate': 0.1, 
                                             'data': {'name': 'imagenet'}}))
```

It is also possible to reference [mixins configuration](./mixins.md) using
`_<mixin-name>_`:

```python
task = ml.Task().component(('optimization', '_imagenet_'))
```

Taking these concepts together, task allow you to manage complex configuration adjustments in a flexible way. Consider the following example:

```python
task = ml.Task().component('optimization', 
                           ('~alexnet', '~mnist', {'learning_rate': 0.5}))
```

This would result in the following component configuration:
```yaml
learning_rate: 0.5
network: alexnet
data:
    name: mnist
```

Can you work out what the following task entails?

```python
ml.Task().component(('optimization', [('~mnist', 
                                      {'network': 'renset',
                                      'learning_rate': lr * 0.01 + 0.1}) 
                                      for lr in range(10)])).repeat(2)
```

### Child components

The second argument of the ``component()`` method allows to add one or a list of many [child components](./components.md#child-components). You can specify the child components just like you specify the node component, i.e. using configuration adjustment and repetition via list and tuples as well as versions. 

### Other component options

Components are described using tuples of the following structure: 
```python
(
 name,       # component name, see above
 version,    # configuration adjustment, see above
 checkpoint, # see below
 flags       # see below
)
``` 

#### Checkpoints

If the checkpoint option is specified, machinable will trigger the component's ``on_restore`` event with the given filepath. This allows for restoring components from previously saved checkpoints

#### Flags

In addition to the default execution flags, you can use the flags parameter to extend the ``flags`` dictionary of the component.   

For a comprehensive description of the Task API, consult the [reference](../reference/execution.md#task).

## Executing tasks

To schedule a task for execution, use the [execute()](../reference/execution.md#execute) method. 

```python
task = ml.Task().component('example')
ml.execute(task, storage=None, seed=None)
```

machinable will generate a unique 6-digit task ID (e.g. `OY1p1o`) that will be printed at the beginning of the execution output. The ID encodes the global random seed and is used as a relative directory to store any data generated by the task.

### Storage

By default, the storage is the non-permanent system memory which is useful during development. To keep your results, make sure to pass in a [filesystem url](https://docs.pyfilesystem.org/en/latest/openers.html) to the `storage` parameter.

``` python
import machinable as ml
ml.execute(..., storage='~/observations')    # local file system
ml.execute(..., storage='s3://bucket')       # s3 storage
```

### Drivers

While tasks are executed locally and sequential by default, machinable provides different [Driver](./drivers.md) for parallel and remote execution. For example, to execute components in parallel processes you may use the multiprocessing driver:

``` python
import machinable as ml
ml.execute(..., driver='multiprocessing')
```

To learn more about available drivers and their options, refer to the [Driver](./drivers.md) section.

### Randomness and reproducibility

machinable chooses and sets a global random seed automatically at execution time. You can also determine the seed with the `seed` parameter by passing in a number or an execution ID:

``` python
ml.execute(ml.Task().component('controlled_randomness'), seed=42)
```

To re-use the seed of a given task ID and reproduce the execution results, you can pass the execution id as the seed:

```python 
ml.execute(ml.Task().component('controlled_randomness'), seed='OY1p1o')
```

If you need more control over randomness and how packages are being seeded, you can overwrite the `on_seeding` event in your component class.

### Code backups

machinable automatically backs up the code base at execution time in a zip file that can be used to reproduce the results. Note that the project directory needs to be under Git-version control to determine which files are included and ignored during the backup (``.gitignore`` file). To disable code backups, set `storage` to `{'code_backup': False, 'storage': 's3://bucket'}`.


## Development mode

You can set the environment variable `MACHINABLE_MODE` to ``DEV`` to enable a development mode. In development mode, machinable will not conduct code backups and storage will not be persistent regardless of the specified storage argument.


