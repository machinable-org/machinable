from .base import Collection
from .components import ComponentStorageCollection


class ExperimentStorageCollection(Collection):
    @property
    def components(self):
        if len(self._items) == 0:
            return ComponentStorageCollection()
        components = self._items[0].components
        if len(self._items) == 1:
            return components
        for experiment in self._items[1:]:
            components.merge(experiment.components)
        return ComponentStorageCollection(components.unique(lambda x: x.component_id))
