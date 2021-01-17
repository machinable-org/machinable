from machinable import Execution, Experiment


def test_execution():
    execution = Execution(project="./tests/project")
    execution.set_experiment(Experiment("dummy"))
    assert len(execution.experiments) == 1
    assert isinstance(
        execution.experiments.first()["component"]["config"], dict
    )
