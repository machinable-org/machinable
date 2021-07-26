from typing import TYPE_CHECKING, List, Optional, Tuple, Union

from re import L

from machinable import schema
from machinable.component import compact
from machinable.element import Connectable, Element
from machinable.group import Group
from machinable.project import Project
from machinable.settings import get_settings
from machinable.storage.storage import Storage
from machinable.types import VersionType

if TYPE_CHECKING:
    from machinable.execution import Execution
    from machinable.experiment import Experiment


class Repository(Connectable, Element):
    """Repository base class"""

    _kind = "Repository"

    def __init__(
        self,
        storage: Union[str, None] = None,
        version: VersionType = None,
        default_group: Optional[str] = get_settings().default_group,
    ):
        super().__init__()
        if storage is None:
            storage = Storage.default or get_settings().default_storage
        self.__model__ = schema.Repository(
            storage=compact(storage, version), default_group=default_group
        )
        self._resolved_storage: Optional[Storage] = None

    @classmethod
    def filesystem(
        cls,
        directory: str,
        default_group: Optional[str] = get_settings().default_group,
    ) -> "Repository":
        return cls(
            storage="machinable.storage.filesystem_storage",
            version={"directory": directory},
            default_group=default_group,
        )

    def storage(self, reload: bool = False) -> Storage:
        """Resolves and returns the storage instance"""
        if self._resolved_storage is None or reload:
            self._resolved_storage = Storage.make(
                self.__model__.storage[0], self.__model__.storage[1:]
            )

        return self._resolved_storage

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

            group = experiment.group
            if group is None:
                group = Group(self.__model__.default_group)
                experiment.__related__["group"] = group

            self.storage().create_experiment(
                experiment=experiment,
                group=group,
                project=Project.get(),
            )

            # write deferred experiment data
            for filepath, data in experiment._deferred_data.items():
                experiment.save_file(filepath, data)
            experiment._deferred_data = {}

        if execution is None or execution.is_mounted():
            return

        self.storage().create_execution(execution, experiments)

    def __repr__(self):
        return f"Repository <{self.__model__.default_group}>"

    def __str__(self):
        return self.__repr__()
