import os

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


def test_component(tmp_storage, tmp_path):
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

    # storage
    storage = Storage.make(
        "machinable.storage.filesystem",
        {"directory": str(tmp_path)},
    )

    execution = schema.Execution()
    model = storage.create_component(
        component=schema.Component(config={"test": True}),
        group=schema.Group(pattern="", path=""),
        project=schema.Project(directory=".", name="test"),
        uses=[],
    )

    component = Component.from_model(model)

    assert component.config.test is True
    assert component.id == model.id
    assert component.local_directory().startswith(str(tmp_path))
    assert os.path.isdir(
        component.local_directory("non-existing/dir", create=True)
    )

    # output
    assert component.output() is None
    component.save_file("output.log", "test")
    assert component.output() == "test"

    assert component.output(incremental=True) == "test"
    component.save_file("output.log", "testt")
    assert component.output(incremental=True) == "t"
    assert component.output(incremental=True) == ""
    component.save_file("output.log", "testt more")
    assert component.output(incremental=True) == " more"

    component.mark_started()
    assert component.is_started()
    component.update_heartbeat()
    assert component.is_active()
    component.update_heartbeat(mark_finished=True)
    assert component.execution.is_finished()
    with pytest.raises(errors.ConfigurationError):
        component._assert_editable()
    assert not component.is_incomplete()

    # write protection
    assert component.version() == []
    with pytest.raises(errors.ConfigurationError):
        component.version(["modify"])

    p.__exit__()


def test_component_launch(tmp_storage):
    component = Component()
    assert not component.is_mounted()
    component.launch()
    assert component.is_mounted()
    assert component.execution.is_finished()

    # multiples
    component = Component()
    with Execution() as execution:
        component.launch()
        component.launch()
        component.launch()
    assert len(execution.executables) == 3

    with Execution():
        e1 = Component().launch()
        assert not e1.is_started()
        e2 = Component().launch()
        assert not e2.is_started()
    assert e1.is_finished()
    assert e2.is_finished()

    class Example(Component):
        def __call__(self):
            print("hello world")

    get(Example).launch()


def test_component_relations(tmp_storage):
    with Project("./tests/samples/project", name="test-project"):
        component = Component.instance("basic").group_as("test/group")
        execution = Execution().add(component)
        execution.dispatch()

        assert component.project.name() == "test-project"
        assert component.execution.timestamp == execution.timestamp
        assert component.executions[0].timestamp == execution.timestamp
        assert len(component.uses) == 0

        with pytest.raises(errors.ConfigurationError):
            component.version("attempt_overwrite")

        derived = Component(derived_from=component)
        assert derived.ancestor is component
        derived_execution = Execution().add(derived).dispatch()

        # invalidate cache and reconstruct
        component.__related__ = {}
        execution.__related__ = {}
        derived.__related__ = {}
        derived_execution.__related__ = {}

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
    assert not component.execution.is_started()

    exec(script)

    assert component.execution.is_finished()
    assert component.load_file("test_run.json")["success"]

    # inline
    component = ExportComponent()
    Execution().add(component).commit()
    script = component.dispatch_code(inline=True)
    script_filepath = component.save_file("run.sh", script)

    print(commandlib.Command("bash")(script_filepath).output())
    assert component.execution.is_finished()
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
