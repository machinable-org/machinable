from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union

from machinable import schema
from machinable.component import compact
from machinable.element import Element, belongs_to
from machinable.interface import Interface
from machinable.project import Project
from machinable.settings import get_settings
from machinable.types import VersionType
from omegaconf import OmegaConf
from omegaconf.dictconfig import DictConfig

if TYPE_CHECKING:
    from machinable.component import Component
    from machinable.execution import Execution
    from machinable.record import Record


class Experiment(Element):
    def __init__(
        self, interface: Optional[str] = None, version: VersionType = None
    ):
        """Experiment

        # Arguments
        interface: The name of the interface as defined in the machinable.yaml
        config: Configuration to override the default config
        seed: Optional seed.
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

    @classmethod
    def from_model(cls, model: schema.Experiment) -> "Experiment":
        instance = cls("")
        instance.__model__ = model
        return instance

    def __reduce__(self) -> Union[str, Tuple[Any, ...]]:
        return (self.__class__, ("",), self.serialize())

    @property
    def seed(self) -> Optional[int]:
        return self.__model__.seed

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
        from machinable.execution import Execution

        Execution(engine=engine, version=version).add(
            experiment=self, resources=resources, seed=seed
        ).submit(grouping=grouping)

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

    @belongs_to
    def execution() -> "Execution":
        from machinable.execution import Execution

        return Execution

    @property
    def config(self) -> DictConfig:
        if self._resolved_config is None:
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

        if self.__model__._storage_instance is None:
            return None

        return self.__model__._storage_instance.local_directory(
            self.__model__._storage_id, **append
        )

    def records(self, scope="default") -> "RecordCollection":
        pass

    def create_record(self, scope="default") -> "Record":
        pass

    def load_file(self, filepath: str, default=None) -> Optional[Any]:
        """Retrieves a data object from the storage

        # Arguments
        filepath: File to retrieve
        """
        if not self.is_mounted():
            return default

        data = self.__model__._storage_instance.retrieve_file(
            self.__model__._storage_id, filepath
        )

        return data if data is not None else default

    def save_file(self, filepath: str):
        # todo: if is finished refuse to write data
        pass

    def output(self):
        """Returns the output log if available"""
        if "output" in self._cache:
            return self._cache["output"]

        output = self.__model__._storage_instance.retrieve_output()

        if self.is_finished():
            self._cache["output"] = output

        return output

    @property
    def started_at(self):
        """Returns the starting time"""
        return self.status["started_at"]

    @property
    def heartbeat_at(self):
        """Returns the last heartbeat time"""
        return self.status["heartbeat_at"]

    @property
    def finished_at(self):
        """Returns the finishing time"""
        return self.status["finished_at"]

    def is_finished(self):
        """True if finishing time has been written"""
        return bool(self.status["finished_at"])

    def is_started(self):
        """True if starting time has been written"""
        return bool(self.status["started_at"])

    def is_active(self):
        """True if not finished and last heartbeat occurred less than 30 seconds ago"""
        if not self.status["heartbeat_at"]:
            return False

        return (not self.is_finished()) and self.status["heartbeat_at"].diff(
            arrow.now()
        ).in_seconds() < 30

    def is_incomplete(self):
        """Shorthand for is_started() and not (is_active() or is_finished())"""
        return self.is_started() and not (
            self.is_active() or self.is_finished()
        )

    @property
    def derived(self):
        """Returns a collection of derived experiments"""
        raise NotImplementedError

    @property
    def ancestor(self):
        """Returns parent experiment or None if experiment is independent"""
        raise NotImplementedError

    def __str__(self):
        return f"Experiment() [{self.__model__.experiment_id}]"

    def __repr__(self):
        return f"Experiment() [{self.__model__.experiment_id}]"
