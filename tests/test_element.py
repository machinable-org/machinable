import machinable as ml
from machinable import Execution, Experiment, Project
from machinable.element import Connectable


def test_element_views():
    element = Experiment("")
    view = "tests.samples.project.views.basic"
    assert element[view].hello() == "there"
    instance = element[view]
    instance.get_state() is None
    instance.set_state("test")
    assert element[view].get_state() is None
    instance.get_state() == "test"

    assert Experiment[view]("dummy").hello() == "there"

    # @-alias notation
    with Project("./tests/samples/project"):
        assert Execution["@example"]().is_extended


def test_connectable():
    class Dummy(Connectable):
        pass

    dummy_1 = Dummy()
    dummy_2 = Dummy()

    with dummy_1:
        assert Dummy.get() is dummy_1
    assert Dummy.get() is not dummy_1
    assert Dummy.get() is not dummy_2

    dummy_1.connect()
    assert Dummy.get() is dummy_1
    with dummy_2:
        assert Dummy.get() is dummy_2
    assert Dummy.get() is dummy_1
    dummy_1.close()
    assert Dummy.get() is not dummy_1
    assert Dummy.get() is not dummy_2

    with dummy_1:
        with dummy_2:
            with Dummy() as dummy_3:
                assert Dummy.get() is dummy_3
                dummy_3.close()
                assert Dummy.get() is not dummy_3
                assert Dummy.get() is not dummy_2
                assert Dummy.get() is not dummy_1
            assert Dummy.get() is dummy_2
        assert Dummy.get() is dummy_1
    assert Dummy.get() is not dummy_1


def test_element_relations(tmp_path):
    ml.Repository(
        "machinable.storage.filesystem_storage", {"directory": str(tmp_path)}
    ).connect()
    ml.Project("./tests/samples/project").connect()

    experiment = ml.Experiment("basic")
    execution = ml.Execution().add(experiment)
    execution.dispatch(grouping="test/grouping")

    # experiment <-> execution
    assert int(execution.timestamp) == int(experiment.execution.timestamp)
    assert experiment.experiment_id == execution.experiments[0].experiment_id
    # grouping <-> execution
    assert execution.grouping.group == "test/grouping"
    assert execution.grouping.executions[0].nickname == execution.nickname

    # invalidate cache and reconstruct
    experiment.__related__ = {}
    execution.__related__ = {}
    # experiment <-> execution
    assert int(execution.timestamp) == int(experiment.execution.timestamp)
    assert experiment.experiment_id == execution.experiments[0].experiment_id
    # grouping <-> execution
    assert execution.grouping.group == "test/grouping"
    assert execution.grouping.executions[0].nickname == execution.nickname
