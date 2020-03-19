import asyncio

from .subscription_type import subscription


@subscription.source('observations')
async def observations_generator(obj, info):
    for i in range(5):
        await asyncio.sleep(1)
        yield str(i)


@subscription.field('observations')
def observations_resolver(log, info):
    return log
