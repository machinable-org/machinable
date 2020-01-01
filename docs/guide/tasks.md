# Tasks

While components encapsulate functionality using life cycle events, tasks specify their execution. The event paradigm of the component enables a powerful abstraction since we can compose arbitrary schedules for triggering the component life cycles. To make this more concrete, consider the following simple example:

<<< @/.vuepress/includes/getting_started/tasks/example.py{4}

The task definition can be read as *Import component 'optimization' and repeat its execution in three independent trials*. Note that the task object does not trigger the execution but merely describes the execution plan and is then triggered using the ``execute`` method. Crucially, machinable can take care of the intricacies of the execution based on this high-level description, i.e. import and construction of the component and trigger of its event life cycle. The engine can also keep track of the used configuration, generate seeds for controlled randomness and prepare a unique storage path to keep results. Since the execution details are abstracted away, it does not matter whether you run on a local computer or a distributed remote cluster. The engine comes with native support for distributed remote execution based on [Ray](https://ray.readthedocs.io/en/latest/) as well as support for remote file systems like S3 storage.


## Adjusting configuration

Crucially, the task interface allows to adjust configuration in a clear and systematic way. It eliminates global for-loops or manual re-runs of python scripts with different command-line parameters.

To execute a component with adjusted configuration you can use the `version` parameter. The following example changes the dataset and adjusts the default learning rate that has been specified in the `machinable.yaml`.

```python
ml.Task().component('optimization', version={'dataset': 'mnist', 'learning_rate': 0.5})
```

To compare two different learning rates, you could declare the following task:

```python
ml.Task(name='learning_rates').component('optimization', {'learning_rate': 0.1})\
                              .component('optimization', {'learning_rate': 0.01})
```

The task will execute every component, i.e. `optimization` with `lr=0.1` and `optimization` with `lr=0.01`. Alternatively, the iteration can be expressed by passing a list of versions:

```python
ml.Task().component('optimization', [{'learning_rate': lr} for lr in (0.1, 0.01)])
```

Note that the argument must be a list `[]` and not a tuple `()`. Tuples are being interpreted as merge operator and merge the containing elements together:

```python
ml.Task().component('optimization', ({'a': 1}, {'a': 2, 'b': 3}))
# is equivalent to
ml.Task().component('optimization', {'a': 2, 'b': 3})
```

It is also possible to pass configuration as YAML:

<<< @/.vuepress/includes/tasks/yaml_inline_version.py

However, rather than dealing with python variables, it is more suitable to define version directly in the [machinable.yaml](./machinable-yaml.md#versions). To define a version, specify the configuration difference under a key that starts with `~`.

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

The version can used in the task using its name `~<version-name>`, for instance:

```python
task = ml.Task().component('optimization', '~alexnet')
```

It is also possible to reference [mixins configuration](./mixins.md) using
`_<mixin-name>_`:

```python
task = ml.Task().component('optimization', '_imagenet_')
```

Versioning allows you to manage complex configuration patterns in a flexible way. For example, to quickly compose component configuration, you may use the merge operator `()`:

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

For more details of the Task API and versioning refer to the [task reference](../reference/execution.md#task).

## Execution

machinable tasks can be executed using the `machinble.execute()` command. Each execution retrieves a unique 6-digit execution id (e.g. `OY1p1o`) that encodes the global random seed and relative storage location.

## Storage

By default, the storage is non-permanent system memory which is useful during development. To keep your results, make sure to pass in a [filesystem
url](https://docs.pyfilesystem.org/en/latest/openers.html) to the `storage` parameter.

``` python
import machinable as ml
ml.execute(..., storage='~/observations')    # local file system
ml.execute(..., storage='s3://bucket')       # s3 storage
```

## Code backups

machinable automatically backups the code base at execution time in a zip file that can be used to reproduce the results. Note that the project directory needs to be under Git-version control to determine which files are included and ignored during the backup (.gitignore file). To disable code backups, set `storage` to `{'code_backup': False 'storage': 's3://bucket'}`.

## Randomness and reproducibility

machinable chooses and sets a global random seed automatically at execution time. However, you can determine the used seed with the `seed` parameter by passing in a number or an execution id:

``` python
ml.execute(ml.Task().component('controlled_randomness'), seed=42)
```

To re-use the seed of a given task id and reproduce the execution results, you can pass the execution id as seed:

```python 
ml.execute(ml.Task().component('controlled_randomness'), seed='OY1p1o')
```

If you need more control over randomness and how packages are being seeded, you can overwrite the `on_seeding` event in your component class.

## Development mode

You can set the environment variable `MACHINABLE_MODE` to ``DEV`` to enable a development mode. In development mode, machinable will not conduct code backups and storage will not be persistent.


