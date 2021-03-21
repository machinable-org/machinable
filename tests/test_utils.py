import numpy as np
import pytest
from machinable.utils import system, utils


def test_utils():
    # experiment identifiers
    assert utils.encode_experiment_id(946416180) == "123456"
    with pytest.raises(ValueError):
        utils.encode_experiment_id(0)
    assert utils.decode_experiment_id("123456") == 946416180
    with pytest.raises(ValueError):
        utils.decode_experiment_id("invalid")
    assert utils.generate_experiment_id() > 0
    eid = utils.generate_experiment_id()
    assert utils.decode_experiment_id(utils.encode_experiment_id(eid)) == eid

    # nickname
    with pytest.raises(ValueError):
        utils.generate_nickname({})
    with pytest.raises(KeyError):
        utils.generate_nickname("non-existent-category")
    assert len(utils.generate_nickname().split("_")) == 2
    assert utils.generate_nickname(["tree"]).find("_") == -1


def test_system_utils(tmpdir):
    # json
    filepath = str(tmpdir / "random/path/test.json")
    system.save_file(filepath, {"jsonable": 1, "test": True})
    r = system.load_file(filepath)
    assert r["jsonable"] == 1
    assert r["test"] is True

    # text
    filepath = str(tmpdir / "random/test.diff")
    system.save_file(filepath, "test")
    assert system.load_file(filepath) == "test"

    # pickle
    filepath = str(tmpdir / "test.p")
    system.save_file(filepath, ["test"])
    assert system.load_file(filepath) == ["test"]

    # numpy
    filepath = str(tmpdir / "number.npy")
    system.save_file(filepath, np.array([1, 2, 3]))
    assert system.load_file(filepath).sum() == 6

    assert system.load_file("not_existing.txt", default="default") == "default"
    with pytest.raises(ValueError):
        system.save_file("invalid.extension", [])
