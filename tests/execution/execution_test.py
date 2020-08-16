import os

from machinable import Execution, Experiment, execute


def test_execution_from_storage():
    e = Execution.from_storage("./_test_data/storage/tttttt")
    e.filter(lambda i, component, _: component == "4NrOUdnAs6A5")
    e.submit()


def test_execute_decorator():
    @execute
    def run(node, components, store):
        assert node.config.alpha == 0
        store.log.info("Custom training with learning_rate=" + str(node.config.a))
        assert components[0].config.alpha == 0

    t = Experiment().components("thenode", "thechildren")
    run(t, seed=1, project="./test_project")


def test_execution_setters():
    e = Execution.from_storage("./_test_data/storage/tttttt")
    e.set_version("{ 'a': 1 }")
    e.set_checkpoint("/test")


def test_execution_continuation():
    experiment = Experiment().component("nodes.continuation")
    execution = Execution(
        experiment=experiment,
        storage="./_test_data/storage/tttttt",
        project="./test_project",
    )
    execution.submit()
    assert execution.schedule._result[0] is None  # no exception occurred
    assert os.path.isdir(
        f"./_test_data/storage/tttttt/experiments/{execution.experiment_id}"
    )
    assert execution.storage.config["ancestor"]["url"].endswith(
        "_test_data/storage/tttttt"
    )
