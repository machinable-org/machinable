import pkg_resources

from .query_type import query


@query.field("server")
async def resolve_server(*_):
    return pkg_resources.require("machinable")[0].version
