# Engines

machinable provides different execution engines that enable seamless parallel and remote execution. You can also implement your own engine to customize the execution to your needs.

## Native

By default, the natvie engine is used. The engine supports parallel execution using Python's multiprocessing.

``` python
execute(Experiment().component('demo'), engine='native')
# use a maximum of 10 processes in parallel
execute(Experiment().component('demo'), engine='native:10')
```

## Ray

[Ray](https://github.com/ray-project/ray) is a powerful distributed framework that supports local as well as remote execution on [clusters like AWS and Google Cloud instances](https://ray.readthedocs.io/en/latest/autoscaling.html). Please refer to [Ray's documentation](https://ray.readthedocs.io) to learn more.

To execute machinable tasks on the connected Ray backend use the Ray driver:

``` python
execute(Experiment().component('demo'), engine='ray')
```

## Custom engines

You can implement a custom engine as a subclass of `machinable.Engine` and pass them as an argument.

``` python
class CustomEngine(ml.Engine):

    # implement abstract methods

execute(Experiment().component('demo'), engine=CustomEngine())
```