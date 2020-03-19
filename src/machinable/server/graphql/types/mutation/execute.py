from .mutation_type import mutation


@mutation.field('execute')
async def resolve_execute(*_):
    return ''
