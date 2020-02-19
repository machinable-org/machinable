import os

import pytest
import machinable as ml
from machinable.engine import Engine


@pytest.mark.last
def test_tune_execution():
    import ray
    from ray import tune
    ray.init(ignore_reinit_error=True)
    e = Engine(os.path.abspath('test_project'), mode='DEFAULT')
    ml.execute(ml.Task().component('tunemodel').tune(
        stop={'acc': 0.5},
        config={
            "lr": tune.grid_search([0.001, 0.01])
        }),
        storage='./observations/test_data/tune',
        engine=e)
    ray.shutdown()
