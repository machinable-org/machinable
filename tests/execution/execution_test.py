import machinable as ml


def test_execution_from_storage():
    e = ml.Execution.from_storage("./_test_data/storage/tttttt")
    e.filter(lambda i, component, _: component == "4NrOUdnAs6A5")
    e.submit()
