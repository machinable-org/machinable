import pytest

import machinable as ml


def test_ray_engine():
    t = ml.Experiment().components("thenode", "thechildren").repeat(2)
    ml.execute(t, engine="ray", project="./test_project")


@pytest.mark.last
def test_ray_engine_tune():
    import ray
    from ray import tune

    ray.init(ignore_reinit_error=True)
    ml.execute(
        ml.Experiment()
        .components("tunemodel")
        .tune(stop={"acc": 0.5}, config={"lr": tune.grid_search([0.001, 0.01])}),
        engine="ray",
        storage="./_test_data/tune",
        project="./test_project",
    )
