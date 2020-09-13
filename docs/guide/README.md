---
annotations: {
    component: [
        {
          x: 20, 
          y: 18, 
          width: 270,
          height: 25, 
          value: "Components inherit from machinable's Component baseclass"
        },
        {
          x: 20, 
          y: 108, 
          width: 280,
          height: 25, 
          value: "You can give the component class any name you like"
        },
        {
          x: 80, 
          y: 155, 
          width: 400,
          height: 65, 
          value: "Place your code under the on_create method"
        }
    ]
}
---

# Introduction

## What is machinable?

When you implement a machine learning model with a number of parameters, you inevitably end up engineering some *entry point* that allows you to experiment with it in a more or less effective way. You may, for example, add a command line argument parser to run your model directly from a terminal. Or, you might use configuration files to manipulate configuration options more efficiently.

**machinable** provides a system to build such *entry points* in an efficient, reliable and scalable way so you can dedicate more time to the development of your models. 

machinable is designed to be incrementally adoptable. The core is focused on configuration, and is easy to pick up and integrate with existing projects. At the same time, machinable is perfectly capable to underpin the entire research life cycle. In particular, it allows you to easily share and extend what you have developed with confidence, so you can move faster from idea to result to publication.

## Getting started

The easiest way to try out machinable is using the [example project](https://github.com/machinable-org/examples) that you can run directly in your browser using Binder. 

→ [Launch examples on Binder](https://mybinder.org/v2/gh/machinable-org/examples/master?urlpath=lab/tree/index.ipynb)

Feel free to follow along as the tutorial progresses. You can install the machinable locally using the Python package manager `pip install machinable`.

→ [Installation guide](./installation.md)


## How it works

At the core of machinable is a system that enables you to divide your project into configurable components. A component encapsulates a part of code that you would like to execute *and* the configuration options that are associated with that code. Consider the following example script (`ridge_regression.py`).

```python
from sklearn.linear_model import Ridge

model = Ridge(alpha=0.6)
model.fit([[0, 0], [0, 1], [1, 1]], [0, .1, 1])
print(model.intercept_)
```
To encapsulate this regression model as a component, you can copy the code into a `Component` class. 

<Annotated name="component" :debug="false">
```python
from machinable import Component

from sklearn.linear_model import Ridge

class RidgeRegression(Component):
    def on_create(self):
        model = Ridge(alpha=self.config.alpha)
        model.fit([[0, 0], [0, 1], [1, 1]], [0, .1, 1])
        self.log.info(model.intercept_)
```
</Annotated>

Note that the model has one parameter `alpha` that has been replaced with `self.config.alpha` to make it configurable. Moreover, the `print` statement has been replaced to use the logging interface `self.log`.

The component can now be registered in the project-wide configuration file `machinable.yaml` that specifies all default configuration values.

```yaml
components:
 - ridge_regression:
     alpha: 0.6
```
After registration, the component is ready to be executed using the `execute` method.
```python
from machinable import execute
execute("ridge_regression")
```
Or, using the command line:
```bash
$ machinable execute ridge_regression
```
While this seems not much different from running the script directly, the execution abstraction allows to easily and enhance your experimentation in without changing any of the component code. For example, machinable provides: 

- A way to efficiently modify hyperparameters, covering anything from minor changes to advanced hyperparameter tuning algorithms
- Managed storage to capture any artifacts, logs, checkpoints, code backups etc.
- Execution on arbitrary targets, e.g. remote execution via `Ray`, `Slurm` or `SSH` or custom implementation
- Live-tracking and experiment databases
- Managed randomness and reproducibility

## Next steps

We've briefly introduced the most basic features of machinable. Continue reading this guide that will cover them and more advanced features in more detail.