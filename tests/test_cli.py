from machinable import Experiment, cli, get_version
from machinable.cli import main


def test_cli(capfd):
    assert isinstance(cli(), (dict, None))

    # main
    assert main() is None

    assert main(["--version"]) == get_version()
    out, err = capfd.readouterr()
    assert out == get_version() + "\n"


def test_cli_conversion():
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
