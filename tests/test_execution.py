import machinable as ml


def test_execution():
    with ml.Project("./tests/samples/project"):
        execution = ml.Execution().add(ml.Experiment("dummy"))
        assert len(execution.experiments) == 1
        assert isinstance(execution.timestamp, float)

        experiment = ml.Experiment("dummy")
        execution = ml.Execution.local().add(experiment)
        assert len(execution.experiments) == 1
