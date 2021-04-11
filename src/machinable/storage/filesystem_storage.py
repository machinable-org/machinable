from typing import List, Optional

import os

import pendulum
from machinable.component.component import Component
from machinable.element.element import Element
from machinable.execution.execution import Execution
from machinable.experiment.experiment import Experiment
from machinable.filesystem.filesystem import FileSystem
from machinable.schema import (
    ExecutionType,
    ExperimentType,
    RepositoryType,
    SchemaType,
)
from machinable.storage.storage import Storage
from machinable.utils import load_file, sanitize_path, save_file


class FilesystemStorage(Storage):
    def __init__(self, url: str):
        self.url: str = url
        # todo: create and connect to database
        self.database = None

    def path(self, *append):
        return os.path.join(os.path.abspath(self.url), *append)

    def retrieve_related(self, model: SchemaType, relation: str):
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

    def find_related(
        self,
        storage_id: str,
    ):
        pass

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
        dt = pendulum.from_timestamp(timestamp).to_rfc3339_string()

        # todo: create repo if not existing

        primary_directory = None
        for i, experiment in enumerate(experiments):
            # write experiment
            directory = self.path(
                sanitize_path(repository.name)
                if repository is not None
                else "",
                f"{experiment.experiment_id}-{dt}",
            )
            self.save_experiment(directory, experiment)
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
                    f"../../{experiment.experiment_id}-{dt}"
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
        pass

    def save_experiment(
        self, storage_id: str, experiment: ExperimentType
    ) -> None:
        save_file(
            os.path.join(storage_id, "experiment.json"),
            experiment.dict(),
            makedirs=True,
        )

        experiment._storage_id = storage_id
        experiment._storage_instance = self

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
