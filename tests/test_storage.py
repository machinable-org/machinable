import machinable as ml


def test_storage():
    ml.Storage.connect("tmp/")

    exp = ml.Experiment.find("sdf")

    print(exp, "sfddsf")
