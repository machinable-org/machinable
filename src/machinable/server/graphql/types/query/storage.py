from .....storage.component import StorageComponent
from .....storage.experiment import StorageExperiment
from .query_type import query


@query.field("storageExperiment")
async def resolve_storage_experiment(obj, info, url):
    return StorageExperiment(url)


@query.field("storageComponent")
async def resolve_storage_component(obj, info, url):
    return StorageComponent(url)
