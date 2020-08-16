from ..storage.experiment import ExperimentStorage
from .index import Index
import json

try:
    import dataset
except ImportError:
    raise ImportError(
        "Index requires the `dataset` package. Please install it via `pip install dataset`."
    )


class SqlIndex(Index):
    def __init__(self, database="sqlite:///:memory:"):
        self.database = database
        self._db = dataset.connect(database)

        Index.set_latest(self)

    def serialize(self):
        return {"type": "sql", "database": self.database}

    def _add(self, model):
        table = self._db["experiments"]
        table.insert(
            {
                k.replace(".json", "_json"): json.dumps(v) if k.endswith(".json") else v
                for k, v in model.serialize().items()
            }
        )

    def _find(self, experiment_id: str):
        table = self._db["experiments"]
        experiment = table.find_one(experiment_id=experiment_id)
        if experiment is None:
            return None

        return ExperimentStorage(
            {
                k.replace("_json", ".json"): json.loads(v) if k.endswith("_json") else v
                for k, v in experiment.items()
            }
        )

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"SqlIndex"
