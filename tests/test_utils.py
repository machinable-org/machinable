from typing import Any, Callable, Union

import re

import machinable.utils as utils
import numpy as np
import pytest
from hypothesis import given, strategies


def test_experiment_id_encoding():
    assert utils.encode_experiment_id(946416180) == "123456"
    with pytest.raises(ValueError):
        utils.encode_experiment_id(0)
    assert utils.decode_experiment_id("123456") == 946416180
    with pytest.raises(ValueError):
        utils.decode_experiment_id("invalid")
    assert utils.generate_experiment_id() > 0
    eid = utils.generate_experiment_id()
    assert utils.decode_experiment_id(utils.encode_experiment_id(eid)) == eid


def test_generate_nickname():
    with pytest.raises(ValueError):
        utils.generate_nickname({})
    with pytest.raises(KeyError):
        utils.generate_nickname("non-existent-category")
    assert len(utils.generate_nickname().split("_")) == 2
    assert utils.generate_nickname(["tree"]).find("_") == -1


def test_filesystem_utils(tmpdir):
    # json
    filepath = str(tmpdir / "random/path/test.json")
    utils.save_file(filepath, {"jsonable": 1, "test": True})
    r = utils.load_file(filepath)
    assert r["jsonable"] == 1
    assert r["test"] is True

    # text
    filepath = str(tmpdir / "random/test.diff")
    utils.save_file(filepath, "test")
    assert utils.load_file(filepath) == "test"

    # pickle
    filepath = str(tmpdir / "test.p")
    utils.save_file(filepath, ["test"])
    assert utils.load_file(filepath) == ["test"]

    # numpy
    filepath = str(tmpdir / "number.npy")
    utils.save_file(filepath, np.array([1, 2, 3]))
    assert utils.load_file(filepath).sum() == 6

    assert utils.load_file("not_existing.txt", default="default") == "default"
    with pytest.raises(ValueError):
        utils.save_file("invalid.extension", [])


@given(strategies.text())
def test_sanitize_path(path):
    cleaned = utils.sanitize_path(path)
    assert "//" not in cleaned
    assert not cleaned.startswith("/")
    assert not cleaned.endswith("/")
    ok = "-_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/0123456789"
    assert len([c for c in cleaned if (c not in ok)]) == 0
