from .base import Collection
from .components import SubmissionComponentCollection


class SubmissionCollection(Collection):
    @property
    def components(self):
        if len(self._items) == 0:
            return SubmissionComponentCollection()
        components = self._items[0].components
        if len(self._items) == 1:
            return components
        for experiment in self._items[1:]:
            components.merge(experiment.components)
        return SubmissionComponentCollection(
            components.unique(lambda x: x.component_id)
        )
