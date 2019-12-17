
class BaseView:

    def __init__(self, model, cache=None):
        self._model = model
        # shared cache across interfaces with lookup by their sqlite database id
        if cache is None:
            cache = {}
        self._cache = cache

    def as_json(self):
        """Returns a json representation of the data"""
        return self._model.to_json()

    def serialize(self):
        """Serializes the data"""
        return self._model.serialize()

    def _lazyload(self, field, loader):
        if self._model.id not in self._cache:
            self._cache[self._model.id] = {}

        if field not in self._cache[self._model.id]:
            self._cache[self._model.id][field] = loader(self._model)

        return self._cache[self._model.id][field]
