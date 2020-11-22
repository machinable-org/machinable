import asyncio

from .....index import Index
from .....submission.collections import SubmissionCollection
from .subscription_type import subscription


@subscription.source("index")
async def index_generator(obj, info, index, limit=10):
    polling_interval = 5
    index = Index.get(index)

    since = None
    updates = SubmissionCollection()
    while True:
        updates = updates.filter(lambda x: x.is_finished())
        submissions = index.find_latest(limit=limit, since=since)
        if len(submissions) > 0:
            since = submissions.first().started_at

        if len(submissions) > 0 or len(updates) > 0:
            yield submissions, updates

        updates.merge(submissions)

        await asyncio.sleep(polling_interval)


class IndexSubscriptionDelta:
    def __init__(self, submissions, updates):
        self.submissions = submissions
        self.updates = updates


@subscription.field("index")
def index_resolver(delta, info, index, limit=10):
    return IndexSubscriptionDelta(*delta)
