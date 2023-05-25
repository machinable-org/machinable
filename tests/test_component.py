import os
import stat

import commandlib
import pytest
from machinable import (
    Component,
    Execution,
    Project,
    Storage,
    errors,
    get,
    schema,
)
from machinable.element import Element


def test_component(tmp_storage):
    p = Project("./tests/samples/project").__enter__()
    component = Component.make("dummy")
    assert component.module == "dummy"
    assert isinstance(str(component), str)
    assert isinstance(repr(component), str)
    assert component.config.a == 1

    # version
    assert component.version() == []
    assert component.version("test") == ["test"]
    assert component.version() == ["test"]
    assert component.version("replace", overwrite=True) == ["replace"]
    component.version({"a": -1}, overwrite=True)
    assert component.config.a == -1
    component.version({"a": 1})
    assert component.config.a == 1

    component = Component.from_model(Component.model(component))
    serialized = component.serialize()
    assert serialized["config"]["a"] == 1

    # write protection
    component = Component.make("dummy").commit()
    assert component.version() == []
    with pytest.raises(errors.MachinableError):
        component.version(["modify"])

    # output
    c = Component().commit()
    assert c.output() is None
    c.save_file("output.log", "test")
    assert c.output() == "test"

    assert c.output(incremental=True) == "test"
    c.save_file("output.log", "testt")
    assert c.output(incremental=True) == "t"
    assert c.output(incremental=True) == ""
    c.save_file("output.log", "testt more")
    assert c.output(incremental=True) == " more"

    c.update_status("started")
    assert c.is_started()
    c.update_status("heartbeat")
    assert c.is_active()
    c.update_status("finished")
    assert c.is_finished()
    assert not c.is_incomplete()

    p.__exit__()


def test_component_launch(tmp_storage):
    component = Component()
    assert not component.is_mounted()
    component.launch()
    assert component.is_mounted()
    assert component.is_finished()

    # multiples
    component = Component()
    with Execution() as execution:
        component.launch()
        component.launch()
        component.launch()
    assert len(execution.executables) == 3

    with Execution():
        e1 = Component().launch()
        assert e1.execution is None
        e2 = Component().launch()
        assert e2.execution is None
    assert e1.is_finished()
    assert e2.is_finished()

    class Example(Component):
        def __call__(self):
            print("hello world")

    get(Example).launch()


def test_component_relations(tmp_storage):
    with Project("./tests/samples/project"):
        component = Component.instance("basic").group_as("test/group")
        execution = Execution().add(component)
        execution.dispatch()

        assert component.project.name() == "project"
        assert component.execution.timestamp == execution.timestamp
        assert component.executions[0].timestamp == execution.timestamp
        assert len(component.uses) == 0

        with pytest.raises(errors.MachinableError):
            component.version("attempt_overwrite")

        derived = Component(derived_from=component)
        assert derived.ancestor is component
        derived_execution = Execution().add(derived).dispatch()

        # invalidate cache and reconstruct
        component.__related__ = {}
        component._relation_cache = {}
        execution.__related__ = {}
        execution._relation_cache = {}
        derived.__related__ = {}
        derived._relation_cache = {}
        derived_execution.__related__ = {}
        derived_execution._relation_cache = {}

        assert derived.ancestor.id == component.id
        assert derived.ancestor.hello() == "there"
        assert component.derived[0].id == derived.id

        derived = Component(derived_from=component)
        Execution().add(derived).dispatch()
        assert len(component.derived) == 2

        assert component.derive().id != component.id
        derived = component.derive(version=component.config)
        Execution().add(derived).dispatch()


class DataElement(Element):
    class Config:
        dataset: str = "mnist"

    def hello(self):
        return "element"


def test_component_lifecycle(tmp_storage):
    with Project("tests/samples/project"):
        # test dispatch lifecycle
        component = Component.make("interface.events_check")
        component.launch()
        assert len(component.load_file("events.json")) == 6


class ExportComponent(Component):
    def __call__(self):
        print("Hello world")
        self.save_file("test_run.json", {"success": True})


def test_component_export(tmp_storage):
    component = ExportComponent()
    script = component.dispatch_code(inline=False)

    with pytest.raises(AttributeError):
        exec(script)

    e = Execution().add(component).commit()
    assert not component.is_started()

    exec(script)

    assert component.is_finished()
    assert component.load_file("test_run.json")["success"]

    # inline
    component = ExportComponent()
    Execution().add(component).commit()
    script = component.dispatch_code(inline=True)
    script_filepath = component.save_file("run.sh", script)
    st = os.stat(script_filepath)
    os.chmod(script_filepath, st.st_mode | stat.S_IEXEC)

    print(commandlib.Command("bash")(script_filepath).output())
    assert component.is_finished()
    assert component.load_file("test_run.json")["success"]


def test_component_predicates(tmp_storage):
    p = Project("./tests/samples/project").__enter__()

    e1 = get("predicate", {"a": 2})
    e1.launch()
    e2 = get("predicate", {"ignore_": 3})
    e2.launch()
    e3 = get("predicate", {"a": 1})
    e3.launch()

    # ignore enderscores by default
    e = get("predicate", {"a": 2, "ignore_": 1})
    assert e == e1
    # match enderscore
    e = get("predicate", {"ignore_": 3}, predicate="config_update_")
    assert e == e2
    # custom
    e = get("predicate", {"a": 1}, predicate="config,test,more")
    assert e == e3
    # full config
    e = get("predicate", {"ignore_": 3}, predicate="config")
    assert e == e3

    p.__exit__()


def test_component_interactive_session(tmp_storage):
    class T(Component):
        def is_valid(self):
            return True

    t = get(T)
    assert t.module == "__session__T"
    assert t.__model__._dump is not None

    # default launch
    t.launch()
    # serialization
    exec(t.dispatch_code(inline=False) + "\nassert component__.is_valid()")
    # retrieval
    assert t == get(T)
