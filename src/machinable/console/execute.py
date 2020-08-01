import os

import click

from ..execution.execution import Execution
from ..filesystem import parse_fs_url


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
    try:
        seed = int(seed)
    except (ValueError, TypeError):
        pass
    Execution(experiment, storage, engine, project, seed).summary().submit()


@click.command()
@click.argument("url")
@click.option("--storage", default=None, help="Storage for this execution.")
@click.option("--engine", default=None, help="Engine used during execution")
@click.option(
    "--project", default=None, help="Project directory.",
)
@click.option("--checkpoint", default=None, help="Optional checkpoint specification")
@click.option("--version", default=None, help="Optional configuration override")
@click.option(
    "--seed",
    default=None,
    help="Seed override. If unspecified, the pre-defined seed will be used for exact reproduction",
)
def execution(url, storage, engine, project, checkpoint, version, seed):
    """
    Resumes an execution from a storage URL
    """
    if "://" not in url:
        url = "osfs://" + url

    # parse URL
    component_id = None
    resource = os.path.normpath(parse_fs_url(url)["resource"])
    path = os.path.basename(resource)
    if len(path) == 12:
        # if component, switch to experiment
        component_id = path
        url = url.replace("/" + component_id, "")

    execution = Execution.from_storage(url)

    if version == "&":
        version = click.edit("{}", extension=".py")

    if seed is not None:
        # overwrite execution seed
        execution.set_seed(seed)

    if component_id is not None:
        execution.filter(lambda i, component, _: component == component_id)

    if len(execution.schedule) == 0:
        raise ValueError(
            "Execution schedule is empty. Check whether the URL points to a valid storage directory"
        )

    if storage is not None:
        execution.set_storage(storage)
    if engine is not None:
        execution.set_engine(engine)
    if project is not None:
        execution.set_project(project)
    if checkpoint is not None:
        execution.set_checkpoint(checkpoint)
    if version is not None:
        execution.set_version(version)

    execution.submit()
