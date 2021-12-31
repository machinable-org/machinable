import pytest
from machinable import Execution, Experiment, Project


def test_execution():
    assert len(Execution().add([Experiment(), Experiment()]).experiments) == 2
    with pytest.raises(ValueError):
        Execution().add(None)
    execution = Execution()
    assert (
        Execution.from_model(execution.__model__).timestamp
        == execution.timestamp
    )

    assert str(Execution()) == "Execution"
    assert repr(Execution()) == "Execution"

    with Project("./tests/samples/project"):
        execution = Execution().add(Experiment())
        assert len(execution.experiments) == 1
        assert isinstance(execution.timestamp, float)

        experiment = Experiment()
        execution = Execution.local().add(experiment)
        assert len(execution.experiments) == 1
        execution.dispatch()


def test_local_execution():
    Experiment().execute(
        "machinable.execution.local_execution", {"processes": None}
    )
    Experiment().execute(
        "machinable.execution.local_execution", {"processes": 1}
    )
