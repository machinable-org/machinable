import machinable as ml


def test_execution():
    execution = ml.Execution(project="./tests/project")
    execution.set_experiment(ml.Experiment("dummy"))
    assert len(execution.experiments) == 1

    ml.Storage.connect("tmp/")

    execution = ml.Execution(
        project="./tests/project",
        repository="bla",
        engine="native:None",
    )
    execution.add_experiment(ml.Experiment("dummy"))
    execution.submit()
