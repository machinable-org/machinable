# Storage and retrieval

When you execute experiments, information like the used configuration, the used random seed, etc. are automatically captured and stored. By default, the data is stored in a local folder at `./storage/%Y_%U_%a/{experiment_id}` (e.g. `./storage/2022_40_Sun/MHCYZq`).

## Configuring the storage

Just like with experiments and execution, you can choose the storage implementation and configuration using the module convention:

```python
from machinable import Storage

storage = Storage.instance('machinable.storage.filesystem', {
  'directory': './my-storage'
})
```

This will instantiate the <Pydoc>machinable.Storage</Pydoc> implementation located in the `machinable.storage.filesystem` module.

To use the storage, call the `connect()` method:

```python
storage.connect()
```

Experiments will now be written to the specified directory.

## Organize using groups

To keep things organized, you can group experiments that belong together, for example:

```python
from machinable import Experiment

gravity = Experiment.instance('estimate_gravity')

gravity.group_as('%Y/lab-reports')

gravity.execute()

print(gravity.local_directory())
```

`./storage/2022/lab-reports-tjMFXt`

::: tip

When specifying groups, you can use the common [time format codes](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes) like `%Y` for the year provided by [datetime.date.strftime](https://docs.python.org/3/library/datetime.html#datetime.date.strftime).

:::

You may also specify a global default group that will be used if no group is set.

```python
from machinable import Storage

Storage.instance(
  'machinable.storage.filesystem',
  {'directory': './my-storage'},
  default_group='%Y/lab-reports'
).connect()
```

::: tip Note

The preconfigured default group is `%Y_%U_%a`, e.g. `2022_40_Sun`

:::

## Saving and loading data

While machinable automatically stores crucial information about the experiment, you can use <Pydoc>machinable.Experiment.save_data</Pydoc> and <Pydoc>machinable.Experiment.load_data</Pydoc> to easily store and retrieve additional custom data in different file formats:

```python
gravity.save_data('prediction.txt', 'a string')           # text
gravity.save_data('settings.json', {'neurons': [1, 2]})   # jsonable
gravity.save_data('inputs.npy', np.array([1.0, 2.0]))     # numpy
gravity.save_data('results.p', results)                   # pickled

>>> gravity.load_data('prediction.txt')
'a string'
```

### Records

Experiments also provide an interface for tabular logging, that is, storing recurring data points for different iterations.

```python
record = gravity.record()

for iteration in range(3):
    record['iteration'] = iteration
    record['accuracy'] = 0.1
    # save at the end of the iteration to start a new row
    record.save()
```

The results become available as a table where each row represents an iteration.

```
>>> gravity.records().as_table()
```

<table>
<tbody>
<tr><td>2022-10-07T23:05:46.942295-05:00</td><td style="text-align: right;">0.1</td><td style="text-align: right;">0</td></tr>
<tr><td>2022-10-07T23:05:46.944064-05:00</td><td style="text-align: right;">0.1</td><td style="text-align: right;">1</td></tr>
<tr><td>2022-10-07T23:05:46.946012-05:00</td><td style="text-align: right;">0.1</td><td style="text-align: right;">2</td></tr>
<tr><td>2022-10-07T23:05:46.947686-05:00</td><td style="text-align: right;">0.1</td><td style="text-align: right;">3</td></tr>
</tbody>
</table>

## Retriving experiments

You can retrieve previously executed experiments from the connected storage using their unique experiment ID, for example:

```python
>>> from machinable import Experiment
>>> experiment = Experiment.find('tjMFXt')
>>> experiment.finished_at().humanize()
'21 minutes ago'
```

## Singletons

Alternatively, and perhaps more importantly, you can look up experiments in a way that mirrors their original instantiation using <Pydoc>machinable.Experiment.singleton</Pydoc>.

```python
from machinable import Experiment

gravity = Experiment.singleton('estimate_gravity', {'time_dilation': 2.0})
```

<Pydoc caption="singleton()">machinable.Experiment.singleton</Pydoc> will search and return an experiment of type `estimate_gravity` with a `time_dilation` of `2.0`. If `estimate_gravity` has not been executed with that exact configuration, a new instance of the experiment with `time_dilation=2.0` is returned instead.

This feature is crucially important for machinable's [unified representation](./unified-representation.md) which we will discuss next.
