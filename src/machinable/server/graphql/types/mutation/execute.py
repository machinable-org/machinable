import json

from .....execution import Execution
from .mutation_type import mutation


def from_string(value):
    if value is None:
        return None

    if value.startswith("{") and value.endswith("}"):
        return json.loads(value)

    if value.startswith("int:"):
        return int(value[4:])

    return value


@mutation.field("execute")
async def resolve_execute(
    obj,
    info,
    experiment,
    storage=None,
    engine=None,
    index=None,
    project=None,
    seed=None,
):
    execution = Execution(
        experiment=from_string(experiment),
        storage=from_string(storage),
        engine=from_string(engine),
        index=from_string(index),
        project=from_string(project),
        seed=from_string(seed),
    )
    execution.submit()
    return execution
