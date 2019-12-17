import json

from orator import Model
from orator.orm import belongs_to, has_many, scope

from ....utils.formatting import str_to_time


class Task(Model):

    __guarded__ = ['id']

    __dates__ = ['started', 'heartbeat', 'finished']

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
        return query.where('storage_id', storage_id)

    def filesystem(self):
        return self.storage.filesystem().opendir(self.path)

    def index(self, filesystem=None):
        from .observation import Observation

        if filesystem is None:
            filesystem = self.filesystem()

        # delete all stored observations of this task before re-indexing
        Observation.belongs_to_task(self.id).delete()

        for directory in filesystem.listdir(''):
            if len(directory) == 12:
                Observation.createFromFile(filesystem, path=directory, task_id=self.id)

    @classmethod
    def createFromFile(cls, filesystem, path, **attributes):
        """
        Save a new task read from filesystem and return the instance.

        :param attributes: The instance attributes
        :type attributes: dict

        :return: The new instance
        :rtype: Task
        """
        task_fs = filesystem.opendir(path)

        if not task_fs.isfile('task.json'):
            return False

        # attributes
        with task_fs.open('task.json', 'r') as f:
            try:
                data = json.load(f)
            except json.decoder.JSONDecodeError:
                data = {}

        attributes.setdefault('name', data.get('name'))
        attributes.setdefault('task_id', data.get('id'))
        attributes.setdefault('execution_id', data.get('execution_id'))
        attributes.setdefault('seed', data.get('seed'))
        attributes.setdefault('tune', data.get('tune'))
        attributes.setdefault('rerun', int(data.get('rerun')))
        attributes.setdefault('code_backup', bool(data.get('code_backup')))
        attributes.setdefault('code_version', json.dumps(data.get('code_version')))

        # status
        if task_fs.isfile('status.json'):
            with task_fs.open('status.json', 'r') as f:
                try:
                    status = json.load(f)
                except json.decoder.JSONDecodeError:
                    status = {}
            attributes.setdefault('observations_count', status.get('observations_count'))
            attributes.setdefault('started', str_to_time(status.get('started')))
            attributes.setdefault('heartbeat', str_to_time(status.get('heartbeat')))
            attributes.setdefault('finished', str_to_time(status.get('finished')))

        model = cls.first_or_create(path=path, **attributes)

        model.index(task_fs)

        return model


def deleting(task):
    # clean up observations
    from .observation import Observation
    Observation.belongs_to_task(task.id).delete()


Task.deleting(deleting)
