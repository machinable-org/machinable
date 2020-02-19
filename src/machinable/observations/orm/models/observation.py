import os
import json
try:
    import cPickle as pickle
except ImportError:
    import pickle

from orator import Model
from orator.orm import belongs_to, scope
from orator.exceptions.query import QueryException

from ....utils.formatting import str_to_time


class Observation(Model):

    __guarded__ = ['id']

    __dates__ = ['started', 'heartbeat', 'finished']

    @belongs_to
    def task(self):
        from .task import Task
        return Task

    @scope
    def belongs_to_task(self, query, task_id):
        return query.where('task_id', task_id)

    def storage(self):
        return self.task.storage

    def filesystem(self, path=''):
        return self.task.filesystem().opendir(os.path.join(self.path, path))

    def load_file(self, filename, meta=False, filesystem=None, default=None):
        if filesystem is None:
            filesystem = self.filesystem()

        name, ext = os.path.splitext(filename)

        path = 'storage/' if not meta else ''
        filepath = path + filename

        if not filesystem.exists(filepath):
            return FileNotFoundError if default is None else default

        if ext == '.p':
            with filesystem.open(filepath, 'rb') as f:
                data = pickle.load(f)
        elif ext == '.json':
            with filesystem.open(filepath, 'r') as f:
                data = json.load(f)

        elif ext == '.npy':
            import numpy as np
            with filesystem.open(filepath, 'rb') as f:
                data = np.load(f, allow_pickle=True)

        elif ext == '.txt':
            with filesystem.open(filepath, 'r') as f:
                data = f.read()
        else:
            raise ValueError('Invalid file format')

        return data

    @classmethod
    def createFromFile(cls, filesystem, path, **attributes):
        """
        Save a new children read from filesystem an return the instance.

        :param attributes: The instance attributes
        :type attributes: dict

        :return: The new instance
        :rtype: Children
        """
        task_fs = filesystem.opendir(path)

        # attributes
        if task_fs.isfile('observation.json'):
            with task_fs.open('observation.json', 'r') as f:
                try:
                    data = json.load(f)
                except json.decoder.JSONDecodeError:
                    data = {}
            attributes.setdefault('node', data.get('node'))
            attributes.setdefault('children', ','.join(data.get('children', [])))
            attributes.setdefault('execution_index', data.get('execution_index'))

        # status
        if task_fs.isfile('status.json'):
            with task_fs.open('status.json', 'r') as f:
                try:
                    status = json.load(f)
                except json.decoder.JSONDecodeError:
                    status = {}
            attributes.setdefault('started', str_to_time(status.get('started')))
            attributes.setdefault('heartbeat', str_to_time(status.get('heartbeat')))
            attributes.setdefault('finished', str_to_time(status.get('finished')))
        try:
            model = cls.first_or_create(path=path, **attributes)
        except QueryException:
            model = None

        return model
