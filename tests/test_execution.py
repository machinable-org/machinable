from typing import Dict

import random

import pytest
from machinable import Component, Execution, Project, Scope, errors, get
from pydantic import BaseModel


def test_execution(tmp_storage):
    # no-predicate by default
    e1 = get("machinable.execution", {"a": 1}).commit()
    e2 = get("machinable.execution", {"a": 1}).commit()
    assert e1 != e2

    execution = Execution()
    assert (
        Execution.from_model(execution.__model__).timestamp
        == execution.timestamp
    )

    e = Execution()
    assert str(e) == e.id
    assert repr(e) == "Execution"

    execution = Execution().add(Component())
    assert len(execution.executables) == 1
    assert isinstance(execution.timestamp, float)

    # add
    component = Component()
    execution = Execution().add(component)
    assert len(execution.executables) == 1
    execution.dispatch()

    restored = Execution.find_by_id(execution.uuid)
    with pytest.raises(errors.MachinableError):
        restored.add(Component())

    # host info
    assert execution.host_info["python_version"].startswith("3")

    # output
    c = Component().commit()
    e = Execution().add(c).commit()
    assert e.output(c) is None
    e.save_file([c, "output.log"], "test")
    assert e.output(c) == "test"

    assert e.output(c, incremental=True) == "test"
    e.save_file([c, "output.log"], "testt")
    assert e.output(c, incremental=True) == "t"
    assert e.output(c, incremental=True) == ""
    e.save_file([c, "output.log"], "testt more")
    assert e.output(c, incremental=True) == " more"

    # status
    e.update_status(c, "started")
    assert e.is_started(c)
    e.update_status(c, "heartbeat")
    assert e.is_active(c)
    e.update_status(c, "finished")
    assert e.is_finished(c)
    assert not e.is_incomplete(c)


def test_execution_dispatch(tmp_storage):
    # prevent execution from component
    class T(Component):
        class Config(BaseModel):
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
        assert e1.execution == execution
        assert not e1.execution.is_started()
        e2 = Component()
        e2.launch()
        assert len(execution.executables) == 2
        assert e2.execution == execution
        assert not e2.execution.is_started()
    assert e1.execution.is_finished()
    assert e2.execution.is_finished()

    with Execution() as execution:
        e1 = Component()
        e1.launch()
        e2 = Component()
        e2.launch()
        assert e1.execution == execution
        assert e2.execution == execution
        assert not e1.execution.is_started()
        assert not e2.execution.is_started()
    assert e1.execution.is_finished()
    assert e2.execution.is_finished()


def test_execution_resources(tmp_storage):
    component = Component()
    execution = Execution()
    # default resources are empty
    assert execution.compute_resources(component) == {}

    # default resources can be declared via a method
    class T(Execution):
        def on_compute_default_resources(self, _):
            return {"1": 2}

    execution = T()
    assert execution.compute_resources(component) == {"1": 2}
    # default resources are reused
    execution = T(resources={"test": "me"})
    assert execution.resources()["test"] == "me"
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
    with Execution(resources={"test": 1, "a": True}) as execution:
        component = Component()
        component.launch()
    assert component.execution.resources()["test"] == 1

    with Execution(resources={"a": 3}) as execution:
        component.launch()
        assert component.execution.resources()["a"] is True

        e2 = Component()
        e2.launch()
    assert e2.execution.resources()["a"] == 3


def test_interrupted_execution(tmp_storage):
    with Project("./tests/samples/project"):
        component = Component.make("interface.interrupted_lifecycle")
        try:
            component.launch()
        except errors.ExecutionFailed:
            pass

        assert component.execution.is_started()
        assert not component.execution.is_finished()

        # resume
        try:
            component.launch()
        except errors.ExecutionFailed:
            pass

        component.launch()
        assert component.execution.is_finished()


def test_rerepeated_execution(tmp_storage):
    project = Project("./tests/samples/project").__enter__()

    class NoScope(Scope):
        def __call__(self) -> Dict:
            return {"random": random.randint(0, 99999)}

    # first execution
    with Execution() as execution1, NoScope():
        c1 = get("count").launch()
        assert c1.count == 0
    assert c1.execution == execution1
    assert c1.execution.is_finished()
    assert c1.count == 1

    # second execution, nothing happens here
    with execution1:
        c1.launch()
    assert c1.execution == execution1
    assert c1.count == 1

    # add a new component to existing execution is not allowed
    with execution1:
        with NoScope():
            c2 = get("count")
        with pytest.raises(errors.MachinableError):
            c2.launch()
    assert c2.count == 0
    assert not c2.is_committed()

    # resume execution
    with pytest.raises(errors.ExecutionFailed):
        with Execution() as execution2:
            with NoScope():
                done = get("count").launch()
            with NoScope():
                failed = get("fail").launch()
    assert done.execution.is_finished()
    assert not done.execution.is_resumed()
    assert not failed.execution.is_finished()

    failed.save_file("repaired", "yes")
    with execution2:
        done.launch()
        failed.launch()
    assert failed.execution.is_finished()
    assert failed.execution.is_resumed()
    assert len(execution2.executables) == 2

    # resume with another execution
    with pytest.raises(errors.ExecutionFailed):
        with Execution() as execution2:
            with NoScope():
                done = get("count").launch()
            with NoScope():
                failed = get("fail").launch()
    failed.save_file("repaired", "yes")
    with Execution() as execution3:
        failed.launch()
    assert failed.execution == execution3
    assert failed.execution.is_finished()
    assert not failed.execution.is_resumed()
    assert len(execution2.executables) == 2
    assert len(execution3.executables) == 1

    # attempted re-execution - silently ignored
    with Execution() as execution4:
        done.launch()
    assert done.count == 1
    assert not execution4.is_committed()
    with Execution() as execution5:
        done.launch()
        with NoScope():
            done2 = get("count").launch()
    assert done.count == 1
    assert done2.count == 1
    assert len(execution5.executables) == 2

    project.__exit__()
