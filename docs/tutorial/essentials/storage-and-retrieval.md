---
next: "Continue with the tutorial"
---

# Storage and retrieval

When you execute components, information like the used configuration, the used random seed, etc. are automatically captured and stored. 

One of the fundamental ideas in the design of machinable's storage is that it allows to retrieve results through the same abstraction that was used to create them. What does this look like for an component? Consider the example component that computes a gravity estimation of an exoplanet.

```python
from machinable import get

gravity = get('estimate_gravity', {'time_dilation': 2.0})
```

Here, <Pydoc caption="get()">machinable.get</Pydoc> will automatically search the storage for an component of type `estimate_gravity` with a `time_dilation` of `2.0`. If `estimate_gravity` has not been executed with this exact configuration, a new instance of the component with `time_dilation=2.0` is returned instead. This means that we can easily retrieve components with the same command we initially used to execute them. Consider the following example:

```python
from machinable import get

gravity = get('estimate_gravity', {'time_dilation': 0.5})

if not gravity.is_finished():
  print("An component with this configuration was not found")
else:
  print(f"The gravity for a time dilation of 0.5 is {gravity.result}")
```

By default, the component data is stored in a local folder at `./storage/{id}` (e.g. `./storage/MHCYZq`).

## Configuring the storage

Just like with components and execution, you can choose the storage implementation and configuration using the module convention:

```python
from machinable import get

storage = get('machinable.storage.filesystem', {
  'directory': './my-storage'
})
```

This will instantiate the <Pydoc>machinable.Storage</Pydoc> implementation that is located in the `machinable.storage.filesystem` module, namely the default storage that writes all data to a local directory.

To use the storage, wrap the relevant code in a with-context:

```python
with storage:
  component.launch()

# or alternatively
storage.__enter__()

component.launch()
```

Components within the context will be written to the specified directory `./my-storage`. You are free to use or implement alternative storage that may upload files to the cloud or into a database.

## Saving and loading data

While machinable automatically stores crucial information about the component, you can use <Pydoc>machinable.Component.save_data</Pydoc> and <Pydoc>machinable.Component.load_data</Pydoc> to easily store and retrieve additional custom data in different file formats:

```python
gravity.save_data('prediction.txt', 'a string')           # text
gravity.save_data('settings.json', {'neurons': [1, 2]})   # jsonable
gravity.save_data('inputs.npy', np.array([1.0, 2.0]))     # numpy
gravity.save_data('results.p', results)                   # pickled

>>> gravity.load_data('prediction.txt')
'a string'
```

### Records

Components also provide an interface for tabular logging, that is, storing recurring data points for different iterations.

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


## Organize using groups

To keep things organized, you can group components that belong together, for example:

```python
from machinable import get

component = get('estimate_gravity')

component.group_as('lab-reports/%Y')

>>> component.group
'Group [lab-reports/2023]'
```

::: tip

When specifying groups, you can use the common [time format codes](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes) like `%Y` for the year provided by [datetime.date.strftime](https://docs.python.org/3/library/datetime.html#datetime.date.strftime).

:::

You may also specify a global default group that will be used if no group is set.

```python
from machinable import get

get(
  'machinable.storage.filesystem',
  {'directory': './my-storage'},
  default_group='lab-reports/%Y'
).__enter__()
```

::: tip Note

The pre-configured default group is `%Y_%U_%a`, e.g. `2022_40_Sun`

:::

## Advanced search

machinable does not determine what interface you may like to use to query and search components. You can implement your custom storage search routines and resort to third-party UIs or libraries that suit your needs. 

To illustrate this, let's leverage the library [PyFunctional](https://github.com/EntilZha/PyFunctional) to search our storage.

```python
>>> from machinable import Storage
>>> storage = Storage.get()
>>> storage
'FilesystemStorage <./storage>'
```

The filesystem storage provides an SQlite database which we can use as a data source:

```python
>>> storage.sqlite_file
'./storage/storage.sqlite'
>>> from functional import seq
>>> from functools import partial
>>> query = partial(seq.sqlite3, storage.sqlite_file)
```

This allows us to run arbitrary SQL queries like retrieving the 3 most recent components:

```python
>>> recent = query("SELECT * FROM components ORDER BY timestamp LIMIT 3").map(lambda x: x[1])
>>> recent
['./storage/oPqe2v', './storage/HGtHQu', './storage/HwVO9l']
```
Once we find what we are looking for we can always convert back to the regular machinable abstractions using `from_storage`:
```python
>>> from machinable import Component
>>> components = recent.map(Component.from_storage).to_list()
>>> components
[Component [oPqe2v], Component [HGtHQu], Component [HwVO9l]]
>>> components[0].finished_at().humanize()
'a month ago'
```
Overall, this should allow for a seamless conversion and integration of your preferred component management tools.

::: info :student: 

This concludes the overview of the most essential features. You can refer back to individual chapters at any time or continue with the [advanced tutorial sections](../elements-in-depth/overview.md), the [API reference](../../reference/index.md) and the [examples](../../examples/overview.md).

:::
