from machinable.cli import Cli


def test_cli():
    Cli([None, "version"])
    Cli([None, "vendor"])
