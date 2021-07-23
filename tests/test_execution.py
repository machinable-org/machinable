import machinable as ml


def test_execution():
    with ml.Project("./tests/samples/project"):
        execution = ml.Execution().add(ml.Experiment("dummy"))
        assert len(execution.experiments) == 1
        assert isinstance(execution.timestamp, float)
        assert isinstance(execution.nickname, str)
        assert isinstance(execution.seed, int)

        execution = ml.Execution.local().add(ml.Experiment("dummy"))
        assert len(execution.experiments) == 1
