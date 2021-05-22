from typing import List, Optional, Tuple

import os

import arrow
from machinable import schema
from machinable.storage.storage import Storage
from machinable.utils import load_file, sanitize_path, save_file


class FilesystemStorage(Storage):
    def path(self, *append):
        return os.path.join(os.path.abspath(self.config.path), *append)

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
        timestamp = int(execution.timestamp)
        timestr = arrow.get(timestamp).format(arrow.FORMAT_RFC3339)

        # todo: create repo if not existing

        primary_directory = None
        for i, experiment in enumerate(experiments):
            # write experiment
            directory = self.path(
                sanitize_path(grouping.resolved_group),
                f"{experiment.experiment_id}-{timestr}",
            )

            # TODO: refactor into own method such that storage_id, storage_instance is set automatically

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
