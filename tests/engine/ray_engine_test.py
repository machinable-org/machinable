import machinable as ml


def test_ray_engine():
    t = ml.Experiment().components("thenode", "thechildren").repeat(2)
    ml.execute(t, engine="ray", project="./test_project")


def test_ray_engine_tune(tmp_path):
    import ray
    from ray import tune

    ray.init(ignore_reinit_error=True)
    ml.execute(
        ml.Experiment()
        .components("tunemodel")
        .tune(
            stop={"acc": 0.5}, config={"lr": tune.grid_search([0.001, 0.01])}
        ),
        engine="ray",
        storage=tmp_path / "tune",
        project="./test_project",
    )
