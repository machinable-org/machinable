import os

import machinable as ml
from machinable.engine import Engine

from helpers import fake_observation_config
from machinable.core.core import inject_components


def test_on_iterate():

    class TestIterate(ml.Component):

        ITER = 0
        USE_RECORDS = False

        def on_execute_iteration(self, iteration):
            self.ITER = iteration

            if self.USE_RECORDS:
                self.record['hello'] = iteration
            if iteration == 5:
                return StopIteration

    iterator = TestIterate()
    iterator.dispatch([], fake_observation_config())
    iterator.create()
    iterator.execute()

    # iteration working
    assert iterator.ITER == 5

    # there should be no records
    assert 'default' not in iterator.observer._record_writers

    # repeat with records writing
    iterator = TestIterate()
    iterator.dispatch([], fake_observation_config())
    iterator.create()
    iterator.USE_RECORDS = True
    iterator.execute()

    # records should now be available
    assert 'default' in iterator.observer._record_writers
    # records should be empty because they have been saved
    assert iterator.record.empty()
    # there should be 5 records
    assert len(iterator.record.history) == 6
    # they should contain _iteration
    print(iterator.record.history)
    for i in range(len(iterator.record.history)):
        assert iterator.record.history[i]['_iteration'] == i


def test_interaction():
    e = Engine(os.path.abspath('test_project'))
    ml.execute(ml.Task().component('thenode', 'workers.interactive'), engine=e)


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

    # children are created automatically with suggested attribute_
    t = TestInject()
    assert inject_components(t, [DummyChild(), DummyChild(attribute='model')], t.on_create_no_params)
    assert isinstance(t.model, DummyChild)

    # children are created based on signature
    t = TestInject(node=DummyChild(attribute='experiment'))
    assert inject_components(t, [DummyChild(), DummyChild(False), DummyChild()], t.on_create_manual_with_node)


def test_exception_handling():
    from test_project.failure.exceptions import ExceptionsComponent

    ex = ExceptionsComponent()
    status = ex.dispatch([], fake_observation_config())
    assert isinstance(status, ml.core.exceptions.ExecutionException)

    e = Engine(os.path.abspath('test_project'))
    ml.execute(ml.Task().component('failure.exceptions'), engine=e)

    # a failure does not crash others
    import ray
    ray.init(ignore_reinit_error=True)
    ml.execute(ml.Task().component('failure.exceptions').component('thenode').repeat(2), engine=e)
