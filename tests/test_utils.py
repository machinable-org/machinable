import os

import pytest

from machinable import get_version, utils
from machinable.interface import Interface


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
        utils.import_from_directory("top", "./tests/samples/importing").TopComponent
    ) is type(
        utils.import_from_directory("importing.top", "./tests/samples").TopComponent
    )

    # import modules with and without __init__.py
    assert (
        utils.import_from_directory("nested", "./tests/samples/importing") is not None
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
    assert type(utils.find_subclass_in_module(module, Interface)) is type(
        module.TopComponent
    )

    # ignores imported classes?
    module = utils.import_from_directory("nested.bottom", "./tests/samples/importing")
    assert type(utils.find_subclass_in_module(module, Interface)) is type(
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
    e = Interface().materialize()
    assert utils.joinpath([e.id, "b"]) == f"{e.id}/b"
    assert utils.joinpath(["a", ""]) == "a/"
    assert utils.joinpath([None, "a", None, "b"]) == "a/b"


@pytest.mark.skipif(
    os.name == "nt", reason="POSIX exec bit; os.X_OK is meaningless on Windows"
)
def test_chmodx(tmp_path):
    script = utils.save_file(str(tmp_path / "test.sh"), 'echo "HELLO"')
    assert not os.access(script, os.X_OK)
    utils.chmodx(script)
    assert os.access(script, os.X_OK)


@pytest.mark.skipif(
    os.name == "nt", reason="runs a POSIX shell script; not applicable under cmd.exe"
)
def test_run_and_stream(tmp_path):
    script = utils.chmodx(utils.save_file(str(tmp_path / "test.sh"), 'echo "HELLO"'))

    o = []
    utils.run_and_stream(script, shell=True, stdout_handler=lambda x: o.append(x))
    assert o[0] == "HELLO\n"


def test_file_hash(tmp_path):
    file = utils.save_file(str(tmp_path / "test.txt"), "test")
    assert utils.file_hash(file) == "a71079d42853"
    assert utils.file_hash(tmp_path / "test.txt") == "a71079d42853"
    with pytest.raises(FileNotFoundError):
        utils.file_hash("not-existing")


@pytest.mark.parametrize(
    "input_code, expected",
    [
        ("foo(1, bar=2)", "foo(1,bar=2)"),
        ("foo( 1, bar = 2 )", "foo(1,bar=2)"),
        ("\nfoo(\n1,\nbar = 2\n)\n", "foo(1,bar=2)"),
        ("foo(' hello ', bar=2)", "foo(' hello ',bar=2)"),
        ("foo(bar= 'world', baz =3)", "foo(bar='world',baz=3)"),
        ("~foo(bar= '  world',)", "~foo(bar='  world',)"),
        (" ~foo(bar= 'world')", "~foo(bar='world')"),
    ],
)
def test_norm_version_call(input_code, expected):
    assert utils.norm_version_call(input_code) == expected


def test_tee_output_thread_scoped(tmp_path):
    import threading

    a, b = tmp_path / "a.log", tmp_path / "b.log"

    def run(path, tag):
        with utils.tee_output(str(path)):
            print(f"hello from {tag}")

    # concurrent tees do not interleave: each thread's writes land in its own log
    threads = [
        threading.Thread(target=run, args=(a, "a")),
        threading.Thread(target=run, args=(b, "b")),
    ]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert a.read_text() == "hello from a\n"
    assert b.read_text() == "hello from b\n"

    # unrouted threads pass through untouched; appending resumes the log
    with utils.tee_output(str(a)):
        print("again")
    assert a.read_text() == "hello from a\nagain\n"


def test_read_output_window(tmp_path):
    path = tmp_path / "output.log"

    # missing file: no output yet
    assert utils.read_output_window(str(path)) == (None, 0, 0)

    path.write_bytes(b"0123456789")
    # default: the whole (small) file
    assert utils.read_output_window(str(path)) == ("0123456789", 0, 10)
    # tail window
    assert utils.read_output_window(str(path), tail=4) == ("6789", 6, 10)
    # forward from offset (incremental follow)
    assert utils.read_output_window(str(path), offset=7) == ("789", 7, 10)
    assert utils.read_output_window(str(path), offset=10) == ("", 10, 10)
    # limit caps both forms
    assert utils.read_output_window(str(path), offset=0, limit=3) == ("012", 0, 10)
    assert utils.read_output_window(str(path), tail=8, limit=3) == ("789", 7, 10)

    # a window that splits a multibyte char degrades, never crashes
    path.write_bytes("héllo".encode())
    data, start, size = utils.read_output_window(str(path), offset=2)
    assert isinstance(data, str) and start == 2 and size == 6
