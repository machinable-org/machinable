import json

import pendulum
from orator import Model
from orator.orm import belongs_to, has_many, scope


class Task(Model):

    __guarded__ = ["id"]

    __dates__ = ["started", "heartbeat", "finished"]

    @belongs_to
    def storage(self):
        from .storage import Storage

        return Storage

    @has_many
    def observations(self):
        from .observation import Observation

        return Observation

    @scope
    def belongs_to_storage(self, query, storage_id):
        return query.where("storage_id", storage_id)

    def filesystem(self):
        return self.storage.filesystem().opendir(self.path)

    def index(self, filesystem=None):
        from .observation import Observation

        if filesystem is None:
            filesystem = self.filesystem()

        # delete all stored observations of this experiment before re-indexing
        Observation.belongs_to_task(self.id).delete()

        for directory in filesystem.listdir(""):
            if len(directory) == 12:
                Observation.createFromFile(filesystem, path=directory, task_id=self.id)

    @classmethod
    def createFromFile(cls, filesystem, path, **attributes):
        """
        Save a new experiment read from filesystem and return the instance.

        :param attributes: The instance attributes
        :type attributes: dict

        :return: The new instance
        :rtype: Task
        """
        task_fs = filesystem.opendir(path)

        if not task_fs.isfile("execution.json"):
            return False

        # attributes
        with task_fs.open("execution.json", "r") as f:
            try:
                data = json.load(f)
            except json.decoder.JSONDecodeError:
                data = {}

        attributes.setdefault("name", data.get("name"))
        attributes.setdefault("task_id", data.get("id"))
        attributes.setdefault("execution_id", data.get("timestamp"))
        attributes.setdefault("seed", data.get("seed"))
        attributes.setdefault("tune", data.get("tune"))
        attributes.setdefault("execution_cardinality", len(data.get("schedule", [])))
        attributes.setdefault("rerun", int(data.get("rerun", 0)))
        attributes.setdefault("code_backup", bool(data.get("code_backup")))
        attributes.setdefault("code_version", json.dumps(data.get("code_version")))

        attributes.setdefault("observations_count", len(data.get("schedule", [])))
        attributes.setdefault("started", None)

        model = cls.first_or_create(path=path, **attributes)

        model.index(task_fs)

        return model


def deleting(task):
    # clean up observations
    from .observation import Observation

    Observation.belongs_to_task(task.id).delete()


Task.deleting(deleting)
