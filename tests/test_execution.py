import pytest
from machinable import Component, Execution, Project, errors


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

        assert component.host_info["python_version"].startswith("3")

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

    # retried execution
    g = {"fail": True}

    class Fail(Component):
        def __call__(self) -> None:
            if g["fail"]:
                raise ValueError("Fail!")

    c = Fail()
    with pytest.raises(errors.ExecutionFailed):
        with Execution(resources={"x": 1}):
            c.launch()
    assert c.execution.resources()["x"] == 1
    g["fail"] = False
    with Execution(resources={"y": 1}) as execution:
        c.launch()
    assert execution.resources()["y"] == 1
    assert c.execution.resources()["x"] == 1


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
