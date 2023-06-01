# Element

At a basic level, machinable projects are regular Python projects consisting of  *elements* - configurable classes that encapsulate parts of your code.
For example, an element implementation of a dataset might look like this:

```python
from machinable import Element  # Element base class

class MnistData(Element):
  """A dataset of handwritten characters"""
  Config = {
    "batch_size": 8,
    "name": "mnist"
  }
```

When inheriting from <Pydoc>machinable.Element</Pydoc>, you can specify default configuration values in the `Config` attribute placed at the top of the class definition. 

The parameters become available under `self.config` and can be accessed with object-notation (`self.config.my.value`) or dict-style access (`self.config['my']['value']`):

```python
>>> MnistData().config.name
'mnist'
```

## Versions

You can override the default element configuration to instantiate different *versions* of the element:
```python
>>> data = MnistData({"batch_size": 16})
>>> data.batch_size
16
```

Here, we passed the configuration update as a predefined dictionary, but it is equally possible to compute the versions dynamically, for example:

```python
class MnistData(Element):
    """A dataset of handwritten characters"""
    Config = {
        "batch_size": 8,
        "name": "mnist"
    }
    
    def version_large(self):
        return {
            "batch_size": self.config.batch_size * 2
        }


>>> MnistData("~large").config.batch_size
16
```

The `~{name}` indicates that the version is defined as a method and machinable will look up and call `version_{name}` to use the returned dictionary to update the default configuration. This works with parameters as well:

```python
class MnistData(Element):
    """A dataset of handwritten characters"""
    Config = {
        "batch_size": 8,
        "name": "mnist"
    }
    
    def version_large(self, factor=2):
        return {
            "batch_size": int(self.config.batch_size * factor)
        }


>>> MnistData("~large(3)").config.batch_size
24
```

Furthermore, it is possible to compose versions in a list, for example:

```python
>>> MnistData(["~large(factor=0.5)", {"name": "halve"}]).config
{'batch_size': 4, 'name': 'halve'}
```

The updates are merged from right to left, i.e. values appended to the list overwrite prior values:
```python
>>> MnistData([{"name": "first"}, {"name": "second"}]).config.name
'second'
```
You can inspect and modify the current version using <Pydoc>machinable.Element.version</Pydoc>
```python
>>> mnist = MnistData({"batch_size": 2})
>>> mnist.version()
[{'batch_size': 2}]
>>> mnist.version({"batch_size": 4})
[{'batch_size': 2}, {'batch_size': 4}]
>>> mnist.config.batch_size
4
>>> mnist.version([], overwrite=True)
>>> mnist.config.batch_size
8
```

Notably, whatever version is being applied, machinable keeps track of the default configuration and applied configuration updates:

```python
mnist = MnistData({"batch_size": 1})
>>> mnist.config._default_
{'batch_size': 8, 'name': 'mnist'}
>>> mnist.config._update_
{'batch_size': 1}
```

Elements support many more advanced configuration features such as typing, validation, parameter documentation, computed values, etc., which will be covered in later sections of the Guide. For now, to summarize, elements are classes with default configurations that may be modified with a list of configuration updates.
