# Mixins

You will often find that different projects share the same methods despite containing quite different components. For instance, a generative model and an image classifier might load the same MNIST dataset pipeline. Components might share code that allows them to be executed in a distributed way. Ideally, we'd like to develop and maintain such reusable building blocks, that are orthogonal to the details of the project that is using them. Mixins allow us to achieve exactly that.

## Mixin example: data pipeline

Suppose you've written an MNIST image classifier:

```yaml
components:
  - classifier:
      dataset:
        name: mnist
        batch_size: 8
```

```python
import tensorflow_datasets as tfds
from machinable import Component


class Classifier(Component):
    def load_data(self):
        self.data = tfds.load(name=self.config.dataset.name).batch(
            self.config.dataset.batch_size
        )

    def train(self):
        self.load_data()
        self.network.fit(self.data)

```

To make the data pipeline reusable, we can separate the `load_data` method into a mixin:

```yaml
mixins:
  - data:
      dataset:
        name: mnist
        batch_size: 8
components:
  - classifier:
      _mixins_:
        - data
```

The mixin configuration is placed under the `mixins` section in the `machinable.yaml`. In this example, we register the mixin with the name `data` and move the configuration that belongs to the mixin out of the components. The components can use the mixin by registering its name under `_mixins_`.

Similiarly, the data loading method is moved from the components into the corresponding `data.py` via cut-and-paste:

```python
import tensorflow_datasets as tfds
from machinable import Mixin


class DataMixin(Mixin):
    def load_data(self):
        self.data = tfds.load(name=self.config.dataset.name).batch(
            self.config.dataset.batch_size
        )
```

The data loader is now completely disentangled from the components and can be maintained independently. In fact, mixins support config inheritance, aliasing and importing just like other components. In the components, we can access the mixins functionality via the `_<name>_` attribute, e.g. `_data_`:

```python
from machinable import Component


class Classifier(Component):
    def train(self):
        self._data_.load_data()
        self.network.fit(self.data)
```

Note that the mixin function acts on the object from which it is called. They are dynamically 'mixed-in' into the object as if they were a part of it. In the example, `load_data` assigns `self.data` used by `self.network.fit(self.data)`. Conversely, `self` in a mixin method refers to the object that uses it and not to the mixin itself. If you want to access the mixin itself you can use `self.__mixin__`. However, when you call `self.__mixin__.my_method()` the `self` in ``my_method`` will - again - refer to the object that binds it.

## Mix-in components

It is possible to use components directly as mixins:

```yaml
+:
  - my_project
mixins:
  - +.my_project.components.classifier=classifier:
components:
  - mix_components:
      _mixins_:
        - classifier
```

You can then cherry-pick the methods you need without inheriting the full functionality, for instance the components' training method
`self._classifier_.train()`.
