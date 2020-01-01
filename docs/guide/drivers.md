# Remote execution using Ray

machinable comes with support for seamless remote execution using [Ray](https://github.com/ray-project/ray).

Ray supports local as well as remote execution on [AWS and Google Cloud](https://ray.readthedocs.io/en/latest/autoscaling.html). Please refer to [Ray's documentation](https://ray.readthedocs.io) to learn how to setup and start Ray.

machinable will automatically detect when Ray has been initialised via `ray.init()` and execute on the connected Ray backend.

``` python
import ray
ray.init()   # initialise Ray or connect to remote server

# detects and executes on the Ray cluster
ml.execute(ml.Task().component('demo'))
# executes locally only in spite Ray being available
ml.execute(ml.Task().component('demo'), local=True)
```
