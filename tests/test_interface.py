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

    # uses
    experiment = Experiment("interfaces.uses_components")
    interface = experiment.interface()
    interface.dispatch(experiment)
    assert interface.test.__module__ == "basic"
    assert interface.dummy.config.alpha == 1
    assert interface.dummy.config.beta.test
    assert interface.optional is None

    # test that default uses are being overwritten
    experiment = Experiment("interfaces.uses_components")
    experiment.use(dummy="dummy", optional="basic")
    interface = experiment.interface()
    interface.dispatch(experiment)
    assert interface.test.__module__ == "basic"
    assert interface.dummy.config.alpha == 0
    assert interface.dummy.config.beta.test is None
    assert interface.optional.__module__ == "basic"
