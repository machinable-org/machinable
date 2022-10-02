import time

import pytest
from machinable import Execution, Experiment, Project, Storage


def test_execution():
    assert len(Execution().use([Experiment(), Experiment()]).experiments) == 2
    with pytest.raises(ValueError):
        Execution().use(None)
    execution = Execution()
    assert (
        Execution.from_model(execution.__model__).timestamp
        == execution.timestamp
    )

    assert str(Execution()) == "Execution"
    assert repr(Execution()) == "Execution"

    with Project("./tests/samples/project"):
        execution = Execution().use(Experiment())
        assert len(execution.experiments) == 1
        assert isinstance(execution.timestamp, float)

        experiment = Experiment()
        execution = Execution.local().use(experiment)
        assert len(execution.experiments) == 1
        execution.dispatch()


def test_execution_resources():
    experiment = Experiment()
    execution = Execution()
    # default resources are empty
    assert execution.resources(experiment) == {}
    # default resources can be declared via a method
    class T(Experiment):
        def default_resources(self, execution):
            return {"1": 2}

    assert execution.resources(T()) == {"1": 2}
    # default resources are reused
    experiment.resources({"test": "me"})
    assert experiment.resources() == {"test": "me"}
    # inheritance of default resources
    assert execution.resources(T(resources={"3": 4})) == {"1": 2, "3": 4}
    assert execution.resources(
        T(resources={"3": 4, "_inherit_defaults": False})
    ) == {"3": 4}
    # inherit but ignore commented resources
    assert execution.resources(T(resources={"3": 4, "#1": None})) == {"3": 4}


def test_local_execution():
    Experiment().execute("machinable.execution.local", {"processes": None})
    Experiment().execute("machinable.execution.local", {"processes": 1})


class ExternalExperiment(Experiment):
    def on_create(self):
        print("Hello from the external script")
        self.save_data("test.txt", "hello")


def test_external_execution(tmpdir):
    # tmpdir = "./test"
    with Storage.filesystem(str(tmpdir)):
        experiment = ExternalExperiment()
        experiment.execute("machinable.execution.external", {})
        time.sleep(0.1)
        assert experiment.is_finished()
        assert experiment.load_data("test.txt") == "hello"
