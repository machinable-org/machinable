import asyncio

from .....index import Index
from .subscription_type import subscription


@subscription.source("index")
async def index_generator(obj, info, index, limit=10):
    index = Index.get(index)
    since = None
    while True:
        experiments = index.find_latest(limit=limit, since=since)
        if len(experiments) > 0:
            since = experiments.first().started_at
            yield experiments

        await asyncio.sleep(10)


@subscription.field("index")
def index_resolver(experiments, info, index, limit=10):
    return experiments
