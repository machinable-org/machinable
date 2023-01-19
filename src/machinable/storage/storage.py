from typing import TYPE_CHECKING, Any, Dict, List, Optional, Union

from machinable import schema
from machinable.element import Element, defaultversion, get_lineage, normversion
from machinable.group import Group
from machinable.project import Project
from machinable.settings import get_settings
from machinable.types import VersionType

if TYPE_CHECKING:
    from machinable.execution import Execution
    from machinable.experiment import Experiment

import os

import arrow
from machinable import schema
from machinable.collection import ExperimentCollection
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


class Storage(Element):
    """Storage base class"""

    kind = "Storage"
    default = get_settings().default_storage

    def __init__(
        self,
        version: VersionType = None,
        default_group: Optional[str] = get_settings().default_group,
    ):
        super().__init__(version=version)
        self.__model__ = schema.Storage(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            default_group=default_group,
            lineage=get_lineage(self),
        )

    @classmethod
    def instance(
        cls,
        module: Optional[str] = None,
        version: VersionType = None,
        default_group: Optional[str] = get_settings().default_group,
    ):
        module, version = defaultversion(module, version, cls)
        return super().make(
            module, version, base_class=Storage, default_group=default_group
        )

    @classmethod
    def filesystem(
        cls,
        directory: str,
        default_group: Optional[str] = get_settings().default_group,
    ) -> "Storage":
        return cls.make(
            "machinable.storage.filesystem",
            version={"directory": directory},
            default_group=default_group,
        )

    def commit(
        self,
        experiments: Union["Experiment", List["Experiment"]],
        execution: Optional["Execution"] = None,
    ) -> None:
        from machinable.experiment import Experiment

        if isinstance(experiments, Experiment):
            experiments = [experiments]
        for experiment in experiments:
            if not isinstance(experiment, Experiment):
                raise ValueError(
                    f"Expected experiment, found: {type(experiment)} {experiment}"
                )
            if experiment.is_mounted():
                continue
            # ensure that configuration has been parsed
            assert experiment.config is not None
            assert experiment.predicate is not None

            group = experiment.group
            if group is None:
                group = Group(self.__model__.default_group)
                experiment.__related__["group"] = group

            self.create_experiment(
                experiment=experiment,
                group=group,
                project=Project.get(),
                uses=[element for element in experiment.uses or []],
            )

            # write deferred experiment data
            for filepath, data in experiment._deferred_data.items():
                experiment.save_file(filepath, data)
            experiment._deferred_data = {}

        if execution is None or execution.is_mounted():
            return

        self.create_execution(execution, experiments)

    @classmethod
    def multiple(cls, primary: "Storage", *secondary: "Storage") -> "Storage":
        if len(secondary) == 0:
            return primary

        from machinable.storage.multiple import Multiple

        return Multiple(primary, *secondary)

    def create_execution(
        self,
        execution: Union["Execution", schema.Execution],
        experiments: List[Union["Experiment", schema.Experiment]],
    ) -> schema.Execution:
        from machinable.execution import Execution
        from machinable.experiment import Experiment

        execution = Execution.model(execution)

        storage_id = self._create_execution(
            execution=execution,
            experiments=[
                Experiment.model(experiment) for experiment in experiments
            ],
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
        uses: List[Union["Element", schema.Element]],
    ) -> schema.Experiment:
        from machinable.experiment import Experiment

        experiment = Experiment.model(experiment)
        group = Group.model(group)
        project = Project.model(project)
        uses = [Element.model(use) for use in uses]

        storage_id = self._create_experiment(experiment, group, project, uses)
        assert storage_id is not None

        experiment._storage_id = storage_id
        experiment._storage_instance = self

        return experiment

    def _create_experiment(
        self,
        experiment: schema.Experiment,
        group: schema.Group,
        project: schema.Project,
        uses: List[schema.Element],
    ) -> str:
        raise NotImplementedError

    def create_element(
        self,
        element: Union["Element", schema.Element],
        experiment: Union["Experiment", schema.Experiment],
    ) -> schema.Element:
        from machinable.experiment import Experiment

        element = Element.model(element)
        experiment = Experiment.model(experiment)

        target_experiment = (
            self.find_experiment(experiment.experiment_id, experiment.timestamp)
            or experiment
        )

        storage_id = self._create_element(
            element=element, experiment=target_experiment
        )
        assert storage_id is not None

        element._storage_id = storage_id
        element._storage_instance = self

        return element

    def _create_element(
        self,
        element: schema.Element,
        experiment: schema.Experiment,
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

    def create_project(
        self, project: Union[Project, schema.Project]
    ) -> schema.Project:
        project = Project.model(project)

        storage_id = self._create_project(project)
        assert storage_id is not None

        project._storage_id = storage_id
        project._storage_instance = self

        return project

    def _create_project(self, project: schema.Project) -> str:
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
        element: Union["Element", schema.Element],
        filepath: str,
        data: Any,
    ) -> Optional[Any]:
        element = Element.model(element)
        return self._create_file(element._storage_id, filepath, data)

    def _create_file(self, storage_id: str, filepath: str, data: Any) -> str:
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

    def retrieve_project(self, storage_id: str) -> schema.Project:
        project = self._retrieve_project(storage_id)
        project._storage_id = storage_id
        project._storage_instance = self

        return project

    def _retrieve_project(self, storage_id: str) -> schema.Project:
        raise NotImplementedError

    def retrieve_element(self, storage_id: str) -> schema.Element:
        element = self._retrieve_element(storage_id)
        element._storage_id = storage_id
        element._storage_instance = self

        return element

    def retrieve_elements(
        self, storage_ids: List[str]
    ) -> List[schema.Execution]:
        return [self.retrieve_element(storage_id) for storage_id in storage_ids]

    def _retrieve_element(self, storage_id: str) -> schema.Element:
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
        self, element: Union["Element", schema.Element], filepath: str
    ) -> Optional[Any]:
        element = Element.model(element)
        return self._retrieve_file(element._storage_id, filepath)

    def _retrieve_file(self, storage_id: str, filepath: str) -> Optional[Any]:
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
        element: Union["Element", schema.Element],
        *append: str,
        create: bool = False,
    ) -> Optional[str]:

        element = Element.model(element)

        local_directory = self._local_directory(element._storage_id, *append)

        if create:
            os.makedirs(local_directory, exist_ok=True)

        return local_directory

    def _local_directory(self, storage_id: str, *append: str) -> Optional[str]:
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

        try:
            return arrow.get(status)
        except arrow.ParserError:
            return None

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

    def find_experiment_by_predicate(
        self, module: str, predicate: Optional[Dict] = None
    ) -> List[str]:
        return self._find_experiment_by_predicate(module, predicate)

    def _find_experiment_by_predicate(
        self, module: str, predicate: Dict
    ) -> List[str]:
        raise NotImplementedError

    def retrieve_related(
        self, storage_id: str, relation: str
    ) -> Optional[schema.Element]:
        relations = {
            "experiment.execution": "execution",
            "experiment.executions": "executions",
            "execution.experiments": "experiments",
            "execution.schedule": "schedule",
            "group.experiments": "experiments",
            "experiment.group": "group",
            "experiment.ancestor": "experiment",
            "experiment.derived": "experiments",
            "experiment.project": "project",
            "experiment.uses": "elements",
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

    def __repr__(self):
        return f"Storage"

    def __str__(self):
        return self.__repr__()
