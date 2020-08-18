from ..storage.experiment import StorageExperiment
from .index import Index
import json
import pendulum

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
        table.create_column("updated_at", self._db.types.datetime)
        table.create_column("description", self._db.types.text)
        table.create_column("started_at", self._db.types.datetime)
        table.create_column("execution_json", self._db.types.json)
        table.insert(
            {
                "unique_id": model.unique_id,
                "url": model.url,
                "experiment_id": model.experiment_id,
                "execution_json": json.dumps(model.file("execution.json")),
                # meta data
                "updated_at": pendulum.now(),
                "started_at": pendulum.parse(
                    model.file("execution.json")["started_at"]
                ),
            }
        )

    def _to_experiment(self, model):
        return StorageExperiment(
            {
                k.replace("_json", ".json"): json.loads(v) if k.endswith("_json") else v
                for k, v in model.items()
            }
        )

    def _find(self, experiment_id: str):
        table = self._db["experiments"]
        experiment = table.find_one(experiment_id=experiment_id)
        if experiment is None:
            return None

        return self._to_experiment(experiment)

    def _find_latest(self, limit=10, since=None):
        table = self._db["experiments"]
        if since is None:
            condition = {"<=": pendulum.now()}
        else:
            condition = {">=": since}
        return [
            self._to_experiment(experiment)
            for experiment in table.find(
                started_at=condition, _limit=limit, order_by="started_at"
            )
        ]

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"SqlIndex"
