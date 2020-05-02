import machinable as ml


def test_detached_engine():
    t = ml.Experiment().component("thenode", {"v": 1})
    # smoke test
    execution = ml.Execution(
        t, engine=ml.engine.Detached(using="tmux"), project="./test_project",
    ).submit()
