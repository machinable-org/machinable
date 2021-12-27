import os

import numpy as np
import pytest
from commandlib import Command
from machinable import Component, utils


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

    # jsonlines
    filepath = str(tmpdir / "random/data/jsonlines.jsonl")
    utils.save_file(filepath, {"jsonable": 1, "test": True})
    utils.save_file(filepath, {"jsonable": 2, "test": True}, mode="a")
    r = utils.load_file(filepath)
    assert len(r) == 2
    assert r[1]["jsonable"] == 2
    assert r[0]["test"] == r[1]["test"]

    # text
    filepath = str(tmpdir / "random/test.diff")
    utils.save_file(filepath, "test")
    assert utils.load_file(filepath) == "test"
    filepath = str(tmpdir / "random/test_ext")
    utils.save_file(filepath, 1)
    assert utils.load_file(filepath) == "1"

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



def test_import_from_directory():
    # relative imports
    assert type(
        utils.import_from_directory(
            "top", "./tests/samples/importing"
        ).TopComponent
    ) is type(
        utils.import_from_directory(
            "importing.top", "./tests/samples"
        ).TopComponent
    )

    # import modules with and without __init__.py
    assert (
        utils.import_from_directory("nested", "./tests/samples/importing")
        is not None
    )
    assert (
        utils.import_from_directory("importing", "./tests/samples").__doc__
        == "Importing"
    )

    assert utils.import_from_directory("non_existing", "./tests") is None
    with pytest.raises(ModuleNotFoundError):
        utils.import_from_directory("non_existing", "./tests", or_fail=True)


def test_find_subclass_in_module():
    assert utils.find_subclass_in_module(None, None) is None

    module = utils.import_from_directory("top", "./tests/samples/importing")
    assert type(utils.find_subclass_in_module(module, Component)) is type(
        module.TopComponent
    )

    # ignores imported classes?
    module = utils.import_from_directory(
        "nested.bottom", "./tests/samples/importing"
    )
    assert type(utils.find_subclass_in_module(module, Component)) is type(
        module.BottomComponent
    )


def test_unflatten_dict():
    d = {"a.b": "c"}
    original = {"a.b": "c"}
    assert utils.unflatten_dict(d)["a"]["b"] == "c"
    assert d == original

    # recursive
    d = {"a.b": {"c.d": "e"}}
    original = {"a.b": {"c.d": "e"}}
    assert utils.unflatten_dict(d)["a"]["b"]["c"]["d"] == "e"
    assert d == original


def test_machinable_version():
    assert isinstance(utils.get_machinable_version(), str)


def test_set_process_title():
    utils.set_process_title("test")


def test_git_utils(tmp_path):
    # create a repository
    repo_dir = str(tmp_path / "test_repo")
    os.makedirs(repo_dir, exist_ok=True)
    git = Command("git").in_dir(repo_dir)
    git("init").run()

    # get_diff
    assert utils.get_diff(str(tmp_path)) is None
    assert utils.get_diff(repo_dir) == ""

    with open(os.path.join(repo_dir, "test"), "w") as f:
        f.write("some test data")

    git("add", ".").run()
    assert "some test data" in utils.get_diff(repo_dir)


def test_mixins():
    class MixinImplementation:
        attribute = "works"

        def is_bound(self, param):
            return "bound_to_" + self.flags.BOUND + "_" + str(param)

        def this_reference(self, param):
            return self.__mixin__.is_bound("and_referenced_" + str(param))

        def this_attribute(self):
            return self.__mixin__.attribute

        def this_static(self, param):
            return self.__mixin__.static_method(param)

        @staticmethod
        def static_method(foo):
            return foo

        @property
        def key_propery(self):
            return 1


def test_resolve_at_alias():
    assert utils.resolve_at_alias("") == ""
    assert utils.resolve_at_alias("@") == "_machinable"
    assert utils.resolve_at_alias("@test") == "_machinable.test"
    assert utils.resolve_at_alias("@test", "foo") == "_machinable.foo.test"
