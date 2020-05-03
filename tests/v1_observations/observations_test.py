import os
import shutil

import pytest

import machinable.v1 as ml
from machinable.v1.history import get_history

from .generator import generate_data

observations_directory = None


def _setup(debug=False):
    global observations_directory

    # generate data if not available
    if observations_directory is None:
        observations_directory = generate_data(debug=debug)

    mlo = ml.Observations()
    mlo.add(observations_directory)
    return mlo


def _reset_settings():
    config_directory = os.path.expanduser("~/.machinable")
    shutil.rmtree(config_directory, ignore_errors=True)


def test_observations():
    mlo = _setup(debug=False)

    # storages
    mlo.reset()
    assert len(mlo.storages) == 0
    mlo.add(observations_directory)
    assert len(mlo.storages) == 1
    # re-add does not re-add
    for k in range(3):
        mlo.add(observations_directory)
    assert len(mlo.storages) == 1
    assert mlo.remove("never added") is None
    assert len(mlo.storages) == 1
    mlo.remove(observations_directory)
    assert len(mlo.storages) == 0
    mlo.add(observations_directory)

    # standard queries
    assert mlo.find("4NrOUdnAs6A5").config.test
    assert len(mlo.find_by_task("tttttt")) == 4
    assert len(mlo.find_by_task(["tttttt"])) == 4
    assert len(mlo.find_by_node_component("nodes.observations")) == 0
    # len(mlo.find_all())
    assert len(mlo.find_by_most_recent_task()) == 4
    assert len(mlo.find_by_execution(mlo.find("tttttt").first().execution_id)) == 4
    assert len(mlo.find_by_execution(mlo.find("tttttt"))) == 4

    # query builder
    assert len(mlo.query.where_task("tttttt").get()) == 4

    # collections
    assert (
        mlo.find_by_task("tttttt").where("config.to_test", "observations").count() == 4
    )


def test_observation_view():
    mlo = _setup(debug=False)
    observation = mlo.query.where_task("tttttt").first()
    assert observation.storage.endswith("/test_data")
    assert observation.execution_id == observation.task.execution_id
    assert observation.task.id == "tttttt"
    assert observation.task.code_version.project.path is None
    assert observation.flags.NAME == "nodes.observations"
    assert observation.config.to_test == "observations"
    assert len(observation.components) == 0
    assert observation.store("data.json")["observation_id"] > 0
    assert observation.store("test") == 2
    assert observation.store("key") == "value"
    assert "test" in observation.store()
    assert len(observation.store()["$files"])
    assert len(observation.host) == 6
    assert len(observation.get_records_writer()) == 2
    # aliases
    o = mlo.find_by_task_name("second").first()
    # assert o.custom_child_attribute.config.alpha == 0
    # assert o.custom_child_attribute.components == "thechildren"


def test_records_view():
    mlo = _setup(debug=False)
    obs = mlo.query.where_task("tttttt").first()
    records = obs.records
    assert len(records.query.where("constant", ">=", 40).get()) == 6
    # custom records scope
    custom = obs.get_records_writer("validation")
    assert custom.sum("iteration") == 15
    assert records.as_dataframe().size > 0


def test_collections():
    mlo = _setup(debug=False)
    task = mlo.query.where_task("tttttt").get()
    import numpy as np

    def o(x):
        return x.records.pluck("number")

    assert max(task.section(o, reduce=np.var)) > 0
    df = mlo.find_by_task("tttttt").as_dataframe()
    assert df.size == 4 * 12
    print(df.dtypes)
    obs = mlo.query.where_task("tttttt").first()
    num_elements = len(obs.records.pluck("number"))
    with pytest.raises(KeyError):
        obs.records.pluck("not_existing")
    nones = obs.records.pluck_or_none("not_existing")
    assert all([e is None for e in nones])


def test_history():
    h = get_history(file="_test_history")
    h.reset()

    h.add("test")
    assert os.path.isfile(h.url)
    assert len(h) == 1
    h.add("test")
    assert len(h) == 1
    assert len(h.available()) == 0
    h.add("")
    h.add(" ")
    h.add("  ")
    assert len(h) == 1
    h.reset()
    # horizon
    for i in range(200):
        h.add(str(i))
    assert len(h) == 15
    assert sum(map(int, h.data)) == 2880

    h2 = get_history(reload=True, file="_test_history")
    assert len(h2) == 15
    h2.add("")
    assert len(h2) == 15
