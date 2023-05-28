import time

import pytest
from machinable import Component, Execution, Project, Storage, errors


def test_execution(tmp_storage):
    assert len(Execution().add([Component(), Component()]).executables) == 2
    execution = Execution()
    assert (
        Execution.from_model(execution.__model__).timestamp
        == execution.timestamp
    )

    assert str(Execution()) == "Execution"
    assert repr(Execution()) == "Execution"

    with Project("./tests/samples/project"):
        execution = Execution().add(Component())
        assert len(execution.executables) == 1
        assert isinstance(execution.timestamp, float)

        component = Component()
        execution = Execution().add(component)
        assert len(execution.executables) == 1
        execution.dispatch()

        assert execution.host_info["python_version"].startswith("3")


def test_execution_dispatch(tmp_storage):
    # prevent execution from component
    class T(Component):
        class Config:
            a: int = 1
            mode: str = "before"

        def on_before_dispatch(self):
            if self.config.mode == "before":
                raise ValueError("Prevent execution")

        def __call__(self):
            if self.config.mode == "runtime":
                raise RuntimeError("Should not execute")

    with pytest.raises(errors.ExecutionFailed):
        T().launch()

    with pytest.raises(errors.ExecutionFailed):
        T({"mode": "runtime"}).launch()

    # prevent commit for configuration errors
    with Project("./tests/samples/project"):
        valid = T()
        invalid = T({"a": []})
        execution = Execution().add([valid, invalid])
        with pytest.raises(errors.ConfigurationError):
            execution.dispatch()
        assert not valid.is_mounted()
        assert not invalid.is_mounted()


def test_execution_context(tmp_storage):
    with Execution(schedule=None) as execution:
        e1 = Component()
        e1.launch()
        assert e1.execution is None
        e2 = Component()
        e2.launch()
        assert len(execution.executables) == 2
        assert e2.execution is None
    assert e1.is_finished()
    assert e2.is_finished()

    with Execution():
        e1 = Component()
        e1.launch()
        e2 = Component()
        e2.launch()
        assert e1.execution is None
        assert e2.execution is None
    assert e1.is_finished()
    assert e2.is_finished()
    assert e1.execution.nickname == e2.execution.nickname


def test_execution_resources(tmp_storage):
    component = Component()
    execution = Execution()
    # default resources are empty
    assert execution.compute_resources(component) == {}

    # default resources can be declared via a method
    class T(Execution):
        def default_resources(self, component):
            return {"1": 2}

    execution = T()
    assert execution.compute_resources(component) == {"1": 2}
    # default resources are reused
    execution = T(resources={"test": "me"})
    assert execution.resources() == {"test": "me"}
    assert execution.compute_resources(component) == {"1": 2, "test": "me"}
    # inheritance of default resources
    execution = T(resources={"3": 4})
    assert execution.compute_resources(component) == {"1": 2, "3": 4}
    execution = T(resources={"3": 4, "_inherit_defaults": False})
    assert execution.compute_resources(component) == {"3": 4}
    # inherit but ignore commented resources
    execution = T(resources={"3": 4, "#1": None})
    assert execution.compute_resources(component) == {"3": 4}

    # interface
    r = {"test": 1, "a": True}
    with Execution(resources={}) as execution:
        component = Component()
        assert component.resources() is None
        execution.resources(r)
        component.launch()
    assert component.resources() == r

    with Execution(resources={}) as execution:
        # component is already finished so updating resources has no effect
        execution.resources({"a": 2})
        component.launch()
        assert component.resources()["a"] is True

        e2 = Component()
        execution.resources({"a": 3})
        e2.launch()
    assert e2.resources()["a"] == 3


def test_interrupted_execution(tmp_storage):
    with Project("./tests/samples/project"):
        component = Component.make("interface.interrupted_lifecycle")
        try:
            component.launch()
        except errors.ExecutionFailed:
            pass

        assert component.is_started()
        assert not component.is_finished()

        # resume
        try:
            component.launch()
        except errors.ExecutionFailed:
            pass

        component.launch()
        assert component.is_finished()
