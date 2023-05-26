# Elements

Let's take a step back and generalize some essential concepts covered thus far. Notably, [Project](../essentials/project-structure.md), [Experiment](../essentials/implementing-experiments.md), [Execution](../essentials/executing-experiments.md) and [Storage](../essentials/storage-and-retrieval.md) all implement the same core API derived from the <Pydoc>machinable.Element</Pydoc> base class. Put crudely, elements wrap code in a modular and configurable interface that is designed to be representable in JSON.

## The anatomy of an element

Elements have the following key properties:

- they are defined as a single class contained in a Python module such that the module name can serve as an alias for the class (module convention)
- they have a default configuration and configuration updates can be represented in primitive datatypes (string, dict, list etc.)

As a result, an element instance can be represented in a *JSON-able format* consisting of the module import path plus an optional list of configuration updates.

To make this less abstract, consider the following element specification:

::: code-group

```python [Python/JSON]
["exoplanet", {"gravity": 9}]
```

```python [exoplanet.py]
from dataclasses import dataclass
from machinable import Element

class Planet(Element):
    @dataclass
    class Config:
        gravity: float = 0.0
```

:::

Concretly, it refers to the `Planet` element class within the `exoplanet` module, instantiated with an updated gravity parameter `9`. Crucially, this representation is enough to (re-)create element instances from a storage (say, a JSON-file). In fact, the <Pydoc>machinable.get</Pydoc>-method does exactly that:
```python
from machinable import get

element_spec = ["exoplanet", {"gravity": 9}]
element_instance = get(*element_spec)
```

Since the module and configuration updates are all that is needed to describe, store and load an element, it means that anything that is not explicitly represented as configuration change is not persistent:

```python
# create the element
element_instance = get(*element_spec)
element_instance.new_value = 'example'
# delete the object
del element_instance
# recreate the 'same' element
element_instance = get(*element_spec)
# this will throw an attribute error
element_instance.new_value
```

However, to describe configuration updates effectively, elements provide a quite powerful configuration system which we will discuss next.
