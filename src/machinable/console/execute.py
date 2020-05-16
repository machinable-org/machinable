import click

from ..execution.execution import Execution


@click.command()
@click.argument("experiment")
@click.option("--storage", default=None, help="Storage for this execution.")
@click.option("--engine", default=None, help="Engine used during execution")
@click.option(
    "--project", default=None, help="Project directory",
)
@click.option(
    "--seed", default=None, help="Seed used in this execution",
)
def execute(experiment, storage, engine, project, seed):
    """
    Executes an EXPERIMENT
    """
    Execution(experiment, storage, engine, project, seed).summary().submit()
