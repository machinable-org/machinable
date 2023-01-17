import time

import pytest
from machinable import Execution, Experiment, Project, Storage, errors


def test_execution(tmp_storage):
    assert len(Execution().add([Experiment(), Experiment()]).experiments) == 2
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
        execution = Execution().add(experiment)
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
        T().launch()

    with pytest.raises(errors.ExecutionFailed):
        T({"mode": "runtime"}).launch()

    # prevent commit for configuration errors
    with Project("./tests/samples/project"):
        valid = Experiment.make("dummy")
        invalid = Experiment.make("dummy", {"a": []})
        execution = Execution().add([valid, invalid])
        with pytest.raises(errors.ConfigurationError):
            execution.dispatch()
        assert not valid.is_mounted()
        assert not invalid.is_mounted()


def test_execution_context(tmp_storage):
    with Execution(schedule=None) as execution:
        e1 = Experiment()
        e1.launch()
        assert e1.is_finished()
        e2 = Experiment()
        e2.launch()
        assert len(e2.launch.experiments) == 2
        assert e1.launch.nickname == e2.launch.nickname
        assert e2.is_finished()

    with Execution():
        e1 = Experiment()
        e1.launch()
        e2 = Experiment()
        e2.launch()
        assert not e1.is_finished()
        assert not e2.is_finished()
    assert e1.is_finished()
    assert e2.is_finished()
    assert e1.launch.nickname == e2.launch.nickname


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

    # interface
    r = {"test": 1, "a": True}
    with Execution(resources={}, schedule=None) as execution:
        experiment = Experiment()
        assert experiment.resources is None
        experiment.launch.resources(r)
        experiment.launch()
        assert experiment.resources == r

        # experiment is already finished so updating resources has no effect
        experiment.launch.resources({"a": 2})
        experiment.launch()
        assert experiment.resources["a"] is True

        e2 = Experiment()
        e2.launch.resources({"a": 3})
        e2.launch()
        e2.resources["a"] = 3
