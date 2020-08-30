import os

import pytest

from machinable import Storage
from machinable.storage import get_experiment
from machinable.storage.experiment import StorageExperiment

STORAGE_DIRECTORY = "./_test_data/storage"


def get_path(path):
    return os.path.join(STORAGE_DIRECTORY, path)


def test_storage_interface():
    storage = Storage(STORAGE_DIRECTORY)
    assert isinstance(storage.config, dict)
    assert storage.config["url"] == "osfs://" + STORAGE_DIRECTORY


def test_storage_experiment():
    with pytest.raises(ValueError):
        # non-existent
        StorageExperiment("./_test_data/storage/tttttt/tbAXUwxGJzA8")

    o = StorageExperiment.get("./_test_data/storage/tttttt")
    assert o.experiment_id == "tttttt"
    assert o.url == "osfs://./_test_data/storage/tttttt"
    assert o.components.first().config.test
    assert len(o.components) == 4

    experiments = o.experiments
    assert len(experiments) >= 2
    assert len(experiments.filter(lambda x: x.experiment_id == "SUBEXP")) == 1
    assert all(experiments.transform(lambda x: x.ancestor.experiment_id == "tttttt"))
    assert o.ancestor is None


def test_component_storage():
    comp = get_experiment(get_path("tttttt")).components.first()
    assert comp.experiment.experiment_id == "tttttt"
    assert comp.experiment.code_version.project.path.endswith("machinable.git")
    assert comp.flags.NAME == "nodes.observations"
    assert comp.config.to_test == "observations"
    assert len(comp.components) == 0
    assert comp.store("data.json")["observation_id"] > 0
    assert comp.store("test") == 2
    assert comp.store("key") == "value"
    assert "test" in comp.store()
    assert len(comp.store()["__files"])
    assert len(comp.host) == 9
    assert len(comp.get_records()) == 2

    comp = get_experiment(get_path("subdirectory/TTTTTT"))
    assert comp.components.first().experiment.experiment_id == "TTTTTT"


def test_storage_component_records():
    comp = get_experiment(get_path("tttttt")).components.first()
    records = comp.records
    custom = comp.get_records("validation")
    assert custom.sum("iteration") == 15
    assert records.as_dataframe().size > 0


def test_collections():
    experiment = get_experiment(get_path("tttttt"))
    import numpy as np

    def o(x):
        return x.records.pluck("number")

    assert max(experiment.components.section(o, reduce=np.var)) > 0
    # df = task.components.as_dataframe()
    # assert df.size == 4 * 12
    r = experiment.components.first().records
    num_elements = len(r.pluck("number"))
    with pytest.raises(KeyError):
        r.pluck("not_existing")
    nones = r.pluck_or_none("not_existing")
    assert all([e is None for e in nones])
