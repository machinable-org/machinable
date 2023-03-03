# Elements

Let's take a step back and generalize some essential concepts covered thus far. In fact, [Project](../essentials/project-structure.md), [Experiment](../essentials/implementing-experiments.md), [Execution](../essentials/executing-experiments.md) and [Storage](../essentials/storage-and-retrieval.md) all implement the same core API derived from the <Pydoc>machinable.Element</Pydoc> base class.

## The anatomy of an element

Elements have the following properties:

- they are defined as a single class contained in a Python module such that the module name can serve as an alias for the class (module convention)

- they have a default configuration and configuration updates can be represented in primitive datatypes (string, dict, list etc.)

As a result, an element instance can be represented in a *JSON-able format* consisting of the module import path plus an optional list of configuration updates.
To make this less abstract, consider 
```python
element_spec = ['exoplanet', {'gravity': 9}]
```
which refers to the element class within the `exoplanet` module, instantiated with the default configuration and an updated value `9` for the `gravity` parameter. This representation is suitable to (re-)create element instances from a storage (say, a JSON-file). In fact, the <Pydoc>machinable.get</Pydoc>-method does exactly that:
```python
from machinable import get

element_instance = get(*element_spec)
```

Of course, this representation does not capture anything about the actual element instance or its source code. Consider:

```
# change the element
element_instance.some_value = 'changed'
# delete the object
del element_instance
# recreate the 'same' element
element_instance = get(*element_spec)
# this will throw an attribute error
element_instance.some_value
```

Anything that is not explicitly represented as configuration change is lost. However, as we will discuss, machinable allows you to extend and implement your own criteria to establish identity between elements. For now, the important idea is the fact that you can describe, store and load element objects in a JSON-able format.

At this point you may wonder, how configuration updates remain JSON-able in general. After all, we might like to set `gravity=9*m/s**2` that cannot be natively represented in JSON. We will discuss such advanced configuration patterns next.