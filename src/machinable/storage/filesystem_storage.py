from typing import Any, List, Optional

import os

import arrow
from machinable import schema
from machinable.storage.storage import Storage
from machinable.types import DatetimeType, JsonableType
from machinable.utils import load_file, save_file
from pydantic.types import Json


class FilesystemStorage(Storage):
    class Config:
        """Config annotation"""

        directory: str

    def _create_execution(
        self,
        execution: schema.Execution,
        experiments: List[schema.Experiment],
        grouping: Optional[schema.Grouping],
        project: schema.Project,
    ) -> str:
        primary_directory = None
        for i, experiment in enumerate(experiments):
            self.create_experiment(
                experiment=experiment,
                execution=execution,
                grouping=grouping,
                project=project,
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

        # TODO: commit to database
        return primary_directory

    def _create_experiment(
        self,
        experiment: schema.Experiment,
        execution: schema.Execution,
        grouping: schema.Grouping,
        project: schema.Project,
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

    def _create_grouping(self, grouping: schema.Grouping) -> str:
        # directory is created implicitly during experiment creation
        # so we just return the resolved group
        return grouping.resolved_group

    def _create_record(
        self,
        experiment: schema.Experiment,
        data: JsonableType,
        scope: str = "default",
    ) -> str:
        return save_file(
            os.path.join(experiment._storage_id, "records", f"{scope}.jsonl"),
            data=data,
            mode="a",
        )

    def _mark_started(self, storage_id: str, timestamp: DatetimeType) -> None:
        save_file(os.path.join(storage_id, "started_at"), str(timestamp))

    def _update_heartbeat(
        self,
        storage_id: str,
        timestamp: DatetimeType,
        mark_finished=False,
    ) -> None:
        save_file(
            os.path.join(storage_id, "heartbeat_at"), str(timestamp), mode="w"
        )
        if mark_finished:
            save_file(os.path.join(storage_id, "finished_at"), str(timestamp))

    def _retrieve_status(
        self, experiment_storage_id: str, field: str
    ) -> Optional[str]:
        return load_file(
            os.path.join(experiment_storage_id, f"{field}_at"), default=None
        )

    def find_experiment(
        self, experiment_id: str, timestamp: float = None
    ) -> Optional[str]:
        return None

    def _retrieve_execution(self, storage_id: str) -> schema.Execution:
        return schema.Execution(
            **load_file(os.path.join(storage_id, "execution.json")),
        )

    def _retrieve_experiment(self, storage_id: str) -> schema.Experiment:
        return schema.Experiment(
            **load_file(os.path.join(storage_id, "experiment.json")),
        )

    def _retrieve_records(
        self, experiment_storage_id: str, scope: str
    ) -> List[JsonableType]:
        return load_file(
            os.path.join(experiment_storage_id, "records", f"{scope}.jsonl")
        )

    def path(self, *append: str) -> str:
        return os.path.join(os.path.abspath(self.config.directory), *append)

    def _local_directory(
        self, experiment_storage_id: str, *append: str
    ) -> Optional[str]:
        return os.path.join(experiment_storage_id, *append)

    def find_related(self, storage_id: str, relation: str) -> Optional[str]:
        if relation == "experiment.execution":
            return os.path.join(storage_id, "execution")
        elif relation == "execution.experiments":
            return [
                os.path.normpath(os.path.join(storage_id, p))
                for p in load_file(os.path.join(storage_id, "execution.json"))[
                    "_related_experiments"
                ]
            ]

    def _create_file(
        self, experiment_storage_id: str, filepath: str, data: Any
    ) -> str:
        return save_file(
            os.path.join(experiment_storage_id, filepath), data, makedirs=True
        )

    def _retrieve_file(
        self, experiment_storage_id: str, filepath: str
    ) -> Optional[Any]:
        return load_file(
            os.path.join(experiment_storage_id, filepath), default=None
        )
