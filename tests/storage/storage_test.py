import pytest

import machinable as ml

STORAGE_DIRECTORY = "./_test_data/storage"


def test_storage_interface():
    storage = ml.Storage(STORAGE_DIRECTORY)
    # storage
    storage.reset()
    assert len(storage._index["url"]) == 0
    storage.add(STORAGE_DIRECTORY)
    assert len(storage._index["url"]) == 1
    # re-add does not re-add
    for k in range(3):
        storage.add(STORAGE_DIRECTORY)
    assert len(storage._index["url"]) == 1

    # standard queries
    assert storage.find("tttttt").components.first().config.test
    assert len(storage.find("tttttt").components) == 4
    assert len(storage.find_all()) == 4


def test_storage_component_interface():
    comp = ml.Storage(STORAGE_DIRECTORY).find("tttttt").components.first()
    assert comp.experiment.id == "tttttt"
    assert comp.experiment.code_version.project.path is None
    assert comp.flags.NAME == "nodes.observations"
    assert comp.config.to_test == "observations"
    assert comp.schedule.component.args.to_test == comp.config.to_test
    assert len(comp.components) == 0
    assert comp.store("data.json")["observation_id"] > 0
    assert comp.store("test") == 2
    assert comp.store("key") == "value"
    assert "test" in comp.store()
    assert len(comp.store()["$files"])
    assert len(comp.host) == 8
    assert len(comp.get_records_writer()) == 2

    comp = ml.Storage(STORAGE_DIRECTORY).find("TTTTTT")
    assert comp.components.first().experiment.id == "TTTTTT"


def test_storage_records_interface():
    obs = ml.Storage(STORAGE_DIRECTORY).find("tttttt").components.first()
    records = obs.records
    custom = obs.get_records_writer("validation")
    assert custom.sum("iteration") == 15
    assert records.as_dataframe().size > 0


def test_collections():
    task = ml.Storage(STORAGE_DIRECTORY).find("tttttt")
    import numpy as np

    def o(x):
        return x.records.pluck("number")

    assert max(task.components.section(o, reduce=np.var)) > 0
    # df = task.components.as_dataframe()
    # assert df.size == 4 * 12
    r = task.components.first().records
    num_elements = len(r.pluck("number"))
    with pytest.raises(KeyError):
        r.pluck("not_existing")
    nones = r.pluck_or_none("not_existing")
    assert all([e is None for e in nones])
