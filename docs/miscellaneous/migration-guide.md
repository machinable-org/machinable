---
sidebar: auto
---

# Use in existing projects

The easiest way to use machinable with existing code is through a component that can be decorated with machinable's ``execute`` method, for example: 

```python
from machinable import Component, execute, Experiment
from my_existing_source_code import run

# define a 'binding' method that retrieves the configuration and calls into 
#  the existing source code

@execute
class Main(Component):
    def on_create():
        self.log.info('Running existing code with machinable')
        # call into your code
        run(self.config.toDict())

# use machinable's configuration engine like normal 
experiment = Experiment().component('my_component').repeat(3)

Main(experiment, storage='~results') # invoke the decorated component