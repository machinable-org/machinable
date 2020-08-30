import asyncio

from .....index import Index
from .....storage.collections import ExperimentStorageCollection
from .subscription_type import subscription


@subscription.source("index")
async def index_generator(obj, info, index, limit=10):
    polling_interval = 5
    index = Index.get(index)

    since = None
    updates = ExperimentStorageCollection()
    while True:
        updates = updates.filter(lambda x: x.is_finished())
        experiments = index.find_latest(limit=limit, since=since)
        if len(experiments) > 0:
            since = experiments.first().started_at

        if len(experiments) > 0 or len(updates) > 0:
            yield experiments, updates

        updates.merge(experiments)

        await asyncio.sleep(polling_interval)


class IndexSubscriptionDelta:
    def __init__(self, experiments, updates):
        self.experiments = experiments
        self.updates = updates


@subscription.field("index")
def index_resolver(delta, info, index, limit=10):
    return IndexSubscriptionDelta(*delta)
