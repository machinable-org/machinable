from .core import Component, Mixin
from .experiment import Experiment, ExperimentComponent as C
from .engine import Engine
from .storage import Storage
from .project import Project
from .execution import Execution


def execute(experiment, storage=None, engine=None, project=None, seed=None):
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
    def custom_execute(components, components, store):
        store.log.info('Custom training with learning_rate=' + str(components.config.lr))

    custom_execute(experiment, write, seed) # invokes the decorated function
    ```

    # Using the Execution

    This method forms a wrapper around machinable.Execution. You can instantiate
    machinable.Executon directly with the same argument to benefit from
    more fine grained execution APIs like asynchronous executon etc.

    # Returns

    The execution returns an machinable.Execution object that contains the
    result of the execution
    """
    if callable(experiment):
        # decorator use
        if None not in (storage, engine, project, seed):
            raise ValueError(
                "execute decorator takes no arguments; "
                "call the decorated function with arguments instead."
            )
        functional_component = experiment

        def wrapper(experiment, storage=None, engine=None, project=None, seed=None):
            project = Project.create(project)
            project.default_component = functional_component
            return (
                Execution(
                    experiment=experiment,
                    storage=storage,
                    engine=engine,
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
            project=project,
            seed=seed,
        )
        .summary()
        .submit()
    )
