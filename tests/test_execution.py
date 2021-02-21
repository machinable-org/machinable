import machinable as ml


def test_execution():
    ml.Project.connect("./tests/project")

    execution = ml.Execution()
    execution.add_experiment(ml.Experiment("dummy"))
    assert len(execution.experiments) == 1

    ml.Storage.connect("tmp/")

    execution = ml.Execution(
        repository="test_repo",
        engine="native:None",
    )
    execution.add_experiment(ml.Experiment("dummy"))
    execution.submit()
