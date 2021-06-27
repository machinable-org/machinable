from os import replace

from machinable import Execution, Experiment, Project, Storage
from machinable.grouping import Grouping
from pydantic.errors import IntEnumError


def test_interface(tmp_path):
    Project("tests/samples/project").connect()

    # test dispatch lifecycle
    experiment = Experiment("components.interface_check")

    experiment.__model__._storage_instance = Storage.make(
        "machinable.storage.filesystem_storage",
        {"directory": str(tmp_path)},
    )
    experiment.__model__._storage_id = str(tmp_path)

    experiment.interface().dispatch()
    assert len(experiment.load_data("events.json")) == 6

    # uses
    experiment = Experiment("interfaces.uses_components")
    interface = experiment.interface()
    interface.dispatch()
    assert interface.test.__module__ == "basic"
    assert interface.dummy.config.alpha == 1
    assert interface.dummy.config.beta.test
    assert interface.optional is None
    assert interface.experiment is experiment
    assert len(interface.components) == 2
    assert interface.dummy.parent is interface

    # test that default uses are being overwritten
    experiment = Experiment("interfaces.uses_components")
    experiment.use(dummy="dummy", optional="basic")
    interface = experiment.interface()
    interface.dispatch()
    assert interface.test.__module__ == "basic"
    assert interface.dummy.config.alpha == 0
    assert interface.dummy.config.beta.test is None
    assert interface.optional.__module__ == "basic"
    assert interface.experiment is experiment
    assert len(interface.components) == 3
    assert interface.dummy.parent is interface

    # test nested use
    experiment = Experiment("interfaces.uses_components")
    experiment.use(nested="components.nested_use", overwrite=True)
    interface = experiment.interface()
    interface.dispatch()
