from machinable import Experiment


def test_experiment():
    experiment = Experiment("test")
    assert isinstance(str(experiment), str)
    assert isinstance(repr(experiment), str)

    # uses
    assert len(experiment.components) == 0
    assert experiment.uses("uses").components == [("uses", None, None)]
