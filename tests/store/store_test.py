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
    store.write("test.txt", "test me")
    f = os.path.join(
        store.config["experiment"], store.config["component"], "store", "test.txt"
    )
    assert store.filesystem.readtext(f) == "test me"
    store.write("test.npy", np.ones([5]))
    store.write("test.p", np.ones([5]))
    store.write("test.json", [1, 2, 3])
    store.write("dir/test.txt", "subdirectory")
    f = os.path.join(
        store.config["experiment"], store.config["component"], "store", "dir/test.txt"
    )
    assert store.filesystem.readtext(f) == "subdirectory"
    f = os.path.join(
        store.config["experiment"], store.config["component"], "store.json"
    )
    store.write("test", True)
    assert store.filesystem.readtext(f) == '{"test": true}'
    store.write("bla", 1)
    assert store.filesystem.readtext(f) == '{"test": true, "bla": 1}'

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
