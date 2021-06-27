import machinable as ml
from pydantic.errors import ExtraError


def test_end_to_end_execution(tmp_path):
    ml.Repository(
        "machinable.storage.filesystem_storage", {"directory": str(tmp_path)}
    ).connect()
    ml.Project("./tests/samples/project").connect()

    experiment = ml.Experiment("interfaces.interrupted_lifecycle")
    experiment.execute(version={"processes": None}, grouping="a/b/c")

    assert experiment.is_started()
    assert not experiment.is_finished()
    assert len(experiment.records()) == 3

    # resume
    experiment.execution.engine().dispatch()
    assert len(experiment.records()) == 7

    experiment.execution.engine().dispatch()
    assert len(experiment.records()) == 10
    assert experiment.is_finished()

    assert [r["step"] for r in experiment.records()] == list(range(10))
