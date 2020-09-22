from .index import Index


class NativeIndex(Index):
    def __init__(self):
        self._db = {}

        Index.set_latest(self)

    def serialize(self):
        return {"type": "native"}

    def _add(self, experiment):
        self._db[experiment.experiment_id] = experiment

    def _find(self, experiment_id: str):
        try:
            return self._db[experiment_id]
        except KeyError:
            return None

    def _find_all(self):
        return list(self._db.values())

    def _find_latest(self, limit=10, since=None):
        raise NotImplementedError(
            "This index does not support find_latest() operations. Consider using the SqlIndex instead."
        )

    def __repr__(self):
        return f"Index <native>"
