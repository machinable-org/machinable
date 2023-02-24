import os

from machinable import Experiment, Project, from_cli, get_version
from machinable.cli import main


def test_cli_main(capfd, tmp_storage):
    # main
    assert main(["--version"]) == 0
    out, err = capfd.readouterr()
    assert out == get_version() + "\n"

    with Project("tests/samples/project"):
        main(["hello", "--launch"])
        out, err = capfd.readouterr()
        assert out == "Hello World!\n"
        main(["hello", "name=Test", "--launch"])
        out, err = capfd.readouterr()
        assert out == "Hello Test!\n"

    assert main([]) == 0
    assert main(["--help"]) == 0


def test_cli_from_cli():
    assert isinstance(from_cli(), list)
    assert from_cli([]) == []
    assert from_cli(["~test", "a=1", "a.b=2"]) == ["~test", {"a": {"b": 2}}]
    assert from_cli(["test", "me"]) == ["test", "me"]


def test_cli_parse():
    assert Experiment().to_cli() == "machinable.experiment"
    assert (
        Experiment(["~test", {"a": {"b": 1}}, "~foo"]).to_cli()
        == "machinable.experiment ~test a.b=1 ~foo"
    )
    assert (
        Experiment([{"a": {"b": 1}}, {"c": 1}]).to_cli()
        == "machinable.experiment a.b=1 c=1"
    )
    assert (
        Experiment({"a": "t m ."}).to_cli() == "machinable.experiment a='t m .'"
    )


def test_cli_installation():
    assert os.system("machinable --help") == 0
    assert os.system("machinable --version") == 0
    assert os.WEXITSTATUS(os.system("machinable --invalid")) == 128
