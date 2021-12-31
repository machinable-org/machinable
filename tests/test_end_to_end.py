import machinable as ml
from machinable import errors


def test_end_to_end_execution(tmp_path):
    ml.Storage.make(
        "machinable.storage.filesystem_storage", {"directory": str(tmp_path)}
    ).connect()
    ml.Project("./tests/samples/project").connect()

    experiment = ml.Experiment.make(
        "interfaces.interrupted_lifecycle", group="a/b/c"
    )
    try:
        experiment.execute(version={"processes": None})
    except errors.ExecutionFailed:
        pass

    assert experiment.is_started()
    assert not experiment.is_finished()
    assert len(experiment.records()) == 3

    # resume
    try:
        experiment.execution.dispatch()
    except errors.ExecutionFailed:
        pass
    assert len(experiment.records()) == 7

    experiment.execution.dispatch()
    assert len(experiment.records()) == 10
    assert experiment.is_finished()

    assert [r["step"] for r in experiment.records()] == list(range(10))
