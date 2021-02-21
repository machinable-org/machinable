import machinable as ml
from machinable.utils.graphql import client


def test_storage():
    ml.Storage.connect("tmp/")

    experiment = ml.Experiment.find("wmzFN0")
