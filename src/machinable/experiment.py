from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union

import os
from time import time

import arrow
from machinable import schema
from machinable.collection.experiment import ExperimentCollection
from machinable.collection.record import RecordCollection
from machinable.component import compact
from machinable.element import Element, belongs_to, has_many
from machinable.errors import MachinableError, StorageError
from machinable.grouping import resolve_grouping
from machinable.interface import Interface
from machinable.project import Project
from machinable.settings import get_settings
from machinable.types import DatetimeType, TimestampType, VersionType
from omegaconf import OmegaConf
from omegaconf.dictconfig import DictConfig

if TYPE_CHECKING:
    from machinable.component import Component
    from machinable.execution import Execution
    from machinable.record import Record


class Experiment(Element):
    def __init__(
        self,
        interface: Optional[str] = None,
        version: VersionType = None,
        derive_from: Optional["Experiment"] = None,
    ):
        """Experiment

        # Arguments
        interface: The name of the interface as defined in the machinable.yaml
        version: Configuration to override the default config
        derive_from: Optional ancestor experiment
        """
        super().__init__()
        if interface is None:
            interface = Interface.default or get_settings().default_interface
        self.__model__ = schema.Experiment(
            interface=compact(interface, version)
        )
        self._resolved_interface: Optional[Interface] = None
        self._resolved_components: Dict[str, "Component"] = {}
        self._resolved_config: Optional[DictConfig] = None
        if derive_from is not None:
            self.derive_from(derive_from)

    @classmethod
    def from_model(cls, model: schema.Experiment) -> "Experiment":
        instance = cls("")
        instance.__model__ = model
        return instance

    def __reduce__(self) -> Union[str, Tuple[Any, ...]]:
        return (self.__class__, ("",), self.serialize())

    def _assert_mounted(self):
        if not self.is_mounted():
            raise StorageError(
                "Experiment has not been written to a storage yet."
            )

    def _assert_writable(self):
        self._assert_mounted()
        if self.is_finished():
            raise StorageError("Experiment is finished and thus read-only")

    def derive_from(self, ancestor: "Experiment") -> "Experiment":
        if not ancestor.is_mounted():
            raise StorageError(
                "The ancestor experiment has not been written to a storage yet."
            )
        if ancestor.timestamp is None:
            raise ValueError(
                "The ancestor experiment has not been executed yet."
            )

        self.__model__.derived_from_id = ancestor.experiment_id
        self.__model__.derived_from_timestamp = ancestor.timestamp
        self.__related__["ancestor"] = ancestor

        return self

    def components(self, reload: bool = False) -> Dict[str, "Component"]:
        if reload:
            self._resolved_components = {}
        if len(self.__model__.components) == len(self._resolved_components):
            return self._resolved_components

        for slot, component in self.__model__.components.items():
            if slot not in self._resolved_components:
                self._resolved_components[slot] = Project.get().get_component(
                    component[0], component[1:]
                )

        return self._resolved_components

    def interface(self, reload: bool = False) -> Interface:
        """Resolves and returns the interface instance"""
        if self._resolved_interface is None or reload:
            self._resolved_interface = Interface.make(
                self.__model__.interface[0], self.__model__.interface[1:]
            )

        return self._resolved_interface

    def execute(
        self,
        engine: Union[str, None] = None,
        version: VersionType = None,
        grouping: Optional[str] = None,
        resources: Optional[dict] = None,
        seed: Optional[int] = None,
    ) -> "Experiment":
        """Executes the experiment"""
        if self.is_mounted() and self.execution is not None:
            raise MachinableError("Experiment has already been executed.")

        from machinable.execution import Execution

        Execution(engine=engine, version=version).add(
            experiment=self, resources=resources, seed=seed
        ).dispatch(grouping=grouping)

        return self

    def use(
        self,
        slot: Optional[str] = None,
        component: Optional[str] = None,
        version: VersionType = None,
        **uses,
    ) -> "Experiment":
        """Adds a component

        # Arguments
        slot: The slot name
        component: The name of the component as defined in the machinable.yaml
        version: Configuration to override the default config
        """
        for key, payload in uses.items():
            self.use(key, payload)

        # TODO: if mounted has to derive automatically or error
        # TODO: inspect on_init signature of the interface to detect non existing slots early
        if slot is not None:
            self.__model__.components[slot] = compact(component, version)

        return self

    @has_many
    def derived() -> ExperimentCollection:
        """Returns a collection of derived experiments"""
        return Experiment, ExperimentCollection, False

    @belongs_to
    def ancestor() -> Optional["Experiment"]:
        """Returns parent experiment or None if experiment is independent"""
        return Experiment

    @belongs_to
    def execution() -> "Execution":
        from machinable.execution import Execution

        return Execution

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

    def local_directory(self, *append: str) -> Optional[str]:
        if not self.is_mounted():
            return None

        return self.__model__._storage_instance.local_directory(self, *append)

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
        self._assert_writable()

        return self.__model__._storage_instance.create_file(
            self, filepath, data
        )

    def save_data(self, filepath: str, data: Any) -> str:
        return self.save_file(os.path.join("data", filepath), data)

    def load_data(self, filepath: str, default=None) -> Optional[Any]:
        return self.load_file(os.path.join("data", filepath), default)

    def mark_started(
        self, timestamp: Optional[TimestampType] = None
    ) -> DatetimeType:
        self._assert_writable()
        self.__model__._storage_instance.mark_started(self, timestamp)

    def update_heartbeat(
        self,
        timestamp: Union[float, int, DatetimeType, None] = None,
        mark_finished=False,
    ) -> DatetimeType:
        self._assert_writable()
        self.__model__._storage_instance.update_heartbeat(
            self, timestamp, mark_finished
        )

    def output(self) -> Optional[str]:
        """Returns the output log"""
        self._assert_mounted()

        if "output" in self._cache:
            return self._cache["output"]

        output = self.__model__._storage_instance.retrieve_output(self)

        if self.is_finished():
            self._cache["output"] = output

        return output

    @property
    def seed(self) -> Optional[int]:
        return self.__model__.seed

    @property
    def timestamp(self) -> Optional[float]:
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

    def __str__(self):
        return f"Experiment() [{self.__model__.experiment_id}]"

    def __repr__(self):
        return f"Experiment() [{self.__model__.experiment_id}]"
