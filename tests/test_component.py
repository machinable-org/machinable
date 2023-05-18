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
    assert component.is_finished()

    # multiples
    component = Component()
    with Execution() as execution:
        component.launch()
        component.launch()
        component.launch()
    assert len(execution.components) == 3

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


def test_component_uses(tmp_storage):
    with Project("./tests/samples/project"):
        assert Component.singleton("dummy") is not None
        component = Component.instance("dummy")
        dataset = DataElement({"dataset": "cifar"})
        component.use(dataset)
        assert component.uses[0].config.dataset == "cifar"
        component.launch()
        component.__related__ = {}
        assert component.uses[0].config.dataset == "cifar"
        assert component.uses[0].hello() == "element"


def test_component_interface(tmp_path):
    with Project("tests/samples/project"):
        # test dispatch lifecycle
        component = Component.make("interfaces.events_check")

        component.__model__._storage_instance = Storage.make(
            "machinable.storage.filesystem",
            {"directory": str(tmp_path)},
        )
        component.__model__._storage_id = str(tmp_path)

        component.dispatch()
        assert len(component.load_data("events.json")) == 6


class ExportComponent(Component):
    def __call__(self):
        print("Hello world")
        self.save_file("test_run.json", {"success": True})


def test_component_export(tmp_storage):
    component = ExportComponent()
    script = component.dispatch_code(inline=False)

    with pytest.raises(AttributeError):
        exec(script)

    Execution().add(component).commit()
    assert not component.is_started()

    exec(script)

    assert component.is_finished()
    assert component.load_file("test_run.json")["success"]

    # inline
    component = ExportComponent()
    Execution().add(component).commit()
    script = component.dispatch_code(inline=True)
    script_filepath = component.save_file("run.sh", script)

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
    assert e.id == e1.id
    # match enderscore
    e = get("predicate", {"ignore_": 3}, predicate="config_update_")
    assert e.id == e2.id
    # custom
    e = get("predicate", {"a": 1}, predicate="config,test,more")
    assert e.id == e3.id
    # full config
    e = get("predicate", {"ignore_": 3}, predicate="config")
    assert e.id == e3.id

    p.__exit__()


# # sub-class relations
# class CustomComponent(Component):
#     pass


# class CustomExecution(Execution):
#     pass


# def test_element_relations(tmp_storage):
#     with Project("./tests/samples/project"):
#         component = Component().group_as("test/group")
#         execution = Execution().add(component)
#         execution.dispatch()

#         component_clone = Component.from_storage(component.storage_id)
#         assert component.id == component_clone.id

#         # component <-> execution
#         assert int(execution.timestamp) == int(component.execution.timestamp)
#         assert (
#             component.id == execution.components[0].id
#         )
#         # group <-> execution
#         assert component.group.path == "test/group"
#         assert component.group.pattern == "test/group"
#         assert component.group.components[0].timestamp == component.timestamp

#         # invalidate cache and reconstruct
#         component.__related__ = {}
#         execution.__related__ = {}
#         # component <-> execution
#         assert int(execution.timestamp) == int(component.execution.timestamp)
#         assert (
#             component.id == execution.components[0].id
#         )
#         # group <-> execution
#         assert component.group.path == "test/group"
#         assert component.group.components[0].timestamp == component.timestamp

#         component = CustomComponent()
#         execution = CustomExecution().add(component)
#         execution.dispatch()
#         component.__related__ = {}
#         execution.__related__ = {}
#         component.execution == execution
#         component.__related__ = {}
#         execution.__related__ = {}
#         execution.components[0] == component


# def test_element_search(tmp_storage):
#     with Project("./tests/samples/project"):
#         exp1 = Component.make("dummy", {"a": 1})
#         exp1.launch()
#         exp2 = Component.make("dummy", {"a": 2})
#         exp2.launch()
#         assert Component.find(exp1.id).timestamp == exp1.timestamp
#         assert Component.find_by_predicate("non-existing").empty()
#         assert (
#             Component.find_by_predicate("dummy", predicate=None).count() == 2
#         )
#         # singleton
#         assert (
#             Component.singleton("dummy", {"a": 2}).timestamp == exp2.timestamp
#         )
#         assert (
#             Component.singleton("dummy", {"a": 2, "ignore_me_": 3}).timestamp
#             == exp2.timestamp
#         )
#         assert (
#             Component.singleton("dummy", {"a": 2}).timestamp == exp2.timestamp
#         )
#         n = Component.singleton("dummy", {"a": 3})
#         n.launch()
#         assert n.id != exp2.id
#         assert (
#             n.id
#             == Component.singleton("dummy", {"a": 3}).id
#         )


# def test_element_interface(tmp_storage):
#     component = Component()
#     component.launch()
#     # save and load
#     component.save_file("test.txt", "hello")
#     assert component.load_file("test.txt") == "hello"
#     component.save_data("floaty", 1.0)
#     assert component.load_data("floaty") == "1.0"
#     uncommitted = Element()
#     uncommitted.save_data("test", "deferred")
#     assert uncommitted.load_data("test") == "deferred"


# def test_element_interactive_session(tmp_storage):
#     class T(Component):
#         def is_valid(self):
#             return True

#     t = get(T)
#     assert t.module == "__session__T"
#     assert t.__model__._dump is not None

#     # default launch
#     t.launch()
#     # serialization
#     exec(t.dispatch_code(inline=False) + "\nassert component__.is_valid()")
#     # retrieval
#     assert t.id == get(T).id
