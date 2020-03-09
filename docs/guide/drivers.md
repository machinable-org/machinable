# Drivers

machinable provides different execution drivers that enable seamless parallel and remote execution. You can also implement your own driver to customize the execution to your needs.

## Multiprocessing

Uses Python's multiprocessing module to execute components in parallel. 

``` python
ml.execute(ml.Task().component('demo'), driver='multiprocessing')
# by default, 5 processes are being used; to adjust the number use:
ml.execute(ml.Task().component('demo'), driver='multiprocessing:10')
```

## Ray

[Ray](https://github.com/ray-project/ray) is a powerful distributed framework that supports local as well as remote execution on [clusters like AWS and Google Cloud instances](https://ray.readthedocs.io/en/latest/autoscaling.html). Please refer to [Ray's documentation](https://ray.readthedocs.io) to learn more.

To execute machinable tasks on the connected Ray backend use the Ray driver:

``` python
ml.execute(ml.Task().component('demo'), driver='ray')
```

## Custom drivers

You can implement a custom driver as a subclass of `machinable.Driver` and pass them as an argument.

``` python
class CustomDriver(ml.Driver):

    # implement abstract methods

ml.execute(ml.Task().component('demo'), driver=CustomDriver())
```