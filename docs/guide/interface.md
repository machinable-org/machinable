# Interface

[Elements](./element.md) by themselves are limited in that they are effectively stateless. You can construct and use them but any computed result or additional information will not be persisted. 

To enable storage and retrival we can use an <Pydoc>machinable.Interface</Pydoc> class.

```python
from machinable import Interface

class MnistData(Interface):
  """A dataset of handwritten characters"""
  Config = {
    "batch_size": 8,
    "name": "mnist"
  }
```

Interfaces inherit all the functionality of elements but can be committed and subsequently reloaded:

```python
>>> mnist = MnistData()
>>> mnist.commit()  # persist this particular instance
Interface [29f034]
>>> mnist.local_directory()
'./storage/29f034ad2d1a46b8b71c9b30222b5b88'
>>> Interface.from_directory('./storage/29f034ad2d1a46b8b71c9b30222b5b88')
Interface [29f034] # reloaded interface
```

During commit, machinable collects information like a unique ID (e.g. `29f034`), the used configuration, and other meta-data and saves it in a unique storage (e.g. a local directory) from which it can be reloaded later. 

## get

In practice, however, it may be cumbersome to keep track of long IDs to reload existing interfaces. To avoid this issue, one of the fundamental ideas in the design of machinable is to make retrieval identical to initial instantiation.

Specifically, to instantiate an interface (e.g. `MnistData()`) we can leverage the <Pydoc>machinable.get</Pydoc> function, which takes a class as the first argument and optional constructor arguments.

```python
from machinable import get

mnist = get(MnistData, {"batch_size": 8})
      # -> this is equivalent to: MnistData({"batch_size": 8})
mnist.commit()
```

Now, if we later want to retrieve this instance, we can use the same code in place of a unique ID:

```python
mnist_reloaded = get(MnistData, {"batch_size": 8})

assert mnist == mnist_reloaded
```

What is happening here is that <Pydoc caption="get()">machinable.get</Pydoc> automatically searches the storage for an interface of type `MnistData` with a `batch_size` of `8`. If such an instance has not been committed yet (like when initially running the code), a new instance with this configuration will be returned. But if such an instance has previously been committed, it will simply be reloaded.

## The module convention

As your project grows, the classes that you implement should be moved into their own Python module. You are free to structure your code as you see fit but there is one hard constraint that classes must be placed in their own modules. The project source code may, for instance, be organized like this:

```
example_project/
├─ estimate_gravity.py            # contains a data analysis component
├─ evolution/                   
|  └─ simulate_offspring.py       # contains a evolutionary simulation
└─ main.py                        # main script to execute
```

The benefit of this requirement is that you can refer to the classes via their module import path.
For example, using this *module convention*, you can simplify the instantiation of classes that are located in different modules:

::: code-group

```python [main.py (before)]
from machinable import get

from estimate_gravity import EstimateGravity
from evolution.simulate_offspring import SimulateOffspring

gravity = get(EstimateGravity)
evolution = get(SimulateOffspring)
```

```python [main.py (using the module convention)]
from machinable import get

gravity = get('estimate_gravity')
evolution = get('evolution.simulate_offspring')
```

:::

Note that we do not refer to the classes by their name but just by the modules that contain them (since each module only contains one). As we will see later, importing and instantiating the classes this way has a lot of advantages, so it is the default way of instantiation in machinable projects.


## Saving and loading state

While machinable automatically commits crucial information about the interface, you can use <Pydoc>machinable.Interface.save_file</Pydoc> and <Pydoc>machinable.Interface.load_file</Pydoc> to easily store and retrieve additional custom data in different file formats:

```python
gravity.save_file('prediction.txt', 'a string')           # text
gravity.save_file('settings.json', {'neurons': [1, 2]})   # jsonable
gravity.save_file('inputs.npy', np.array([1.0, 2.0]))     # numpy
gravity.save_file('results.p', results)                   # pickled

>>> gravity.load_file('prediction.txt')
'a string'
```

This may be useful to save and restore some custom state of the interface. Furthermore, you are free to implement your own methods to persist data by writing and reading from the interface's <Pydoc caption="local_directory()">machinable.Interface.local_directory</Pydoc>:

```python
import os
mnist = get("mnist_data")
with open(mnist.local_directory("download_script.sh"), "w") as f:
    f.write(...)
    os.chmod(f.name, 0o755)
```

Overall, interfaces make it easy to associate data with code as instantiation, storage and retrieval are managed automatically behind the scenes.
