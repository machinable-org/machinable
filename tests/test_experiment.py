import machinable as ml
import pytest


def test_experiment():
    ml.Project.connect("./tests/project")
    experiment = ml.Experiment("dummy")
    assert isinstance(str(experiment), str)
    assert isinstance(repr(experiment), str)

    # uses
    assert len(experiment.components) == 1
    assert len(experiment.use("dummy").components) == 2
