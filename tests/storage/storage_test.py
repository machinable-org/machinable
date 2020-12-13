import math
import os

import numpy as np
import pytest

from machinable import Storage

STORAGE_DIRECTORY = "./_test_data/storage"


def get_path(path=""):
    return os.path.join(STORAGE_DIRECTORY, path)


def test_storage_interface():
    storage = Storage(url=STORAGE_DIRECTORY, submission="tttttt")
    assert isinstance(storage.config, dict)
    assert storage.config["url"] == "osfs://" + STORAGE_DIRECTORY
    with pytest.raises(ValueError):
        Storage(directory="/absolute path")
    assert storage.get_url() == "osfs://" + get_path("tttttt/")
    assert storage.get_local_directory() == get_path("tttttt/")
    assert storage.get_local_directory(create=True) == get_path("tttttt/")
    assert storage.get_path() == "tttttt/"
    c = storage.get_submission(0)
    storage = Storage(
        url=STORAGE_DIRECTORY, submission="tttttt", component=c.component_id
    )
    storage.log.info("test")
    assert isinstance(len(storage.record), int)
    assert storage.get_submission() is not None
    assert storage.get_submission(component=0) is not None
    assert isinstance(storage.has_log(), bool)
    assert isinstance(storage.has_records(), bool)

    storage.save_data("test.txt", "test me")
    f = os.path.join(
        storage.config["submission"], storage.config["component"], "data", "test.txt"
    )
    assert storage.get_stream(f).readline() == "test me"
    storage.save_data("test.npy", np.ones([5]))
    storage.save_data("test.p", np.ones([5]))
    storage.save_data("test.json", [1, 2, 3])
    storage.save_data("dir/test.txt", "subdirectory")
    f = os.path.join(
        storage.config["submission"],
        storage.config["component"],
        "data",
        "dir/test.txt",
    )
    assert storage.get_stream(f).readline() == "subdirectory"

    storage.record["test"] = 1
    assert storage.record["test"] == 1
