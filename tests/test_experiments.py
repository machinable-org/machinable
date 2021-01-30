import pytest
from machinable import Experiment
from machinable.utils.testing import element_test


def test_experiment():
    experiment = Experiment("test")
    element_test(experiment)

    # seeding
    Experiment(seed=42)
    Experiment(seed="TTTTTT")
    with pytest.raises(ValueError):
        Experiment(seed="invalid")

    print(experiment.__attributes__)

    # uses
    assert len(experiment.uses) == 0
    assert experiment.use("test").uses == [("test", None, None)]
