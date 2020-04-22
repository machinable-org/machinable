from .mutation_type import mutation


@mutation.field("execute")
async def resolve_execute(obj, info, data=None):
    return {"task_id": str(data)}
