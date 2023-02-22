from machinable import cli, get_version
from machinable.cli import main


def test_cli(capfd):
    assert isinstance(cli(), (dict, None))

    # main
    assert main() is None

    assert main(["--version"]) == get_version()
    out, err = capfd.readouterr()
    assert out == get_version() + "\n"
