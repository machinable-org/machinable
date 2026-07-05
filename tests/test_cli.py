import os

import pytest

from machinable import Execution, Project, from_cli, get_version
from machinable.cli import main


def test_cli_main(capfd, tmp_storage):
    # version
    assert main(["version"]) == 0
    out, err = capfd.readouterr()
    assert out == get_version() + "\n"

    # get
    with Project("tests/samples/project"):
        main(["get", "hello", "--launch"])
        out, err = capfd.readouterr()
        assert out == "Hello World!\n"
        main(["get", "hello", "name=Test", "--launch"])
        out, err = capfd.readouterr()
        assert out == "Hello Test!\n"
        main(["get", "hello", "name=Twice", "--launch", "--__call__"])
        out, err = capfd.readouterr()
        assert out == "Hello Twice!\nHello Twice!\n"
        assert main(["get.new", "hello", "--launch"]) == 0

        # method arguments follow the ~version(a=1) convention
        out, err = capfd.readouterr()
        main(["get", "hello", "--greet(name='CLI', repeat=2)"])
        out, err = capfd.readouterr()
        assert out == "Hi CLI! Hi CLI!\n"
        # nested parentheses in arguments are fine
        main(["get", "hello", "--greet(repeat=int(min(2, 3)))"])
        out, err = capfd.readouterr()
        assert out == "Hi you! Hi you!\n"
        # without arguments, a returned value is printed as well
        main(["get", "hello", "--greet"])
        out, err = capfd.readouterr()
        assert out == "Hi you!\n"
        # invalid arguments fail cleanly
        assert main(["get", "hello", "--greet(nope=1)"]) == 128
        out, err = capfd.readouterr()
        assert "Invalid arguments" in out

        with pytest.raises(ValueError):
            main(["get"])

        out, err = capfd.readouterr()
        main(["get", "interface.dummy", "--__call__"])
        out, err = capfd.readouterr()
        assert out == "Hello world!\n"
        main(["get", "interface.dummy", "hello", "name=there", "--__call__"])
        out, err = capfd.readouterr()
        assert out == "Hello there!\n"

        main(
            [
                "get",
                "machinable.execution",
                "**resources={'a': 1}",
                "hello",
                "name=there",
                "--resources",
            ]
        )
        out, err = capfd.readouterr()
        assert out == "{'a': 1}\n"

        main(
            [
                "get",
                "machinable.execution",
                "**resources={'a': 1}",
                "**resources={'a': 2}",
                "--__model__",
            ]
        )
        out, err = capfd.readouterr()
        assert "resources={'a': 2}" in out

        out, err = capfd.readouterr()
        main(
            [
                "get",
                "machinable.execution",
                "**resources={'a': 1}",
                "--__model__",
            ]
        )
        out, err = capfd.readouterr()
        assert "resources={'a': 1}" in out

    # help
    assert main([]) == 0
    assert main(["help"]) == 0

    assert isinstance(from_cli(), list)
    assert from_cli([]) == []
    assert from_cli(["~test", "a=1", "a.b=2"]) == ["~test", {"a": {"b": 2}}]
    assert from_cli(["test", "me"]) == ["test", "me"]


def test_cli_to_cli():
    assert Execution().to_cli() == "machinable.execution"
    assert (
        Execution(["~test", {"a": {"b": 1}}, "~foo"]).to_cli()
        == "machinable.execution ~test a.b=1 ~foo"
    )
    assert (
        Execution([{"a": {"b": 1}}, {"c": 1}]).to_cli()
        == "machinable.execution a.b=1 c=1"
    )
    assert Execution({"a": "t m ."}).to_cli() == "machinable.execution a='t m .'"


def test_cli_installation():
    import sys

    python = sys.executable
    assert os.system(f"{python} -m machinable.cli help") == 0
    assert os.system(f"{python} -m machinable.cli version") == 0
    assert os.system(f"{python} -m machinable.cli --invalid") != 0
