---
sidebar: auto
---

# Use in existing projects

The easiest way to use machinable with existing code is through an entry method that can be decorated with machinable's ``execute`` method, for example: 

```python
import machinable as ml
from my_existing_source_code import run

# define a 'binding' method that retrieves the configuration and calls into 
#  the existing source code

@ml.execute
def main(component, components, store):
    store.log.info('Running existing code with machinable')
    # call into your code
    run(components.config.toDict())

# use machinable's configuration engine like normal 
experiment = ml.Experiment().component('my_component').repeat(3)

main(experiment, '~results') # invoke the decorated function