---
annotations: {
    results: [
        {
          x: 17, 
          y: 19, 
          width: 110,
          height: 25, 
          value: "
          The storage folder that has been specified during execution
          "
        },
        {
          x: 49, 
          y: 40, 
          width: 85,
          height: 25, 
          value: "
          The unique 6-digit task ID directory
          "
        },
        {
          x: 85, 
          y: 63,
          width: 125,
          height: 25, 
          value: "
          A unique 12-digit component directory that stores all data generated by the execution of one of the experiment's component.
          "
        },
        {
          x: 118, 
          y: 90, 
          width: 160,
          height: 130, 
          value: "
          JSON-encoded configuration, status and system information generated during the execution of the components
          "
        },
        {
          x: 85, 
          y: 242, 
          width: 125,
          height: 50, 
          value: "
          JSON-encoded information of the experiment and its execution status
          "
        }
    ]
}
---

# Submissions

Whenever you execute an experiment, machinable generates a unique 6-digit submission ID (e.g. `9eW1PC`) and creates a new directory of the same name in the specified storage location. This directory is used to write all data that is generated by the submission, including the used configuration, system metrics, status information and results. More specifically, it may look like this:

<Annotated name="results" :debug="false">

    ~/results
    ├── 9eW1PC
    │   ├── U6RTBBqSwK25/
    │   │   ├── component.json
    │   │   ├── components.json
    │   │   ├── host.json
    │   │   ├── log.txt
    │   │   ├── state.json
    │   │   └── data/
    │   ├── ... 
    │   ├── host.json
    │   └── execution.json
    └── ...

</Annotated>

While it is possible to read and navigate the folder manually, machinable provides interfaces for efficient data retrieval. 
One advantage when working with the submission abstraction is that it removes the overhead of thinking about how the data is actually being stored and read from the disk.

::: tip
The submission interface is read-only, meaning it will never modify or remove data generated during the execution.
:::

## Retrieving submissions

To load a submission from a storage location, instantiate the `Submission` interface:

```python
from machinable import Submission
submission = Submission("~/results/9eW1PC")
```

The [Submission](../reference/submission.md#submission) interface provides simplified access to the experimental data.

```python
submission.submission_id
>>> 9eW1PC
submission.started_at
>>> DateTime(2020, 9, 13, 22, 9, 55, 470235, tzinfo=Timezone('+01:00'))
submission.is_finished()
>>> True
```

The interface will cache the data to enable reload-free fast access. If experiments are still running, machinable will reload changing information automatically.

To access the submission components, use `submission.components`. Note that the method returns a [collection](../reference/submission.md#collection) of component objects rather than a single object. 

```python
submission.components
>>> Collection (1) <Storage: SubmissionComponent <d4tSlSA744Di>>
```

The collection interface forms a wrapper for working with the lists and provides a wealth of manipulation operations. For example, we could select the components that have already finished executing: 

```python
submission.components.filter(lambda x: x.is_finished()).first()
```

::: tip
If `pandas` is available, you can turn the collection into a dataframe using the `as_dataframe()` method.
:::

The [collection reference documentation](../reference/submission.md#collection) provides a comprehensive overview of all available options. 

### Searching a directory

You can recursively retrieve all submissions within a directory using the `find_many` method that returns a collection of the found submissions.

```python
from machinable import Submission
Submission.find_many("~/results")
>>> Collection (1) <Storage: Submission <9eW1PC>>
```

### Managing submissions

The discussed submission APIs are fairly minimal when it comes to organisation of your experiments. In particular, they require you to keep track of storage locations. To organise and query many submissions more effectively, you can use [Indexes](./index.md) that provide database-like features covered in the next section.
