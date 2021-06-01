from typing import Any, List, Optional

import os

import arrow
from machinable import schema, storage
from machinable.storage.storage import Storage
from machinable.utils import load_file, save_file


class FilesystemStorage(Storage):
    def path(self, *append: str) -> str:
        return os.path.join(os.path.abspath(self.config.path), *append)

    def local_directory(experiment_storage_id: str, *append: str):
        return os.path.join(experiment_storage_id, *append)

    def retrieve_file(self, filepath: str, reload=None) -> Any:
        """Returns the content of a file in the submission's storage

        # Arguments
        filepath: Relative filepath
        default: Optional default if file does not exist
        reload: If True, cache will be ignored. If datetime, file will be reloaded
                if cached version is older than the date
        """
        if reload is None:
            finished_at = self.finished_at
            if finished_at is False:
                reload = True
            else:
                reload = finished_at

        if "_files" not in self._cache:
            self._cache["_files"] = {}

        if isinstance(reload, pendulum.DateTime):
            try:
                loaded_at = self._cache["_files"][filepath]["loaded_at"]
                # buffer reloading by 1 second
                reload = reload >= loaded_at.add(seconds=1)
            except KeyError:
                reload = True

        if filepath not in self._cache or reload:
            try:
                self._cache[filepath] = self._model.file(filepath)
                if filepath not in self._cache["_files"]:
                    self._cache["_files"][filepath] = {}
                self._cache["_files"][filepath]["loaded_at"] = arrow.now()
            except FileNotFoundError:
                if default is not sentinel:
                    return default
                raise

        return self._cache[filepath]

    def retrieve_related(self, relation: str, model: schema.Model):
        # todo: check that model belongs to this storage via type identifier
        assert model._storage_instance is self

        if isinstance(model, schema.Experiment):
            if relation == "execution":
                return self.retrieve_execution(
                    os.path.join(model._storage_id, "execution")
                )
        if isinstance(model, schema.Execution):
            if relation == "experiments":
                return [
                    self.retrieve_experiment(
                        os.path.normpath(os.path.join(model._storage_id, p))
                    )
                    for p in load_file(
                        os.path.join(model._storage_id, "execution.json")
                    )["_related_experiments"]
                ]

    def create_record(
        self,
        record: schema.Record,
        experiment: schema.Experiment,
        scope: str = "default",
    ) -> schema.Record:
        if experiment is None:
            raise ValueError("Invalid experiment")

        if experiment._storage_instance is not self:
            experiment._storage_instance = self
            experiment._storage_id = experiment.find_experiment(
                experiment.experiment_id
            )

        if experiment._storage_id is None:
            raise ValueError(
                f"Experiment {experiment.experiment_id} does not exist"
            )

        record._storage_id = self._create_record(record, experiment, scope)
        record._storage_instance = self

        return record

    def _create_record(
        self,
        record: schema.Record,
        experiment: schema.Experiment,
        scope: str = "default",
    ) -> str:
        save_file(
            os.path.join(experiment._storage_id, "records", f"{scope}.jsonl"),
            {"__timestamp": record.timestamp, **record.data},
            mode="a",
        )
        return "n/a"

    def create_execution(
        self,
        project: schema.Project,
        execution: schema.Execution,
        experiments: List[schema.Experiment],
        grouping: Optional[schema.Grouping] = None,
    ) -> schema.Execution:

        storage_id = self._create_execution(execution, experiments, grouping)

        execution._storage_id = storage_id
        execution._storage_instance = self

        return execution

    def _create_execution(
        self,
        execution: schema.Execution,
        experiments: List[schema.Experiment],
        grouping: Optional[schema.Grouping],
    ) -> str:
        primary_directory = None
        for i, experiment in enumerate(experiments):
            self.create_experiment(
                experiment=experiment, execution=execution, grouping=grouping
            )
            execution_directory = os.path.join(
                experiment._storage_id, "execution"
            )
            if i == 0:
                # create primary directory
                primary_directory = execution_directory
                os.makedirs(primary_directory)
            else:
                # symlink to primary directory
                os.symlink(
                    primary_directory,
                    execution_directory,
                    target_is_directory=True,
                )
        # write execution data
        save_file(
            os.path.join(execution_directory, "execution.json"),
            {
                **execution.dict(),
                "_related_experiments": [
                    f"../../{os.path.basename(experiment._storage_id)}"
                    for experiment in experiments
                ],
            },
        )

        # todo: commit to database
        return primary_directory

    def create_experiment(
        self,
        experiment: schema.Experiment,
        execution: schema.Execution,
        grouping: schema.Grouping,
    ) -> schema.Experiment:
        storage_id = self._create_experiment(experiment, execution, grouping)

        experiment._storage_id = storage_id
        experiment._storage_instance = self

        return experiment

    def _create_experiment(
        self,
        experiment: schema.Experiment,
        execution: schema.Execution,
        grouping: schema.Grouping,
    ) -> str:
        grouping = self.create_grouping(grouping)

        path, prefix = os.path.split(grouping._storage_id)

        timestamp = int(execution.timestamp)

        storage_id = self.path(
            path,
            f"{prefix}-{experiment.experiment_id}-{arrow.get(timestamp)}",
        )

        save_file(
            os.path.join(storage_id, "experiment.json"),
            experiment.dict(),
            makedirs=True,
        )

        return storage_id

    def create_grouping(self, grouping: schema.Grouping) -> schema.Grouping:
        storage_id = self._create_grouping(grouping)

        grouping._storage_id = storage_id
        grouping._storage_instance = self

        return grouping

    def _create_grouping(self, grouping: schema.Grouping) -> str:
        # directory is created implicitly during experiment creation
        # so we just return the resolved group
        return grouping.resolved_group

    def find_experiment(
        self, experiment_id: str, timestamp: float = None
    ) -> Optional[str]:
        """Searches for experiment

        # Arguments
        experiment_id:
        timestamp: Only required if the experiment_id is ambigious

        Returns the storage_id or None if experiment cannot be found
        """
        return None

    def update_heartbeat(
        self,
        storage_id: str,
        mark_finished=False,
        timestamp: Optional[float] = None,
    ) -> arrow.Arrow:
        if timestamp is None:
            timestamp = arrow.now()
        save_file(os.path.join(storage_id, "heartbeat_at"), timestamp, mode="w")
        if mark_finished:
            save_file(os.path.join(storage_id, "finished_at"), timestamp)
        return timestamp

    def mark_started(
        self, storage_id: str, timestamp: Optional[float] = None
    ) -> float:
        if timestamp is None:
            timestamp = arrow.now()
        save_file(os.path.join(storage_id, "started_at"), timestamp)

    def retrieve_status(
        self,
    ):
        pass

    def retrieve_execution(self, storage_id: str) -> schema.Execution:
        execution = self._retrieve_execution(storage_id)
        execution._storage_id = storage_id
        execution._storage_instance = self

        return execution

    def _retrieve_execution(self, storage_id: str) -> schema.Execution:
        return schema.Execution(
            **load_file(os.path.join(storage_id, "execution.json")),
        )

    def retrieve_experiment(self, storage_id: str) -> schema.Experiment:
        experiment = self._retrieve_experiment(storage_id)
        experiment._storage_id = storage_id
        experiment._storage_instance = self

        return experiment

    def _retrieve_experiment(self, storage_id: str) -> schema.Experiment:
        return schema.Experiment(
            **load_file(os.path.join(storage_id, "experiment.json")),
        )
