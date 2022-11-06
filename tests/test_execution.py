import time

import pytest
from machinable import Execution, Experiment, Project, Storage, errors


def test_execution(tmp_storage):
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

        assert execution.host_info["python_version"].startswith("3")


def test_execution_dispatch(tmp_storage):
    # prevent execution from experiment
    class T(Experiment):
        class Config:
            mode: str = "before"

        def on_before_dispatch(self):
            if self.config.mode == "before":
                raise ValueError("Prevent execution")

        def on_execute(self):
            if self.config.mode == "runtime":
                raise RuntimeError("Should not execute")

    with pytest.raises(ValueError):
        T().execute()

    with pytest.raises(errors.ExecutionFailed):
        T({"mode": "runtime"}).execute()

    # prevent commit for configuration errors
    with Project("./tests/samples/project"):
        valid = Experiment.make("dummy")
        invalid = Experiment.make("dummy", {"a": []})
        execution = Execution().use([valid, invalid])
        with pytest.raises(errors.ConfigurationError):
            execution.dispatch()
        assert not valid.is_mounted()
        assert not invalid.is_mounted()


def test_execution_resources():
    experiment = Experiment()
    execution = Execution()
    # default resources are empty
    assert execution.compute_resources(experiment) == {}

    # default resources can be declared via a method
    class T(Execution):
        def default_resources(self, experiment):
            return {"1": 2}

    execution = T()
    assert execution.compute_resources(experiment) == {"1": 2}
    # default resources are reused
    execution = T(resources={"test": "me"})
    assert execution.resources() == {"test": "me"}
    assert execution.compute_resources(experiment) == {"1": 2, "test": "me"}
    # inheritance of default resources
    execution = T(resources={"3": 4})
    assert execution.compute_resources(experiment) == {"1": 2, "3": 4}
    execution = T(resources={"3": 4, "_inherit_defaults": False})
    assert execution.compute_resources(experiment) == {"3": 4}
    # inherit but ignore commented resources
    execution = T(resources={"3": 4, "#1": None})
    assert execution.compute_resources(experiment) == {"3": 4}


def test_local_execution(tmp_storage):
    Experiment().execute("machinable.execution.local", {"processes": None})
    Experiment().execute("machinable.execution.local", {"processes": 1})


class ExternalExperiment(Experiment):
    def on_create(self):
        print("Hello from the external script")
        self.save_data("test.txt", "hello")


def test_external_execution(tmp_storage):
    experiment = ExternalExperiment()
    experiment.execute("machinable.execution.external", {})
    time.sleep(0.1)
    assert experiment.is_finished()
    assert experiment.load_data("test.txt") == "hello"
