import collections
import json

import pendulum

from ..filesystem import parse_storage_url
from ..submission.models import BaseModel, SubmissionComponentModel, SubmissionModel
from ..submission.models.filesystem import (
    FileSystemSubmissionComponentModel,
    FileSystemSubmissionModel,
)
from ..submission.submission import Submission
from .index import Index

try:
    import dataset
except ImportError:
    raise ImportError(
        "Index requires the `dataset` package. Please install it via `pip install dataset`."
    )


class SqlBaseModel(BaseModel):
    def __init__(self, url, database, filesystem_model=None):
        self._data = None
        if isinstance(database, str):
            database = dataset.connect(database)
        self._db = database
        if filesystem_model is None:
            filesystem_model = SubmissionComponentModel.get()
        self._filesystem_model = filesystem_model
        if isinstance(url, Submission):
            self.url = url.model.url
            self.submission_id = url.model.submission_id
            self.component_id = url.model.component_id
            if self._filesystem_model is None:
                self._filesystem_model = url.model
        else:
            if isinstance(url, collections.Mapping):
                self._data = url
                url = url["url"]
            self.url = url
            parsed = parse_storage_url(self.url)
            self.submission_id = parsed["submission_id"]
            self.component_id = parsed["component_id"]

    def submission_model(self, url):
        return SqlSubmissionModel(url, self._db)

    def submission_component_model(self, url):
        return SqlSubmissionComponentModel(url, self._db)


class SqlSubmissionModel(SqlBaseModel, FileSystemSubmissionModel):
    def file(self, filepath):
        if self._data is None:
            # fetch from database
            table = self._db["submissions"]
            self._data = table.find_one(url=self.url)
            if self._data is None:
                self._data = self.insert()

        if filepath in ["execution.json", "code.json", "host.json"]:
            return json.loads(self._data[filepath.replace(".", "_")])

        return self.filesystem_model.file(filepath)

    @property
    def filesystem_model(self):
        if self._filesystem_model is None:
            self._filesystem_model = SubmissionModel.create(self.url)
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
            "submission_id": model.submission_id,
            "execution_json": json.dumps(execution_json),
            "code_json": json.dumps(model.file("code.json")),
            "host_json": json.dumps(model.file("host.json")),
            "started_at": pendulum.parse(execution_json["started_at"]),
        }
        table = self._db["submissions"]
        table.insert(row)
        return row

    def as_submission(self):
        return Submission(self)


class SqlSubmissionComponentModel(SqlBaseModel, FileSystemSubmissionComponentModel):
    @property
    def filesystem_model(self):
        if self._filesystem_model is None:
            self._filesystem_model = SubmissionComponentModel.create(self.url)
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

    def _add(self, submission):
        SqlSubmissionModel(submission, database=self._db).insert(submission)

    def _find(self, submission_id: str):
        table = self._table("submissions")
        model = table.find_one(submission_id=submission_id)
        if model is None:
            return None

        return SqlSubmissionModel(model, database=self._db).as_submission()

    def _find_latest(self, limit=10, since=None):
        table = self._table("submissions")
        if since is None:
            condition = {"<=": pendulum.now()}
        else:
            condition = {">": since}
        return [
            SqlSubmissionModel(model, database=self._db).as_submission()
            for model in table.find(
                started_at=condition, _limit=limit, order_by="started_at"
            )
        ]

    def _find_all(self):
        table = self._table("submissions")
        return table.all()

    def _table(self, name):
        self._migrate()
        return self._db[name]

    def _migrate(self):
        if self._migrated is True:
            return

        table = self._db["submissions"]
        table.create_column("url", self._db.types.string)
        table.create_column("submission_id", self._db.types.string)
        table.create_column("started_at", self._db.types.datetime)
        table.create_column("finished_at", self._db.types.datetime)
        table.create_column("trashed_at", self._db.types.datetime)
        table.create_column("execution_json", self._db.types.json)
        table.create_column("code_json", self._db.types.json)
        table.create_column("host_json", self._db.types.json)
        table.create_column("label", self._db.types.text)
        table.create_column("comments", self._db.types.text)
        table.create_column("meta", self._db.types.json)

        table = self._db["components"]
        table.create_column("url", self._db.types.string)
        table.create_column("submission_id", self._db.types.string)
        table.create_column("component_id", self._db.types.string)
        table.create_column("started_at", self._db.types.datetime)
        table.create_column("finished_at", self._db.types.datetime)
        table.create_column("component_json", self._db.types.json)
        table.create_column("components_json", self._db.types.json)
        table.create_column("state_json", self._db.types.json)
        table.create_column("host_json", self._db.types.json)
        table.create_column("meta", self._db.types.json)

        self._migrated = True

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"Index <sql+{self.database}>"
