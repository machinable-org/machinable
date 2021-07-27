from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union

import copy
import os
from time import time

import arrow
from machinable import schema
from machinable.collection import (
    ExecutionCollection,
    ExperimentCollection,
    RecordCollection,
)
from machinable.component import compact, normversion
from machinable.element import Element, belongs_to, has_many
from machinable.errors import ConfigurationError, StorageError
from machinable.group import Group
from machinable.interface import Interface
from machinable.project import Project
from machinable.repository import Repository
from machinable.settings import get_settings
from machinable.types import (
    ComponentType,
    DatetimeType,
    TimestampType,
    VersionType,
)
from machinable.utils import generate_seed, sentinel, timestamp_to_directory
from omegaconf import OmegaConf
from omegaconf.dictconfig import DictConfig

if TYPE_CHECKING:
    from machinable.execution import Execution
    from machinable.record import Record


class Experiment(Element):
    _kind = "Experiment"

    def __init__(
        self,
        interface: Optional[str] = None,
        version: VersionType = None,
        group: Union[Group, str, None] = None,
        resources: Optional[Dict] = None,
        seed: Union[int, None] = None,
        uses: Optional[dict] = None,
        derived_from: Optional["Experiment"] = None,
        *,
        view: Union[bool, None, str] = True,
    ):
        """Experiment

        # Arguments
        interface: The name of the interface as defined in the machinable.yaml
        version: Configuration to override the default config
        derived_from: Optional ancestor experiment
        """
        super().__init__(view=view)
        if interface is None:
            interface = Interface.default or get_settings().default_interface
        if seed is None:
            seed = generate_seed()
        self.__model__ = schema.Experiment(
            interface=compact(interface, version), seed=seed
        )
        self._resolved_interface: Optional[Interface] = None
        self._resolved_config: Optional[DictConfig] = None
        self._deferred_data = {}
        if resources is not None:
            self.resources(resources)
        if group is not None:
            self.group_as(group)
        if uses is not None:
            for slot, args in uses.items():
                component, *version = compact(args)
                self.use(slot, component, version)
        if derived_from is not None:
            self.__model__.derived_from_id = derived_from.experiment_id
            self.__model__.derived_from_timestamp = derived_from.timestamp
            self.__related__["ancestor"] = derived_from

    @belongs_to
    def group():
        return Group

    @has_many
    def derived() -> ExperimentCollection:
        """Returns a collection of derived experiments"""
        return Experiment, ExperimentCollection, False

    @belongs_to
    def ancestor() -> Optional["Experiment"]:
        """Returns parent experiment or None if experiment is independent"""
        return Experiment

    @has_many
    def executions() -> "ExecutionCollection":
        from machinable.execution import Execution

        return Execution, ExecutionCollection

    @belongs_to
    def execution() -> "Execution":
        from machinable.execution import Execution

        return Execution, False

    @classmethod
    def collect(cls, experiments) -> ExperimentCollection:
        """Returns a collection of experiments"""
        return ExperimentCollection(experiments)

    @classmethod
    def from_model(cls, model: schema.Experiment) -> "Experiment":
        instance = cls(model.interface[0])
        instance.__model__ = model
        return instance

    def __reduce__(self) -> Union[str, Tuple[Any, ...]]:
        return (self.__class__, ("",), self.serialize())

    def _assert_editable(self):
        if self.is_mounted():
            raise ConfigurationError(
                "Experiment can not be modified as it has already been executed. "
                "Use .derive() to derive a modified experiment."
            )

    def _clear_caches(self) -> None:
        self._resolved_interface = None
        self._resolved_config = None

    def group_as(self, group: Union[Group, str]) -> "Experiment":
        # todo: allow group modifications after execution
        self._assert_editable()

        if isinstance(group, str):
            group = Group(group)
        group.__related__.setdefault("experiments", ExperimentCollection())
        group.__related__["experiments"].append(self)
        self.__related__["group"] = group

        return self

    def derive(
        self,
        interface: Optional[str] = sentinel,
        version: VersionType = sentinel,
        group: Union[Group, str, None] = sentinel,
        resources: Optional[Dict] = sentinel,
        uses: Optional[Dict] = sentinel,
        seed: Union[int, None] = sentinel,
    ) -> "Experiment":
        if interface is sentinel:
            interface = self.__model__.interface[0]
        if version is sentinel:
            version = self.__model__.interface[1:]
        if group is sentinel:
            group = self.group.clone() if self.group is not None else None
        if resources is sentinel:
            resources = copy.deepcopy(self.resources())
        if uses is sentinel:
            uses = copy.deepcopy(self.__model__.uses)
        if seed is sentinel:
            seed = None

        experiment = Experiment(
            interface,
            version,
            group=group,
            resources=resources,
            uses=uses,
            seed=seed,
            derived_from=self,
        )

        return experiment

    @property
    def component(self) -> str:
        return self.__model__.interface[0]

    def version(
        self, version: VersionType = sentinel, overwrite: bool = False
    ) -> List[Union[str, dict]]:
        self._assert_editable()

        if version is sentinel:
            return self.__model__.interface[1:]

        if overwrite:
            self.__model__.interface = compact(
                self.__model__.interface[0], version
            )
        else:
            self.__model__.interface.extend(normversion(version))

        self._clear_caches()

        return self.__model__.interface[1:]

    def interface(self, reload: bool = False) -> Interface:
        """Resolves and returns the interface instance"""
        if self._resolved_interface is None or reload:
            self._resolved_interface = Interface.make(
                self.__model__.interface[0],
                self.__model__.interface[1:],
                slots=self.__model__.uses,
                parent=self,
            )

        return self._resolved_interface

    def execute(
        self, engine: Union[str, None] = None, version: VersionType = None
    ) -> "Experiment":
        """Executes the experiment"""
        from machinable.execution import Execution

        Execution(engine=engine, version=version).add(
            experiment=self
        ).dispatch()

        return self

    def save_host_info(self) -> bool:
        if not self.is_mounted():
            return False

        if self.execution is None:
            return False

        self.save_execution_data(
            "host.json", data=Project.get().provider().get_host_info()
        )

        return True

    def commit(self) -> "Experiment":
        Repository.get().commit(self)

        return self

    def use(
        self,
        slot: Optional[str] = None,
        component: Optional[str] = None,
        version: VersionType = None,
        overwrite: bool = False,
    ) -> "Experiment":
        """Adds a component

        # Arguments
        slot: The slot name
        component: The name of the component as defined in the machinable.yaml
        version: Configuration to override the default config
        overwrite: If True, will overwrite existing uses
        """
        self._assert_editable()

        if overwrite:
            self.__model__.uses = {}

        if slot is not None:
            self.__model__.uses[slot] = compact(component, version)

        self._clear_caches()

        return self

    @property
    def uses(self) -> Dict[str, ComponentType]:
        return self.__model__.uses

    @property
    def config(self) -> DictConfig:
        if self._resolved_config is None:
            if self.__model__.config is not None:
                self._resolved_config = OmegaConf.create(self.__model__.config)
            else:
                self._resolved_config = self.interface().config
                self.__model__.config = OmegaConf.to_container(
                    self.interface().config
                )

        return self._resolved_config

    @property
    def experiment_id(self) -> str:
        return self.__model__.experiment_id

    def local_directory(
        self, *append: str, create: bool = False
    ) -> Optional[str]:
        if not self.is_mounted():
            return None

        return self.__model__._storage_instance.local_directory(
            self, *append, create=create
        )

    def records(self, scope="default") -> RecordCollection:
        if not self.is_mounted():
            return RecordCollection()

        if f"records.{scope}" in self._cache:
            return self._cache[f"records.{scope}"]

        records = RecordCollection(
            self.__model__._storage_instance.retrieve_records(self, scope)
        )

        if self.is_finished():
            self._cache[f"records.{scope}"] = records

        return records

    def record(self, scope="default") -> "Record":
        from machinable.record import Record

        if f"record.{scope}" not in self._cache:
            self._cache[f"record.{scope}"] = Record(self, scope)

        return self._cache[f"record.{scope}"]

    def load_file(self, filepath: str, default=None) -> Optional[Any]:
        if not self.is_mounted():
            return default

        data = self.__model__._storage_instance.retrieve_file(self, filepath)

        return data if data is not None else default

    def save_file(self, filepath: str, data: Any) -> str:
        if os.path.isabs(filepath):
            raise ValueError("Filepath must be relative")

        if not self.is_mounted():
            # defer writes until experiment creation
            self._deferred_data[filepath] = data
            return "$deferred"

        return self.__model__._storage_instance.create_file(
            self, filepath, data
        )

    def save_data(self, filepath: str, data: Any) -> str:
        return self.save_file(os.path.join("data", filepath), data)

    def load_data(self, filepath: str, default=None) -> Optional[Any]:
        return self.load_file(os.path.join("data", filepath), default)

    def save_execution_data(self, filepath: str, data: Any) -> str:
        if self.execution is None:
            raise ValueError(
                "Experiment is not linked to any execution"
            )  # todo: support deferred writes
        return self.save_file(
            os.path.join(
                f"execution-{timestamp_to_directory(self.execution.timestamp)}/data",
                filepath,
            ),
            data,
        )

    def load_execution_data(self, filepath: str, default=None) -> Optional[Any]:
        if self.execution is None:
            return default
        return self.load_file(
            os.path.join(
                f"execution-{timestamp_to_directory(self.execution.timestamp)}/data",
                filepath,
            ),
            default,
        )

    def mark_started(
        self, timestamp: Optional[TimestampType] = None
    ) -> Optional[DatetimeType]:
        if self.is_finished():
            return None
        return self.__model__._storage_instance.mark_started(self, timestamp)

    def update_heartbeat(
        self,
        timestamp: Union[float, int, DatetimeType, None] = None,
        mark_finished=False,
    ) -> Optional[DatetimeType]:
        if self.is_finished():
            return None
        self.__model__._storage_instance.update_heartbeat(
            self, timestamp, mark_finished
        )

    def output(self, incremental: bool = False) -> Optional[str]:
        """Returns the output log"""
        if not self.is_mounted():
            return None
        if incremental:
            read_length = self._cache.get("output_read_length", 0)
            if read_length == -1:
                return ""
            output = self.__model__._storage_instance.retrieve_output(self)
            if output is None:
                return None

            if self.is_finished():
                self._cache["output_read_length"] = -1
            else:
                self._cache["output_read_length"] = len(output)
            return output[read_length:]

        if "output" in self._cache:
            return self._cache["output"]

        output = self.__model__._storage_instance.retrieve_output(self)

        if self.is_finished():
            self._cache["output"] = output

        return output

    def resources(self, resources: Dict = sentinel) -> Optional[Dict]:
        if resources is sentinel:
            return self.load_file("resources.json", default=None)

        resources = OmegaConf.to_container(
            OmegaConf.create(copy.deepcopy(resources))
        )
        self.save_file(
            "resources.json",
            resources,
        )

        return resources

    @property
    def nickname(self) -> str:
        return self.__model__.nickname

    @property
    def seed(self) -> int:
        return self.__model__.seed

    @property
    def timestamp(self) -> int:
        return self.__model__.timestamp

    def created_at(self) -> Optional[DatetimeType]:
        if self.timestamp is None:
            return None

        return arrow.get(self.timestamp)

    def started_at(self) -> Optional[DatetimeType]:
        """Returns the starting time"""
        if not self.is_mounted():
            return None
        return self.__model__._storage_instance.retrieve_status(self, "started")

    def heartbeat_at(self):
        """Returns the last heartbeat time"""
        if not self.is_mounted():
            return None
        return self.__model__._storage_instance.retrieve_status(
            self, "heartbeat"
        )

    def finished_at(self):
        """Returns the finishing time"""
        if not self.is_mounted():
            return None
        return self.__model__._storage_instance.retrieve_status(
            self, "finished"
        )

    def is_finished(self):
        """True if finishing time has been written"""
        return bool(self.finished_at())

    def is_started(self):
        """True if starting time has been written"""
        return bool(self.started_at())

    def is_active(self):
        """True if not finished and last heartbeat occurred less than 30 seconds ago"""
        if not self.heartbeat_at():
            return False

        return (not self.is_finished()) and (
            (arrow.now() - self.heartbeat_at()).seconds < 30
        )

    def is_incomplete(self):
        """Shorthand for is_started() and not (is_active() or is_finished())"""
        return self.is_started() and not (
            self.is_active() or self.is_finished()
        )

    def __repr__(self):
        return f"Experiment [{self.__model__.experiment_id}]"

    def __str__(self):
        return self.__repr__()
