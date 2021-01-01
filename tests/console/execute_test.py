from click.testing import CliRunner
from machinable.console.execute import execution


def test_console_execution(tmp_path):
    runner = CliRunner()
    result = runner.invoke(execution, [str(tmp_path)])
    assert result.exit_code == 0
