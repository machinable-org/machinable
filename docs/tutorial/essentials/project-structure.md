# Project structure

## Creating experiments

At a basic level, machinable projects are regular Python projects that implement *experiments*. Think of an experiment as some code we would like to run to gain some insights, say a simulation of evolutionary biology or data analysis to estimate the gravity of an exoplanet. 
In machinable projects, such experiment code is implemented in classes that inherit from the <Pydoc>machinable.Experiment</Pydoc> base class. 

For example, a basic experiment implementation might look like this:

```python
from machinable import Experiment  # Experiment base class

class EstimateGravity(Experiment):
  """An experiment to estimate gravity"""
```

## The module convention

The only hard constraint here is that each experiment must be placed in its own Python module. The project source code may for instance be organized like this:

```
example_project/
├─ estimate_gravity.py            # contains a data analysis experiment
├─ evolution/                   
|  └─ simulate_offspring.py       # contains a evolutionary simulation
└─ main.py                        # main script to execute
```

One benefit of this requirement is that the names of the classes do not matter; we can directly refer to an experiment via the module import path.

For example, using this *module convention*, we can simplify the instantiation of the experiment classes. Consider how you would usually instantiate the classes:

```python
# main.py
from estimate_gravity import EstimateGravity
from evolution.simulate_offspring import SimulateOffspring

gravity = EstimateGravity()
evolution = SimulateOffspring()
```
And here is the module-convention equivalent using <Pydoc>machinable.get</Pydoc>:
```python
# main.py using machinable's module convention
from machinable import get

gravity = get('estimate_gravity')
evolution = get('evolution.simulate_offspring')
```
Note that we do not refer to the classes by their name but just by the modules that contain them. As we will see later, importing and instantiating experiments this way has a lot of advantages, so it is the default way of instantiation in machinable projects.

## Verify your setup

If you have structured your project correctly, you should be able to instantiate any of the experiment that you have created via their module name. 

```python
>>> from machinable import get
>>> get('estimate_gravity').__class__
<class 'estimate_gravity.EstimateGravity'>
```
