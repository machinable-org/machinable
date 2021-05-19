from typing import List, Optional

import json
import os

import arrow
import jsonlines
from machinable.schema import (
    ExecutionType,
    ExperimentType,
    RecordType,
    RepositoryType,
    SchemaType,
)
from machinable.storage.storage import Storage
from machinable.utils import load_file, sanitize_path, save_file, serialize


class FilesystemStorage(Storage):
    def path(self, *append):
        return os.path.join(os.path.abspath(self.config.path), *append)

    def retrieve_related(self, relation: str, model: SchemaType):
        # todo: check that model belongs to this storage via type identifier
        assert model._storage_instance is self

        if isinstance(model, ExperimentType):
            if relation == "execution":
                return self.retrieve_execution(
                    os.path.join(model._storage_id, "execution")
                )
        if isinstance(model, ExecutionType):
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
        record: RecordType,
        experiment: ExperimentType,
        scope: str = "default",
    ) -> RecordType:
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
        record: RecordType,
        experiment: ExperimentType,
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
        execution: ExecutionType,
        experiments: List[ExperimentType],
        repository: Optional[RepositoryType] = None,
    ) -> ExecutionType:
        if repository is None:
            repository = RepositoryType()  # root repo

        storage_id = self._create_execution(execution, experiments, repository)

        execution._storage_id = storage_id
        execution._storage_instance = self

        return execution

    def _create_execution(
        self,
        execution: ExecutionType,
        experiments: List[ExperimentType],
        repository: Optional[RepositoryType],
    ) -> str:
        timestamp = int(execution.timestamp)
        timestr = arrow.get(timestamp).format(arrow.FORMAT_RFC3339)

        # todo: create repo if not existing

        primary_directory = None
        for i, experiment in enumerate(experiments):
            # write experiment
            directory = self.path(
                sanitize_path(repository.name)
                if repository is not None
                else "",
                f"{experiment.experiment_id}-{timestr}",
            )

            # save experiment
            save_file(
                os.path.join(directory, "experiment.json"),
                experiment.dict(),
                makedirs=True,
            )
            save_file(os.path.join(directory, "started_at"), arrow.now())
            experiment._storage_id = directory
            experiment._storage_instance = self

            execution_directory = os.path.join(directory, "execution")
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
            os.path.join(directory, "execution", "execution.json"),
            {
                **execution.dict(),
                "_related_experiments": [
                    f"../../{experiment.experiment_id}-{timestr}"
                    for experiment in experiments
                ],
            },
        )

        # todo: commit to database
        return primary_directory

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
        self, storage_id: str, mark_finished=False, timestamp=None
    ) -> arrow.Arrow:
        if timestamp is None:
            timestamp = arrow.now()
        save_file(os.path.join(storage_id, "heartbeat_at"), timestamp, mode="w")
        if mark_finished:
            save_file(os.path.join(storage_id, "finished_at"), timestamp)
        return timestamp

    def retrieve_execution(self, storage_id: str) -> ExecutionType:
        execution = self._retrieve_execution(storage_id)
        execution._storage_id = storage_id
        execution._storage_instance = self

        return execution

    def _retrieve_execution(self, storage_id: str) -> ExecutionType:
        return ExecutionType(
            **load_file(os.path.join(storage_id, "execution.json")),
        )

    def retrieve_experiment(self, storage_id: str) -> ExperimentType:
        experiment = self._retrieve_experiment(storage_id)
        experiment._storage_id = storage_id
        experiment._storage_instance = self

        return experiment

    def _retrieve_experiment(self, storage_id: str) -> ExperimentType:
        return ExperimentType(
            **load_file(os.path.join(storage_id, "experiment.json")),
        )
