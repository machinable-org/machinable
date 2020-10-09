import os

import numpy as np

from machinable import Experiment, Storage, execute
from machinable.store import Store


def test_store_writer():
    store = Store(
        component=None,
        config=Storage({"experiment": "ABCDEF", "component": "12345"}).config,
    )

    # write
    store.save_data("test.txt", "test me")
    f = os.path.join(
        store.config["experiment"], store.config["component"], "data", "test.txt"
    )
    assert store.filesystem.readtext(f) == "test me"
    store.save_data("test.npy", np.ones([5]))
    store.save_data("test.p", np.ones([5]))
    store.save_data("test.json", [1, 2, 3])
    store.save_data("dir/test.txt", "subdirectory")
    f = os.path.join(
        store.config["experiment"], store.config["component"], "data", "dir/test.txt"
    )
    assert store.filesystem.readtext(f) == "subdirectory"

    # observations
    store.record["test"] = 1
    assert store.record["test"] == 1

    # log
    store.log.info("test")


def test_records_timing():
    assert (
        execute(Experiment().components("timings"), project="./test_project").failures
        == 0
    )
