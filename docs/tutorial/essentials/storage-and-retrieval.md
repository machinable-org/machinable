---
next: "Continue with the tutorial"
---

# Storage and retrieval

When you execute experiments, information like the used configuration, the used random seed, etc. are automatically captured and stored. By default, the data is stored in a local folder at `./storage/%Y_%U_%a/{experiment_id}` (e.g. `./storage/2022_40_Sun/MHCYZq`).

## Configuring the storage

Just like with experiments and execution, you can choose the storage implementation and configuration using the module convention:

```python
from machinable import get

storage = get('machinable.storage.filesystem', {
  'directory': './my-storage'
})
```

This will instantiate the <Pydoc>machinable.Storage</Pydoc> implementation that is located in the `machinable.storage.filesystem` module.

To use the storage, wrap the relevant code in a with-context:

```python
with storage:
  experiment.launch()

# or alternatively
storage.__enter__()

experiment.launch()
```

Experiments within the context will be written to the specified directory.

## Organize using groups

To keep things organized, you can group experiments that belong together, for example:

```python
from machinable import get

gravity = get('estimate_gravity')

gravity.group_as('%Y/lab-reports')

gravity.launch()

print(gravity.local_directory())
```

`./storage/2022/lab-reports-tjMFXt`

::: tip

When specifying groups, you can use the common [time format codes](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes) like `%Y` for the year provided by [datetime.date.strftime](https://docs.python.org/3/library/datetime.html#datetime.date.strftime).

:::

You may also specify a global default group that will be used if no group is set.

```python
from machinable import get

get(
  'machinable.storage.filesystem',
  {'directory': './my-storage'},
  default_group='%Y/lab-reports'
).__enter__()
```

::: tip Note

The pre-configured default group is `%Y_%U_%a`, e.g. `2022_40_Sun`

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
</tbody>
</table>


## Retrieving experiments

One of the fundamental ideas in the design of machinable's storage is that it allows to retrieve results through the same abstraction that was used to create them. What does this look like for an experiment? Consider the example experiment that computes a gravity estimation of an exoplanet.

```python
from machinable import get

gravity = get('estimate_gravity', {'time_dilation': 2.0})
```

Notably, <Pydoc caption="get()">machinable.get</Pydoc> will automatically search the storage for an experiment of type `estimate_gravity` with a `time_dilation` of `2.0`. If `estimate_gravity` has not been executed with this exact configuration, a new instance of the experiment with `time_dilation=2.0` is returned instead. This means that we can easily retrieve experiments with the same command we initially used to execute them. Consider the following example:

```python
from machinable import get

gravity = get('estimate_gravity', {'time_dilation': 0.5})

if not gravity.is_finished():
  print("An experiment with this configuration was not found")
else:
  print(f"The gravity for a time dilation of 0.5 is {gravity.result}")
```

This concludes the overview of essential features. You can refer back to individual chapters at any time or continue with the [advanced tutorial sections](../elements-in-depth/overview.md), the [API reference](../../reference/index.md) and the [examples](../../examples/overview.md).
