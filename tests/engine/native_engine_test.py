import machinable as ml


def test_native_engine():
    t = ml.Experiment().components("thenode", "thechildren").repeat(2)
    ml.execute(t, engine=None, project="./test_project")


def test_native_engine_multiprocessing():
    t = ml.Experiment().components("thenode", "thechildren").repeat(5)
    ml.execute(t, engine="native:1", project="./test_project")
    # failure
    t = ml.Experiment().components("failure.exceptions").repeat(5)
    ml.execute(t, engine="native:1", project="./test_project")
