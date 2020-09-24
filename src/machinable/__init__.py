from typing import Any, Callable, Union

from .core import Component, Mixin
from .engine import Engine
from .execution import Execution
from .experiment import Experiment
from .experiment import ExperimentComponent as C
from .index import Index
from .project import Project
from .storage import Storage


def execute(
    experiment: Union[Experiment, Any],
    storage: Union[dict, str] = None,
    engine: Union[Engine, str, dict, None] = None,
    index: Union[Index, str, dict, None] = None,
    project: Union[Project, Callable, str, dict] = None,
    seed: Union[int, None, str] = None,
) -> Execution:
    """Executes a machinable experiment

    Schedules the experiment for execution.

    # Arguments
    experiment: machinable.Experiment, specifies the execution experiment. For convenience, it can also be a string or tuple that
        defines the node argument, e.g. ``ml.execute('my_model')`` or ``ml.execute((('my_model', {'param': 1}),))``
    storage: String, URL of the write location for the results. If unspecified, the result write will be
        non-persistent. Remote locations like SSH or S3 are supported via
        [pyFilesystem URLs](https://pyfilesystem.readthedocs.io/en/latest/filesystems.html)
    engine: machinable.Engine|Dict|String|None, engine that handles execution,
        e.g. 'local' or 'ray' etc.
    index: machinable.Index|Dict|String|None, index that tracks this execution
    project: Project|Dict|String|None, project used, defaults to current working directory
    seed: Integer|String|None, determines the global random seed. If None, a random seed will be generated.
        To re-use the same random seed of a previous execution, you can pass in its [experiment ID](.)

    # Example
    ```python
    import machinable as ml
    ml.execute(ml.Experiment().components('iris', 'random_forest'), 's3://bucket', seed=42)
    ```

    # Functional API
    You can use this method as a function decorator to implement a custom execution.
    The decorated function is invoked with the configuration as well as an
    store object, for example:

    ```python
    @ml.execute
    def custom_execute(component, components, store):
        store.log.info('Custom training with learning_rate=' + str(component.config.lr))

    custom_execute(experiment, storage, seed) # invokes the decorated function
    ```

    # Using the Execution

    This method forms a wrapper around machinable.Execution. You can instantiate
    machinable.Executon directly with the same argument to benefit from
    more fine grained execution APIs like asynchronous executon etc.

    # Returns

    The execution returns an machinable.Execution object that contains the
    result of the execution
    """
    from inspect import isclass

    if not isinstance(experiment, Experiment) and (
        isclass(experiment) or callable(experiment)
    ):
        # decorator use
        if None not in (storage, engine, index, project, seed):
            raise ValueError(
                "execute decorator takes no arguments; "
                "call the decorated object with arguments instead."
            )
        functional_component = experiment

        def wrapper(
            experiment, storage=None, engine=None, index=None, project=None, seed=None
        ):
            project = Project.create(project)
            project.default_component = functional_component
            return (
                Execution(
                    experiment=experiment,
                    storage=storage,
                    engine=engine,
                    index=index,
                    project=project,
                    seed=seed,
                )
                .summary()
                .submit()
            )

        return wrapper

    return (
        Execution(
            experiment=experiment,
            storage=storage,
            engine=engine,
            index=index,
            project=project,
            seed=seed,
        )
        .summary()
        .submit()
    )
