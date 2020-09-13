# Component composition

In many cases, it can be useful to compose existing components in a hierarchical way. For example, your components may implement different models that you would like to combine into one prediction strategy.

machinable allows you to use components as sub-components, meaning they become available to a parent ``node`` components. Consider the following components:

```python
from machinable import Component

# sub_component_example.py

class PredictionStrategy(Component):
    
    def on_create(self):
        self.model = ... # set up some model
    
    def predict(self, data):
        return self.model.predict(data)

# node_component_example.py

from machinable import Component

class PredictionBenchmark(Component):

    def on_create(self, prediction_strategy):
        self.prediction_strategy = prediction_strategy

        # load data
        self.data = ...

        print(self.prediction_strategy.predict(self.data))
```

Here, the sub-component encapsulates the model while the node components implements the benchmark control flow. The sub-component becomes available as argument to the ``on_create`` event of the node components. 

In general, the sub-components can access the parent node via ``self.node`` while the node components can access its sub-components via ``self.components``.

To designate components as sub-components use the ``components`` argument of [Experiment.components()](./experiments.md) method.