import os
import shutil

import numpy as np

from machinable import Experiment, execute
from machinable.store import Store


def test_store_writer():
    store = Store({"component": "12345"})

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
    execute(Experiment().components("timings"), project="./test_project")


def test_output_redirection(capsys, helpers):
    storage = helpers.tmp_directory("output_redirection")

    for mode in ["SYS_AND_FILE", "FILE_ONLY", "DISCARD"]:
        if os.path.exists(storage):
            shutil.rmtree(storage, ignore_errors=True)

        print("non-captured")
        o = Store({"component": "654321", "url": storage, "output_redirection": mode})
        print("captured")
        o.destroy()
        print("non-captured-again")
        if mode == "DISCARD":
            assert not os.path.isfile(os.path.join(storage, "654321/output.log"))
        else:
            with open(os.path.join(storage, "654321/output.log"), "r") as f:
                assert f.read() == "captured\n"

        assert (
            capsys.readouterr().out
            == {
                "SYS_AND_FILE": "non-captured\ncaptured\nnon-captured-again\n",
                "FILE_ONLY": "non-captured\nnon-captured-again\n",
                "DISCARD": "non-captured\nnon-captured-again\n",
            }[mode]
        )
