from machinable.execution import Execution
from machinable import Engine, Execution, Experiment, Project


def test_engine():
    Project("./tests/samples/project").connect()
    test_experiment = Experiment("execution.basics")
    test_execution = Execution("machinable.engine.local_engine").add(
        test_experiment
    )

    test_execution.engine().dispatch(test_execution)