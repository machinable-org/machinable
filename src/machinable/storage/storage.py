from typing import TYPE_CHECKING, Any, List, Optional, Union

import os

import arrow
from machinable import schema
from machinable.collection import ExperimentCollection
from machinable.component import Component
from machinable.group import Group, resolve_group
from machinable.project import Project
from machinable.types import (
    DatetimeType,
    JsonableType,
    TimestampType,
    VersionType,
)
from machinable.utils import Jsonable

if TYPE_CHECKING:
    from machinable.element import Element
    from machinable.execution import Execution
    from machinable.experiment import Experiment


class Storage(Component):
    """Storage base class"""

    @classmethod
    def make(
        cls,
        name: Optional[str] = None,
        version: VersionType = None,
        parent: Union["Element", "Component", None] = None,
    ) -> "Storage":
        return super().make(name, version, parent)

    @classmethod
    def filesystem(cls, directory: Optional[str] = None) -> "Storage":
        return cls.make(
            "machinable.storage.filesystem_storage",
            version={"directory": directory},
        )

    @classmethod
    def multiple(cls, primary: "Storage", *secondary: "Storage") -> "Storage":
        if len(secondary) == 0:
            return primary

        from machinable.storage.multiple_storage import MultipleStorage

        return MultipleStorage(primary, *secondary)

    def create_execution(
        self,
        execution: Union["Execution", schema.Execution],
        experiments: List[Union["Experiment", schema.Experiment]],
    ) -> schema.Execution:
        from machinable.execution import Execution
        from machinable.experiment import Experiment

        execution = Execution.model(execution)

        target_experiments = []
        for experiment in experiments:
            experiment = Experiment.model(experiment)
            if self.find_experiment(
                experiment.experiment_id, experiment.timestamp
            ):
                target_experiments.append(experiment)

        storage_id = self._create_execution(
            execution=execution, experiments=target_experiments
        )
        assert storage_id is not None

        execution._storage_id = storage_id
        execution._storage_instance = self

        return execution

    def _create_execution(
        self,
        execution: schema.Execution,
        experiments: List[schema.Experiment],
    ) -> str:
        raise NotImplementedError

    def create_experiment(
        self,
        experiment: schema.Experiment,
        group: schema.Group,
        project: schema.Project,
    ) -> schema.Experiment:
        from machinable.experiment import Experiment

        experiment = Experiment.model(experiment)
        group = Group.model(group)
        project = Project.model(project)

        storage_id = self._create_experiment(experiment, group, project)
        assert storage_id is not None

        experiment._storage_id = storage_id
        experiment._storage_instance = self

        return experiment

    def _create_experiment(
        self,
        experiment: schema.Experiment,
        group: schema.Group,
        project: schema.Project,
    ) -> str:
        raise NotImplementedError

    def create_group(self, group: Union[Group, schema.Group]) -> schema.Group:
        group = Group.model(group)
        if group.path is None:
            _, group.path = resolve_group(group.pattern)

        storage_id = self._create_group(group)
        assert storage_id is not None

        group._storage_id = storage_id
        group._storage_instance = self

        return group

    def _create_group(self, group: schema.Group) -> str:
        raise NotImplementedError

    def create_record(
        self,
        experiment: Union["Experiment", schema.Experiment],
        data: JsonableType,
        scope: str = "default",
        timestamp: Optional[TimestampType] = None,
    ) -> JsonableType:
        from machinable.experiment import Experiment

        if timestamp is None:
            timestamp = arrow.now()
        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)

        experiment = Experiment.model(experiment)

        if experiment._storage_id is None:
            raise ValueError(
                f"Experiment {experiment.experiment_id} does not exist"
            )

        record = {**data, "__timestamp": str(timestamp)}

        self._create_record(experiment, record, scope)

        return record

    def _create_record(
        self,
        experiment: schema.Experiment,
        data: JsonableType,
        scope: str = "default",
    ) -> str:
        raise NotImplementedError

    def create_file(
        self,
        experiment: Union["Experiment", schema.Experiment],
        filepath: str,
        data: Any,
    ) -> Optional[Any]:
        from machinable.experiment import Experiment

        experiment = Experiment.model(experiment)
        return self._create_file(experiment._storage_id, filepath, data)

    def _create_file(
        self, experiment_storage_id: str, filepath: str, data: Any
    ) -> str:
        raise NotImplementedError

    def retrieve_execution(self, storage_id: str) -> schema.Execution:
        execution = self._retrieve_execution(storage_id)
        execution._storage_id = storage_id
        execution._storage_instance = self

        return execution

    def retrieve_executions(
        self, storage_ids: List[str]
    ) -> List[schema.Execution]:
        return [
            self.retrieve_execution(storage_id) for storage_id in storage_ids
        ]

    def _retrieve_execution(self, storage_id: str) -> schema.Execution:
        raise NotImplementedError

    def retrieve_experiment(self, storage_id: str) -> schema.Experiment:
        experiment = self._retrieve_experiment(storage_id)
        experiment._storage_id = storage_id
        experiment._storage_instance = self

        return experiment

    def retrieve_experiments(
        self, storage_ids: List[str]
    ) -> List[schema.Experiment]:
        return [
            self.retrieve_experiment(storage_id) for storage_id in storage_ids
        ]

    def _retrieve_experiment(self, storage_id: str) -> schema.Experiment:
        raise NotImplementedError

    def retrieve_group(self, storage_id: str) -> schema.Group:
        group = self._retrieve_group(storage_id)
        group._storage_id = storage_id
        group._storage_instance = self

        return group

    def _retrieve_group(self, storage_id: str) -> schema.Group:
        raise NotImplementedError

    def retrieve_records(
        self,
        experiment: Union["Experiment", schema.Experiment],
        scope: str = "default",
    ) -> List[JsonableType]:
        from machinable.experiment import Experiment

        experiment = Experiment.model(experiment)

        return self._retrieve_records(experiment._storage_id, scope)

    def _retrieve_records(
        self, experiment_storage_id: str, scope: str
    ) -> List[JsonableType]:
        raise NotImplementedError

    def retrieve_file(
        self, experiment: Union["Experiment", schema.Experiment], filepath: str
    ) -> Optional[Any]:
        from machinable.experiment import Experiment

        experiment = Experiment.model(experiment)
        return self._retrieve_file(experiment._storage_id, filepath)

    def _retrieve_file(
        self, experiment_storage_id: str, filepath: str
    ) -> Optional[Any]:
        raise NotImplementedError

    def retrieve_output(
        self, experiment: Union["Experiment", schema.Experiment]
    ) -> Optional[str]:
        from machinable.experiment import Experiment

        experiment = Experiment.model(experiment)
        return self._retrieve_output(experiment._storage_id)

    def _retrieve_output(self, experiment_storage_id: str) -> str:
        raise NotImplementedError

    def local_directory(
        self,
        experiment: Union["Experiment", schema.Experiment],
        *append: str,
        create: bool = False,
    ) -> Optional[str]:
        from machinable.experiment import Experiment

        experiment = Experiment.model(experiment)

        local_directory = self._local_directory(experiment._storage_id, *append)

        if create:
            os.makedirs(local_directory, exist_ok=True)

        return local_directory

    def _local_directory(
        self, experiment_storage_id: str, *append: str
    ) -> Optional[str]:
        raise NotImplementedError

    def mark_started(
        self,
        experiment: Union["Experiment", schema.Experiment],
        timestamp: Optional[TimestampType] = None,
    ) -> DatetimeType:
        from machinable.experiment import Experiment

        experiment = Experiment.model(experiment)
        if timestamp is None:
            timestamp = arrow.now()
        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)
        self._mark_started(experiment, timestamp)

        return timestamp

    def _mark_started(
        self, experiment: schema.Experiment, timestamp: DatetimeType
    ) -> None:
        raise NotImplementedError

    def update_heartbeat(
        self,
        experiment: Union["Experiment", schema.Experiment],
        timestamp: Union[float, int, DatetimeType, None] = None,
        mark_finished=False,
    ) -> DatetimeType:
        from machinable.experiment import Experiment

        experiment = Experiment.model(experiment)
        if timestamp is None:
            timestamp = arrow.now()
        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)
        self._update_heartbeat(experiment, timestamp, mark_finished)
        return timestamp

    def _update_heartbeat(
        self,
        experiment: schema.Experiment,
        timestamp: DatetimeType,
        mark_finished=False,
    ) -> None:
        raise NotImplementedError

    def retrieve_status(
        self, experiment: Union["Experiment", schema.Experiment], field: str
    ) -> Optional[DatetimeType]:
        from machinable.experiment import Experiment

        experiment = Experiment.model(experiment)
        fields = ["started", "heartbeat", "finished"]
        if field not in fields:
            raise ValueError(f"Invalid field: {field}. Must be on of {fields}")
        status = self._retrieve_status(experiment._storage_id, field)
        if status is None:
            return None

        return arrow.get(status)

    def _retrieve_status(
        self, experiment_storage_id: str, field: str
    ) -> Optional[str]:
        raise NotImplementedError

    def find_experiment(
        self, experiment_id: str, timestamp: int = None
    ) -> Optional[str]:
        return self._find_experiment(experiment_id, timestamp)

    def _find_experiment(
        self, experiment_id: str, timestamp: int = None
    ) -> Optional[str]:
        raise NotImplementedError

    def retrieve_related(
        self, storage_id: str, relation: str
    ) -> Optional[schema.Model]:
        relations = {
            "experiment.execution": "execution",
            "execution.experiments": "experiments",
            "group.experiments": "experiments",
            "experiment.group": "group",
            "experiment.ancestor": "experiment",
            "experiment.derived": "experiments",
        }

        if relation not in relations:
            raise ValueError(
                f"Invalid relation: {relation}. Must be one of {list(relations.keys())}"
            )

        related = self.find_related(storage_id, relation)
        if related is None:
            return None

        return getattr(self, "retrieve_" + relations[relation])(related)

    def find_related(
        self, storage_id: str, relation: str
    ) -> Optional[Union[str, List[str]]]:
        return self._find_related(storage_id, relation)

    def _find_related(
        self, storage_id: str, relation: str
    ) -> Optional[Union[str, List[str]]]:
        raise NotImplementedError

    def _retrieve_file(
        self, experiment_storage_id: str, filepath: str
    ) -> Optional[Any]:
        raise NotImplementedError
