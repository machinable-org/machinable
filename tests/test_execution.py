import os
import random

import pytest
from pydantic import BaseModel

from machinable import Execution, Interface, Scope, errors, get


def test_pending_executables(tmp_storage):
    class T(Interface):
        pass

    computed = get(T)
    computed.launch()
    fresh = get(T, {"x": 1})

    execution = Execution().add([computed, fresh])
    assert len(execution.interfaces) == 2
    pending = execution.pending_executables
    assert len(pending) == 1
    assert pending.first() is fresh


def test_interface_can_veto_meta_data(tmp_storage):
    class Quiet(Interface):
        def on_write_meta_data(self):
            return False  # e.g. a non-controller MPI rank

    quiet = get(Quiet)
    quiet.launch()
    # the run happened, but no status markers or cache flag were written
    assert not quiet.cached()
    assert not quiet.execution.is_started()


def test_execution(tmp_storage):
    # no-predicate by default
    e1 = get("machinable.execution", {"a": 1}).materialize()
    e2 = get("machinable.execution", {"a": 1}).materialize()
    assert e1 == e2
    e3 = get("machinable.execution", {"a": 2}).materialize()
    assert e1 != e3

    execution = Execution()
    assert Execution.from_model(execution.__model__).timestamp == execution.timestamp

    e = Execution()
    assert str(e) == "machinable.execution [unmaterialized]"
    assert repr(e) == "machinable.execution [unmaterialized]"

    execution = Execution().add(Interface())
    assert len(execution.interfaces) == 1
    assert execution.timestamp is None

    # add
    component = Interface({"slot": "a"})
    execution = Execution().add(component)
    assert len(execution.interfaces) == 1
    execution.dispatch()

    restored = Execution.find_by_id(execution.uuid)
    with pytest.raises(errors.MachinableError):
        restored.add(Interface())

    # host info
    run = component.execution
    assert run.host_info["python_version"].startswith("3")

    # output
    c = Interface({"slot": "b"}).materialize()
    Execution().add(c).dispatch()
    run = c.execution
    assert run.output() is None
    run.save_file("output.log", "test")
    assert run.output() == "test"

    assert run.output(incremental=True) == "test"
    run.save_file("output.log", "testt")
    assert run.output(incremental=True) == "t"
    assert run.output(incremental=True) == ""
    run.save_file("output.log", "testt more")
    assert run.output(incremental=True) == " more"

    # status (separate run-record; dispatch above already wrote finished_at)
    run = Execution().materialize()
    run.update_status("started")
    assert run.is_started()
    run.update_status("heartbeat")
    assert run.is_active()
    run.update_status("finished")
    assert run.is_finished()
    assert not run.is_incomplete()


def test_execution_dispatch(tmp_storage):
    class T(Execution):
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
        valid = T()
        invalid = T({"a": []})
        execution = Execution().add([valid, invalid])
        with pytest.raises(errors.ConfigurationError):
            execution.dispatch()
        assert not valid.is_mounted()
        assert not invalid.is_mounted()


def test_execution_deferral(tmp_storage):
    with Execution().deferred() as execution:
        component = Execution.make("dummy").launch()

    assert not component.cached()
    assert not execution.is_started()
    execution.dispatch()
    assert component.execution.is_finished()
    assert component.cached()

    component = Execution.make("dummy")
    assert not component.cached()
    with Execution().deferred() as execution:
        execution.deferred(False)
        component.launch()
    assert component.cached()


def test_execution_context(tmp_storage):
    with Execution() as execution:
        e1 = Execution.make("dummy")
        e1.launch()
        assert e1.execution == execution
        assert not e1.execution.is_started()
        e2 = Execution.make("dummy", {"a": 2})
        e2.launch()
        assert len(execution.interfaces) == 2
        assert e2.execution == execution
        assert not e2.execution.is_started()
    assert e1.execution.is_finished()
    assert e2.execution.is_finished()

    with Execution() as execution:
        e1 = Execution.make("dummy")
        e1.launch()
        e2 = Execution.make("dummy", {"a": 3})
        e2.launch()
        assert e1.execution == execution
        assert e2.execution == execution
        assert not e1.execution.is_started()
        assert not e2.execution.is_started()
    assert e1.execution.is_finished()
    assert e2.execution.is_finished()


def test_execution_resources(tmp_storage):
    component = Interface()
    execution = Execution()
    assert execution.computed_resources(component) == {}

    class T(Execution):
        def on_compute_default_resources(self, _):
            return {"1": 2}

    execution = T()
    assert execution.computed_resources(component) == {"1": 2}
    execution = T(resources={"test": "me"})
    assert execution.__model__.resources["test"] == "me"
    assert execution.computed_resources(component) == {"1": 2, "test": "me"}
    execution = T(resources={"3": 4})
    assert execution.computed_resources(component) == {"1": 2, "3": 4}
    execution = T(resources={"3": 4, "_inherit_defaults": False})
    assert execution.computed_resources(component) == {"3": 4}
    execution = T(resources={"3": 4, "#1": None})
    assert execution.computed_resources(component) == {"3": 4}

    with Execution(resources={"test": 1, "a": True}) as execution:
        component = Execution.make("dummy", {"a": 1})
        component.cached(False)
        component.launch()
    assert component.execution.computed_resources()["test"] == 1

    with Execution(resources={"a": 3}) as execution:
        component.launch()
        assert component.execution.computed_resources()["a"] is True

        e2 = Execution.make("dummy", {"a": 2})
        e2.launch()
    assert e2.execution.computed_resources()["a"] == 3


def test_interrupted_execution(tmp_storage):
    component = Execution.make("interface.interrupted_lifecycle")
    try:
        component.launch()
    except errors.ExecutionFailed:
        pass

    assert component.execution.is_started()
    assert not component.execution.is_finished()

    try:
        component.launch()
    except errors.ExecutionFailed:
        pass

    component.launch()
    assert component.execution.is_finished()


def test_rerepeated_execution(tmp_storage):
    class NoScope(Scope):
        def __call__(self) -> dict:
            return {"random": random.randint(0, 99999)}

    with Execution() as execution1, NoScope():
        c1 = get("count").launch()
        assert c1.count == 0
    assert c1.execution.is_finished()
    assert c1.count == 1

    with execution1:
        c1.launch()
    assert c1.count == 1

    with execution1:
        with NoScope():
            c2 = get("count")
        with pytest.raises(errors.MachinableError):
            c2.launch()
    assert c2.count == 0
    assert not c2.is_materialized()

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
    assert len(execution2.interfaces) == 2

    try:
        os.remove(failed.local_directory("repaired"))
    except OSError:
        pass
    failed.cached(False)

    with pytest.raises(errors.ExecutionFailed):
        with Execution() as execution2:
            with NoScope():
                done = get("count").launch()
            with NoScope():
                failed = get("fail").launch()
    failed.save_file("repaired", "yes")
    with Execution() as execution3:
        failed.launch()
    assert failed.execution.is_finished()
    assert len(execution2.interfaces) == 2
    assert len(execution3.interfaces) == 1

    with Execution() as execution4:
        done.launch()
    assert done.count == 1
    assert not execution4.is_materialized()
    with Execution() as execution5:
        done.launch()
        with NoScope():
            done2 = get("count").launch()
    assert done.count == 1
    assert done2.count == 1
    assert len(execution5.interfaces) == 2


def test_execution_from_index(tmp_storage):
    c = get("exec", resources={"a": 1}).materialize()
    cp = Execution.find_by_id(c.uuid, fetch=False)
    assert c.seed == c.seed
    assert c.__model__.resources == cp.__model__.resources
    assert cp.__model__.resources["a"] == 1
