from typing import TYPE_CHECKING, Any, List, Optional, Union

from machinable import schema
from machinable.component import Component
from machinable.grouping import Grouping
from machinable.project import Project

if TYPE_CHECKING:
    from machinable.execution import Execution
    from machinable.experiment import Experiment


class Storage(Component):
    """Storage base class"""

    def retrieve_file(
        experiment_storage_id: str, filepath: str
    ) -> Optional[Any]:
        raise NotImplementedError

    def local_directory(experiment_storage_id: str, *append: str):
        raise NotImplementedError

    def create_execution(
        self,
        project: Union[Project, schema.Project],
        execution: Union["Execution", schema.Execution],
        experiments: List[Union["Experiment", schema.Experiment]],
        grouping: Union[Grouping, schema.Grouping],
    ) -> schema.Execution:
        from machinable.execution import Execution
        from machinable.experiment import Experiment

        execution = Execution.model(execution)

        storage_id = self._create_execution(
            execution,
            [Experiment.model(experiment) for experiment in experiments],
            Grouping.model(grouping),
        )

        execution._storage_id = storage_id
        execution._storage_instance = self

        return execution

    def _create_execution(
        self,
        execution: schema.Execution,
        experiments: List[schema.Experiment],
        grouping: Optional[schema.Grouping],
    ) -> str:
        raise NotImplementedError

    @classmethod
    def multiple(cls, *storages) -> "Storage":
        if len(storages) == 1:
            return Storage.make(storages[0])

        from machinable.storage.multiple_storage import MultipleStorage

        return MultipleStorage(storages)
