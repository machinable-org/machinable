import os

from orator import Model
from orator.orm import has_many
from fs import open_fs
from fs.base import FS
from fs.errors import CreateFailed as CreateFailedException


class Storage(Model):

    __guarded__ = ['id']

    @has_many
    def tasks(self):
        from .task import Task
        return Task

    def filesystem(self):
        return open_fs(self.url)

    def available(self):
        try:
            return self.filesystem().exists('.')
        except CreateFailedException:
            return False

    @classmethod
    def get_url(cls, path):
        storage = os.path.expanduser(path)

        if "://" not in storage:
            storage = "osfs://" + storage

        return storage

    @classmethod
    def whereUrl(cls, storage):
        query = cls.query()
        return query.where('url', cls.get_url(storage))

    def index(self, filesystem=None):
        from .task import Task

        if filesystem is None:
            try:
                filesystem = self.filesystem()
            except CreateFailedException:
                filesystem = False

        # delete all stored task of this filesystem before re-indexing
        for task in Task.belongs_to_storage(self.id).get():
            # explicit such that delete event is triggered that cleans up the observations
            task.delete()

        # remove not available filesystem
        if not isinstance(filesystem, FS):
            self.delete()
            if isinstance(filesystem, CreateFailedException):
                raise filesystem
            else:
                raise CreateFailedException('Invalid filesystem: ' + str(filesystem))

        for directory in filesystem.listdir(''):
            if len(directory) == 6:
                Task.createFromFile(filesystem, path=directory, storage_id=self.id)

            if directory == '_reruns':
                rerun = 1
                while filesystem.isdir('_reruns/' + str(rerun)):
                    # find subtasks
                    for rerun_task in filesystem.listdir('_reruns/' + str(rerun)):
                        if len(rerun_task) == 6:
                            Task.createFromFile(filesystem,
                                                path='_reruns/' + str(rerun) + '/' + rerun_task,
                                                storage_id=self.id)
                    rerun += 1

        self.indexed = True
        self.save()
        return True


def deleting(storage):
    # clean up tasks
    from .task import Task
    Task.belongs_to_storage(storage.id).delete()


Storage.deleting(deleting)
