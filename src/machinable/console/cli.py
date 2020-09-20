import click
import pkg_resources

from .execute import execute, execution
from .vendor.commands import vendor


@click.group(invoke_without_command=True)
@click.pass_context
@click.option("--version", "-v", is_flag=True, help="Prints the version number")
def cli(ctx, version):
    if ctx.invoked_subcommand is not None:
        return

    if version:
        click.echo(pkg_resources.require("machinable")[0].version)
        return

    click.echo(ctx.get_help())


cli.add_command(vendor)
cli.add_command(execute)
cli.add_command(execution)
try:
    from .server import app, server

    cli.add_command(server)
    cli.add_command(app)
except ImportError:
    pass
