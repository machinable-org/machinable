from ..storage.experiment import ExperimentStorage
from .index import Index


class NativeIndex(Index):
    def __init__(self, url=None):
        self._db = {}
        if url is not None:
            self.add_from_storage(url)

        Index.set_latest(self)

    def serialize(self):
        return {"type": "native"}

    def _add(self, model):
        self._db[model.experiment_id] = model.url

    def _find(self, experiment_id: str):
        try:
            return ExperimentStorage(self._db[experiment_id])
        except KeyError:
            return None

    def reset(self):
        self._db = {}

    def __repr__(self):
        return f"NativeIndex"
