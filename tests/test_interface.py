from machinable import Execution, Experiment, Project, Storage
from machinable.grouping import Grouping


def test_interface(tmp_path):
    Project("tests/samples/project").connect()

    # test dispatch lifecycle
    experiment = Experiment("components.interface_check")

    experiment.__model__._storage_instance = Storage.make(
        "machinable.storage.filesystem_storage",
        {"directory": str(tmp_path)},
    )
    experiment.__model__._storage_id = str(tmp_path)

    experiment.interface().dispatch(experiment)
    assert len(experiment.load_data("events.json")) == 6
