import pytest
from machinable import Engine, Execution, Experiment, Project, errors
from machinable.execution import Execution


def test_local_engine():
    Project("./tests/samples/project").connect()
    engine = Engine.make("machinable.engine.local_engine")
    execution = Execution(Experiment("execution.basics"))
    engine.dispatch(execution)


def test_slurm_engine():
    Project("./tests/samples/project").connect()
    engine = Engine.make("machinable.engine.slurm_engine")
    execution = Execution(Experiment("execution.basics"))
    with pytest.raises(errors.ExecutionFailed):
        engine.dispatch(execution)
