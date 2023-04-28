# Project structure

## Creating components

At a basic level, machinable projects are regular Python projects that implement *components*. Think of an component as some code we would like to run to gain some insights, say a simulation of evolutionary biology or data analysis to estimate the gravity of an exoplanet. 
In machinable projects, such component code is implemented in classes that inherit from the <Pydoc>machinable.Component</Pydoc> base class. 

For example, a basic component implementation might look like this:

```python
from machinable import Component  # Component base class

class EstimateGravity(Component):
  """An component to estimate gravity"""
```

## The module convention

The only hard constraint here is that each component must be placed in its own Python module. The project source code may for instance be organized like this:

```
example_project/
├─ estimate_gravity.py            # contains a data analysis component
├─ evolution/                   
|  └─ simulate_offspring.py       # contains a evolutionary simulation
└─ main.py                        # main script to execute
```

One benefit of this requirement is that the names of the classes do not matter; we can directly refer to an component via the module import path.

For example, using this *module convention*, we can simplify the instantiation of the component classes. Consider how you would usually instantiate the classes:

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
Note that we do not refer to the classes by their name but just by the modules that contain them. As we will see later, importing and instantiating components this way has a lot of advantages, so it is the default way of instantiation in machinable projects.

## Project directory

By default, the modules are resolved with respect to the current working directory. You can set the project directory explictly using <Pydoc>machinable.Project</Pydoc>, for example:

```python
from machinable import get, Project

# the default project directory is the current working directory
evolution = get('evolution.simulate_offspring')

# instantiate project in sub-directory
with Project("./evolution"):
  # get-imports are relative to the project directory
  evolution = get("simulate_offspring")
```

You can inspect the current project using <Pydoc>machinable.Project.get</Pydoc>:
```python
>>> project = Project.get()
>>> project.path()
'/home/user/example_project'
>>> project.name()
'example_project'
```

## Verify your setup

If you have structured your project correctly, you should be able to instantiate any of the component that you have created via their module name. 

```python
>>> from machinable import get
>>> get('estimate_gravity').__class__
<class 'estimate_gravity.EstimateGravity'>
```
