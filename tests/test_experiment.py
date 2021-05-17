import machinable as ml
import pytest


def test_experiment():
    ml.Project("./tests/project")
    experiment = ml.Experiment("dummy")
    assert isinstance(str(experiment), str)
    assert isinstance(repr(experiment), str)

    # uses
    assert len(experiment.add("dummy")._components) == 1
