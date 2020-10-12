import os

import numpy as np
import pytest

from machinable import Storage
from machinable.storage import get_experiment

STORAGE_DIRECTORY = "./_test_data/storage"


def get_path(path=""):
    return os.path.join(STORAGE_DIRECTORY, path)


def test_storage_interface():
    storage = Storage(url=STORAGE_DIRECTORY, experiment="tttttt")
    assert isinstance(storage.config, dict)
    assert storage.config["url"] == "osfs://" + STORAGE_DIRECTORY
    with pytest.raises(ValueError):
        Storage(directory="/absolute path")
    assert storage.get_url() == "osfs://" + get_path("tttttt/")
    assert storage.get_local_directory() == get_path("tttttt/")
    assert storage.get_path() == "tttttt/"
    assert storage.get_component() is None
    c = storage.get_experiment().components.first()
    storage = Storage(
        url=STORAGE_DIRECTORY, experiment="tttttt", component=c.component_id
    )
    storage.log.info("test")
    assert isinstance(len(storage.record), int)
    assert storage.get_component() is not None
    assert storage.get_experiment() is not None
    assert isinstance(storage.has_log(), bool)
    assert isinstance(storage.has_records(), bool)

    storage.save_data("test.txt", "test me")
    f = os.path.join(
        storage.config["experiment"], storage.config["component"], "data", "test.txt"
    )
    assert storage.get_stream(f).readline() == "test me"
    storage.save_data("test.npy", np.ones([5]))
    storage.save_data("test.p", np.ones([5]))
    storage.save_data("test.json", [1, 2, 3])
    storage.save_data("dir/test.txt", "subdirectory")
    f = os.path.join(
        storage.config["experiment"],
        storage.config["component"],
        "data",
        "dir/test.txt",
    )
    assert storage.get_stream(f).readline() == "subdirectory"

    storage.record["test"] = 1
    assert storage.record["test"] == 1


def test_storage_experiment():
    o = get_experiment(get_path("tttttt/"))
    assert o.experiment_id == "tttttt"
    assert o.experiment_name is None
    assert o.project_name == "test_project"
    assert o.url == "osfs://" + get_path("tttttt/")
    assert o.components.first().config.test
    assert o.host.test_info == "test_info"
    assert o.host.test_info_static == "static_test_info"
    assert len(o.host) == 10
    assert len(o.components) == 4

    experiments = o.experiments
    assert len(experiments) >= 2
    assert len(experiments.filter(lambda x: x.experiment_id == "SUBEXP")) == 1
    assert all(experiments.transform(lambda x: x.ancestor.experiment_id == "tttttt"))
    assert o.ancestor is None


def test_storage_component():
    comp = get_experiment(get_path("tttttt")).components.first()
    assert comp.experiment.experiment_id == "tttttt"
    assert comp.experiment.code_version.project.path.endswith("machinable.git")
    assert comp.flags.NAME == "nodes.observations"
    assert comp.config.to_test == "observations"
    assert len(comp.components) == 0
    assert comp.data("data.json")["observation_id"] > 0
    assert len(comp.host) == 10
    assert len(comp.get_records()) == 2
    records = comp.records
    custom = comp.get_records("validation")
    assert custom.sum("iteration") == 15
    assert records.as_dataframe().size > 0

    comp = get_experiment(get_path("subdirectory/TTTTTT"))
    assert comp.components.first().experiment.experiment_id == "TTTTTT"
