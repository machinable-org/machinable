import machinable as ml


def test_execution():
    with ml.Project("./tests/samples/project"):
        execution = ml.Execution()
        execution.add(ml.Experiment("dummy"))
        assert len(execution.experiments) == 1
