# optimization.py

from machinable import Component


class DummyOptimization(Component):

    def on_create(self):
        print("Creating the optimization model with the following configuration: ",
              self.config)

    def on_execute(self):
        for i in range(3):
            print('Training step', i)
