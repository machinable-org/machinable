import json

from ...config.mapping import config_map
from .status import StatusTrait


class Task(StatusTrait):

    def __init__(self, model):
        self._model = model

    @property
    def id(self):
        """6-digit task ID, e.g. #F4K3r6"""
        return self._model.task_id

    @property
    def execution_id(self):
        """Returns the execution ID"""
        return self._model.execution_id

    @property
    def name(self):
        """Returns the name of the task"""
        return self._model.name

    @property
    def seed(self):
        """Returns the global random seed used in the task"""
        return self._model.seed

    @property
    def tune(self):
        """True if task is a tuning task"""
        return self._model.tune

    @property
    def rerun(self):
        """Number of rerun"""
        return self._model.rerun

    @property
    def code_backup(self):
        """True if code backup is available"""
        return self._model.code_backup

    @property
    def code_version(self):
        """Returns information about the source code version as a dictionary

        ```
        project:
          path: VCS url
          commit: Commit hash or None
          is_dirty: Whether everything has been commited to VCS
        vendor: List of vendor project information with the same structure as above
        ```
        """
        return config_map(json.loads(self._model.code_version))

    @property
    def observations_count(self):
        """Returns the number of observations in this task"""
        return self._model.observations_count

    def __str__(self):
        return self.id

    def __repr__(self):
        return f'Task <{self.id}>'
