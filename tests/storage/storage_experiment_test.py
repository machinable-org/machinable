from machinable.storage.experiment import ExperimentStorage


def test_storage_experiment_interface():
    o = ExperimentStorage("./test_data/storage/tttttt")
    assert o._path == "tttttt"
    assert o.url == "osfs://./test_data/storage/tttttt"
    o = ExperimentStorage("./test_data/storage/tttttt/tbAXUwxGJzA8")
    assert o._path == "tttttt"
    assert o.url == "osfs://./test_data/storage/tttttt"
