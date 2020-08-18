from .mutation_type import mutation


@mutation.field("execute")
async def resolve_execute(obj, info, data=None):
    return {"experiment_id": str(data)}
