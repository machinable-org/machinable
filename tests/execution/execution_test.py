import os

from machinable import Component, Execution, Experiment, execute


def test_execution_from_storage():
    e = Execution.from_storage("./_test_data/storage/tttttt")
    e.filter(lambda i, component, _: component == "4NrOUdnAs6A5")
    e.submit()


def test_execution_decorators():
    t = Experiment().components("thenode", "thechildren")

    @execute
    def run(component, components, storage):
        assert component.config.alpha == 0
        storage.log.info(
            "Custom training with learning_rate=" + str(component.config.a)
        )
        assert components[0].config.alpha == 0

    assert run(t, seed=1, project="./test_project").failures == 0

    @Execution
    def run_2(component, components, storage):
        assert component.config.alpha == 0
        storage.log.info("Execution decorator")
        assert components[0].config.alpha == 0

    assert run_2(t, seed=1, project="./test_project").submit().failures == 0

    @execute
    class Test(Component):
        def config_through_config_method(self, arg):
            return arg

    assert Test(t, seed=1, project="./test_project").failures == 0

    @Execution
    class Test_2(Component):
        def config_through_config_method(self, arg):
            return arg

    assert Test_2(t, seed=1, project="./test_project").submit().failures == 0


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
