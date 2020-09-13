# Engines

machinable provides different execution engines that enable seamless parallel and remote execution. You can also implement your own engine to customize the execution to your needs.

## Native

By default, the native engine is used. The engine supports parallel execution using Python's multiprocessing.

``` python
execute(Experiment().component('demo'), engine='native')
# use a maximum of 10 processes in parallel
execute(Experiment().component('demo'), engine='native:10')
```

## Ray

[Ray](https://github.com/ray-project/ray) is a powerful distributed framework that supports local as well as remote execution on [clusters like AWS and Google Cloud instances](https://ray.readthedocs.io/en/latest/autoscaling.html). Please refer to [Ray's documentation](https://ray.readthedocs.io) to learn more.

To execute using the connected Ray backend use the Ray driver:

``` python
execute(Experiment().component('demo'), engine='ray')
```

## Slurm

The Slurm Workload Manager is a free and open-source job scheduler, used by many computing clusters. To execute schedule jobs on a Slurm cluster, specify the resources in the component argument.

```python
execute(
    Experiment().component(
        'demo',
        resources=[
            "-p bulk",
            "-c 8" 
            "--mem=10GB"
        ]
    ), 
    engine='slurm'
)
```

## Dry

The dry engine will simulate but not actually preform the execution.

## Detached, Remote

The detached and remote wrappers let you push execution into the background or onto remote machines.

Refer to the [engine reference](/reference/engine.html) to learn more about all available options.

## Custom engines

You can implement a custom engine as a subclass of `machinable.Engine` and pass them as an argument.

``` python
from machinable import Engine

class CustomEngine(Engine):

    # implement abstract methods

execute(Experiment().component('demo'), engine=CustomEngine())
```