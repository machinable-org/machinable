import json

import pendulum

from ..storage.experiment import StorageExperiment
from ..storage.models.filesystem import (
    StorageComponentFileSystemModel,
    StorageExperimentFileSystemModel,
)
from ..utils.utils import sentinel
from .index import Index

try:
    import dataset
except ImportError:
    raise ImportError(
        "Index requires the `dataset` package. Please install it via `pip install dataset`."
    )


class StorageSqlModel:
    def __init__(self, data, meta_data=None, db=None):
        self._db = db
        self._migrated = {}
        super().__init__(data, meta_data)

    def experiment_model(self, data, meta_data=None):
        return StorageExperimentSqlModel(data, meta_data, db=self._db)

    def component_model(self, data, meta_data=None):
        return StorageComponentSqlModel(data, meta_data, db=self._db)

    def migrate(self, tables=None):
        if tables is None:
            # all
            tables = ["experiments"]

        if isinstance(tables, str):
            tables = [tables]

        for table in tables:
            if table in self._migrated:
                continue
            t = self._db[table]
            t.create_column("unique_id", self._db.types.string)
            t.create_column("url", self._db.types.string)
            t.create_column("experiment_id", self._db.types.string)
            t.create_column("started_at", self._db.types.datetime)
            t.create_column("execution_json", self._db.types.json)
            t.create_column("code_json", self._db.types.json)
            t.create_column("host_json", self._db.types.json)
            t.create_column("meta_label", self._db.types.text)
            t.create_column("meta_comments", self._db.types.text)

            self._migrated[table] = True


class StorageExperimentSqlModel(StorageSqlModel, StorageExperimentFileSystemModel):
    @classmethod
    def from_database_model(cls, model, db):
        data = {}
        for field in ["unique_id", "url", "experiment_id", "started_at"]:
            if model[field] is not None:
                data[field] = model[field]
        for file in ["execution_json", "code_json", "host_json"]:
            if model[file] is not None:
                data[file.replace("_", ".")] = json.loads(model[file])
        meta_data = {"label": model["meta_label"], "comments": model["meta_comments"]}
        return cls(data, meta_data, db=db)

    def as_experiment(self):
        return StorageExperiment(self)

    def fill(self, data, meta_data=None):
        super(StorageExperimentFileSystemModel, self).fill(data, meta_data)
        self.migrate()
        table = self._db["experiments"]
        table.insert_ignore(
            row={
                "unique_id": self.unique_id,
                "url": self.url,
                "experiment_id": self.experiment_id,
                "execution_json": json.dumps(self.file("execution.json")),
                "code_json": json.dumps(self.file("code.json")),
                "host_json": json.dumps(self.file("host.json")),
                "started_at": pendulum.parse(self.file("execution.json")["started_at"]),
            },
            keys=["unique_id"],
        )


class StorageComponentSqlModel(StorageSqlModel, StorageComponentFileSystemModel):
    pass


class SqlIndex(Index):
    def __init__(self, database="sqlite:///:memory:"):
        self.database = database
        self._db = dataset.connect(database)

        Index.set_latest(self)

    def serialize(self):
        return {"type": "sql", "database": self.database}

    def _add(self, model):
        StorageExperimentSqlModel(**model.serialize(), db=self._db)

    def _find(self, experiment_id: str):
        table = self._db["experiments"]
        model = table.find_one(experiment_id=experiment_id)
        if model is None:
            return None

        return StorageExperimentSqlModel.from_database_model(
            model, db=self._db
        ).as_experiment()

    def _find_latest(self, limit=10, since=None):
        table = self._db["experiments"]
        if since is None:
            condition = {"<=": pendulum.now()}
        else:
            condition = {">=": since}
        return [
            StorageExperimentSqlModel.from_database_model(
                model, db=self._db
            ).as_experiment()
            for model in table.find(
                started_at=condition, _limit=limit, order_by="started_at"
            )
        ]

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"SqlIndex"
