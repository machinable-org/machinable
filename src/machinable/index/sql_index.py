import collections
import json

import pendulum

from ..storage.experiment import StorageExperiment
from ..storage.models import StorageComponentModel, StorageExperimentModel, StorageModel
from ..storage.models.filesystem import (
    StorageComponentFileSystemModel,
    StorageExperimentFileSystemModel,
)
from .index import Index

try:
    import dataset
except ImportError:
    raise ImportError(
        "Index requires the `dataset` package. Please install it via `pip install dataset`."
    )


class StorageSqlModel(StorageModel):
    def __init__(self, url, database):
        self._data = None
        if isinstance(url, collections.Mapping):
            self._data = url
            url = url["url"]
        super().__init__(url)
        if isinstance(database, str):
            database = dataset.connect(database)
        self._db = database
        self._filesystem_model = None

    def experiment_model(self, url):
        return StorageExperimentSqlModel(url, self._db)

    def component_model(self, url):
        return StorageComponentSqlModel(url, self._db)


class StorageExperimentSqlModel(StorageSqlModel, StorageExperimentModel):
    def file(self, filepath):
        if self._data is None:
            # fetch from database
            table = self._db["experiments"]
            self._data = table.find_one(url=self.url)
            if self._data is None:
                self._data = self.insert()

        if filepath in ["execution.json", "code.json", "host.json"]:
            return json.loads(self._data[filepath.replace(".", "_")])

        return self.filesystem_model.file(filepath)

    @property
    def filesystem_model(self):
        if self._filesystem_model is None:
            self._filesystem_model = StorageExperimentFileSystemModel(self.url)
        return self._filesystem_model

    def insert(self, model=None):
        if model is None:
            model = self.filesystem_model

        try:
            execution_json = model.file("execution.json")
        except FileNotFoundError:
            return False

        row = {
            "url": model.url,
            "experiment_id": model.experiment_id,
            "execution_json": json.dumps(execution_json),
            "code_json": json.dumps(model.file("code.json")),
            "host_json": json.dumps(model.file("host.json")),
            "started_at": pendulum.parse(execution_json["started_at"]),
        }
        table = self._db["experiments"]
        table.insert(row)
        return row

    def as_experiment(self):
        return StorageExperiment(self)


class StorageComponentSqlModel(StorageSqlModel, StorageComponentModel):
    @property
    def filesystem_model(self):
        if self._filesystem_model is None:
            self._filesystem_model = StorageComponentFileSystemModel(self.url)
        return self._filesystem_model

    def file(self, filepath):
        if self._data is None:
            # fetch from database
            table = self._db["components"]
            self._data = table.find_one(url=self.url)
            if self._data is None:
                # todo: handle insert
                self._data = {}

        if filepath in ["component.json", "components.json", "state.json", "host.json"]:
            try:
                return json.loads(self._data[filepath.replace(".", "_")])
            except KeyError:
                pass

        return self.filesystem_model.file(filepath)


class SqlIndex(Index):
    def __init__(self, database="sqlite:///:memory:"):
        self.database = database
        self._db = dataset.connect(database)
        self._migrated = False
        Index.set_latest(self)

    def serialize(self):
        return {"type": "sql", "database": self.database}

    def _add(self, experiment):
        StorageExperimentSqlModel(experiment.url, database=self._db).insert(experiment)

    def _find(self, experiment_id: str):
        table = self._table("experiments")
        model = table.find_one(experiment_id=experiment_id)
        if model is None:
            return None

        return StorageExperimentSqlModel(model, database=self._db).as_experiment()

    def _find_latest(self, limit=10, since=None):
        table = self._table("experiments")
        if since is None:
            condition = {"<=": pendulum.now()}
        else:
            condition = {">": since}
        return [
            StorageExperimentSqlModel(model, database=self._db).as_experiment()
            for model in table.find(
                started_at=condition, _limit=limit, order_by="started_at"
            )
        ]

    def _find_all(self):
        table = self._table("experiments")
        return table.all()

    def _table(self, name):
        self._migrate()
        return self._db[name]

    def _migrate(self):
        if self._migrated is True:
            return

        table = self._db["experiments"]
        table.create_column("url", self._db.types.string)
        table.create_column("experiment_id", self._db.types.string)
        table.create_column("started_at", self._db.types.datetime)
        table.create_column("finished_at", self._db.types.datetime)
        table.create_column("trashed_at", self._db.types.datetime)
        table.create_column("execution_json", self._db.types.json)
        table.create_column("code_json", self._db.types.json)
        table.create_column("host_json", self._db.types.json)
        table.create_column("label", self._db.types.text)
        table.create_column("comments", self._db.types.text)

        table = self._db["components"]
        table.create_column("url", self._db.types.string)
        table.create_column("experiment_id", self._db.types.string)
        table.create_column("component_id", self._db.types.string)
        table.create_column("started_at", self._db.types.datetime)
        table.create_column("finished_at", self._db.types.datetime)
        table.create_column("component_json", self._db.types.json)
        table.create_column("components_json", self._db.types.json)
        table.create_column("state_json", self._db.types.json)
        table.create_column("host_json", self._db.types.json)

        self._migrated = True

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"Index <sql+{self.database}>"
