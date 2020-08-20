import os
import sys

import pytest

import machinable as ml
from machinable import Component, Storage
from machinable.core.component import inject_components


def test_core_config_method():
    assert ml.execute("configmethods", project="./test_project").failures == 0


def test_on_iterate():
    class TestIterate(ml.Component):

        ITER = 0
        USE_RECORDS = False

        def on_execute_iteration(self, iteration):
            self.ITER = iteration

            if self.USE_RECORDS:
                self.record["hello"] = iteration
            if iteration == 5:
                return StopIteration

    iterator = TestIterate()
    iterator.dispatch([], Storage({"component": "1235"}).config)
    iterator.create()
    iterator.execute()

    # iteration working
    assert iterator.ITER == 5

    # there should be no records
    assert "default" not in iterator.store._record_writers

    # repeat with records writing
    iterator = TestIterate()
    iterator.dispatch([], Storage({"component": "12345"}).config)
    iterator.create()
    iterator.USE_RECORDS = True
    iterator.execute()

    # records should now be available
    assert "default" in iterator.store._record_writers
    # records should be empty because they have been saved
    assert iterator.record.empty()
    # there should be 5 records
    assert len(iterator.record.history) == 6
    # they should contain _iteration
    print(iterator.record.history)
    for i in range(len(iterator.record.history)):
        assert iterator.record.history[i]["_iteration"] == i


def test_interaction():
    ml.execute(
        ml.Experiment().components("thenode", "workers.interactive"),
        project="./test_project",
    )


def test_component_injection():
    class DummyChild(ml.Component):
        def __init__(self, should_be_created=True, attribute=None):
            super().__init__()
            self.attribute_ = attribute
            self.should_be_created = should_be_created

        def create(self):
            assert self.should_be_created

    class TestInject(ml.Component):
        def on_create_no_params(self):
            pass

        def on_create_manual(self, node, first, _second, third):
            assert node is None
            assert isinstance(first, DummyChild)
            assert isinstance(_second, DummyChild)
            assert isinstance(third, DummyChild)

        def on_create_manual_with_node(self, node, first, _second, third):
            assert isinstance(node, DummyChild)
            assert isinstance(first, DummyChild)
            assert isinstance(_second, DummyChild)
            assert isinstance(third, DummyChild)

    # components are created automatically with suggested attribute_
    t = TestInject()
    assert inject_components(
        t, [DummyChild(), DummyChild(attribute="model")], t.on_create_no_params
    )
    assert isinstance(t.model, DummyChild)

    # components are created based on signature
    t = TestInject(node=DummyChild(attribute="experiment"))
    assert inject_components(
        t, [DummyChild(), DummyChild(False), DummyChild()], t.on_create_manual_with_node
    )


def test_exception_handling():
    sys.path.insert(0, os.path.join(os.getcwd(), "test_project"))
    from test_project.failure.exceptions import ExceptionsComponent

    ex = ExceptionsComponent()
    status = ex.dispatch([], {"components": "12345"})
    assert isinstance(status, ml.core.exceptions.ExecutionException)

    ml.execute(
        ml.Experiment().components("failure.exceptions"), project="./test_project"
    )

    # a failure does not crash others
    import ray

    ray.init(ignore_reinit_error=True)
    ml.execute(
        ml.Experiment()
        .components("failure.exceptions")
        .components("thenode")
        .repeat(2),
        project="./test_project",
    )


def test_mixins():
    # set test project path
    sys.path.insert(0, os.path.join(os.getcwd(), "test_project"))

    # config only mixin
    component = Component({"_mixins_": ["extended", "+.fooba.test"]}, {})
    assert getattr(component, "extended", True)
    assert getattr(component, "fooba_test", True)

    # module mixins

    component = Component(
        {"_mixins_": ["mixin_module", "+.fooba.mixins.nested"]}, {"BOUND": "component"}
    )
    assert getattr(component, "_mixin_module_", None) is not None
    assert (
        component._mixin_module_.is_bound("correctly") == "bound_to_component_correctly"
    )
    with pytest.raises(AttributeError):
        component._mixin_module_.non_existent("call")

    assert getattr(component, "_fooba_mixins_nested_", None) is not None
    assert component._fooba_mixins_nested_.hello() == "component"
    with pytest.raises(AttributeError):
        component._fooba_mixins_nested_.non_existent("call")

    assert component._mixin_module_.key_propery == 1

    # de-alias via origin
    config = {
        "_mixins_": [
            "mixin_module",
            "+.fooba.mixins.nested",
            {"name": "+.fooba.nested", "origin": "+.fooba.mixins.nested"},
        ]
    }
    component = Component(config, {"BOUND": "component"})
    assert (
        component._mixin_module_.is_bound("correctly") == "bound_to_component_correctly"
    )

    # this-referencing
    assert (
        component._mixin_module_.this_reference("correctly")
        == "bound_to_component_and_referenced_correctly"
    )
    assert component._mixin_module_.this_attribute() == "works"
    assert component._mixin_module_.this_static("works") == "works"


def test_hidden_mixins():
    sys.path.insert(0, os.path.join(os.getcwd(), "test_project"))

    # hidden mixins that are only part of the imported project but not referenced in the project that imports them
    assert (
        ml.execute(
            ml.Experiment().components("inherited_mixin"), project="./test_project"
        ).failures
        == 0
    )
    assert (
        ml.execute(
            ml.Experiment().components("direct_mixin_inheritance"),
            project="./test_project",
        ).failures
        == 0
    )
