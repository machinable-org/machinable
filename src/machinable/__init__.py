from .task import Task, TaskComponent as C
from .core import Component, Mixin
from .engine import Engine
from .driver import Driver
from .observations import Observations
from . import engine as _engine

events = _engine.Events()


def execute(task, storage=None, seed=None, driver=None, engine=None):
    """Executes a machinable task

    Schedules the task for execution. If a [Ray server](http://ray.readthedocs.io/) is available the
    execution will be scheduled and distributed on the Ray server.

    # Arguments
    task: machinable.Task, specifies the execution task. For convenience, it can also be a string or tuple that
        defines the node argument, e.g. ``ml.execute('my_model')`` or ``ml.execute((('my_model', {'param': 1}),))``
    storage: String, URL of the storage location for the results. If unspecified, the result storage will be
        non-persistent. Remote locations like SSH or S3 are supported via
        [pyFilesystem URLs](https://pyfilesystem.readthedocs.io/en/latest/filesystems.html)
    seed: Integer|String|None, determines the global random seed. If None, a random seed will be generated.
        To re-use the same random seed of a previous execution, you can pass in its [task ID](.)
    driver: Dict|String|None, driver type and options that determine the mode of execution,
        e.g. 'ray' or 'multiprocessing' etc.
    engine: Optional machinable.engine.Engine to use for this execution

    # Example
    ```python
    import machinable as ml
    ml.execute(ml.Task().component('iris', 'random_forest'), 's3://bucket', seed=42)
    ```

    # Functional API
    You can use this method as a function decorator to implement a custom execution. The decorated function
    is invoked with the node configuration as well as an observer object, for example:

    ```python
    @ml.execute
    def custom_execute(component, children, observer):
        observer.log.info('Custom training with learning_rate=' + str(component.config.lr))

    custom_execute(task, storage, seed) # invokes the decorated function
    ```
    """
    if callable(task):
        # decorator use
        if None not in (storage, driver, seed, engine):
            raise ValueError('execute decorator takes no arguments; '
                             'call the decorated function with arguments instead.')
        callback = task

        def wrapper(task: Task, storage=None, seed=None, driver=None, engine=None):
            if engine is None:
                engine = Engine(events=events)

            return engine.execute(task, storage, seed, driver, callback=callback)

        return wrapper

    if engine is None:
        engine = Engine(events=events)

    engine.execute(task, storage, seed, driver)
