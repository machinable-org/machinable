import os
import subprocess

import pytest
from machinable import get_version, utils
from machinable.element import Element


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
    # filepath = str(tmpdir / "number.npy")
    # utils.save_file(filepath, np.array([1, 2, 3]))
    # assert utils.load_file(filepath).sum() == 6

    assert utils.load_file("not_existing.txt", default="default") == "default"
    utils.save_file(str(tmpdir / "unsupported.extension"), 0.0)
    assert utils.load_file(str(tmpdir / "unsupported.extension")) == "0.0"


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
    assert type(utils.find_subclass_in_module(module, Element)) is type(
        module.TopComponent
    )

    # ignores imported classes?
    module = utils.import_from_directory(
        "nested.bottom", "./tests/samples/importing"
    )
    assert type(utils.find_subclass_in_module(module, Element)) is type(
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
    assert isinstance(get_version(), str)


def test_git_utils(tmp_path):
    # create a repository
    repo_dir = str(tmp_path / "test_repo")
    os.makedirs(repo_dir, exist_ok=True)
    subprocess.run(["git", "init"], cwd=repo_dir, check=True)

    # get_diff
    assert utils.get_diff(str(tmp_path)) is None
    assert utils.get_diff(repo_dir) == ""

    with open(os.path.join(repo_dir, "test"), "w") as f:
        f.write("some test data")

    subprocess.run(["git", "add", "."], cwd=repo_dir, check=True)
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


def test_directory_version():
    for case in [
        None,
        {"directory": "yes"},
        "~version",
    ]:
        assert utils.is_directory_version(case) is False
    for case in [
        "~",
        ".",
        "./",
        "./version",
        "test",
        "test.me",
        "/path/to/version",
        "../test",
    ]:
        assert utils.is_directory_version(case) is True


def test_joinpath():
    assert utils.joinpath(["a", "b"]) == "a/b"
    assert utils.joinpath(["a", "b", "c"]) == "a/b/c"
    e = Element()
    assert utils.joinpath([e, "b"]) == f"{e.id}/b"
    with pytest.raises(ValueError):
        utils.joinpath(["a", 1])
    assert utils.joinpath(["a", ""]) == "a/"
