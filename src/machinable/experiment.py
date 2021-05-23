from typing import TYPE_CHECKING, Any, List, Optional, Union

from machinable import schema
from machinable.component import compact
from machinable.element import Element, belongs_to
from machinable.interface import Interface
from machinable.project import Project
from machinable.types import VersionType
from machinable.utils import encode_experiment_id, generate_experiment_id
from omegaconf import OmegaConf

if TYPE_CHECKING:
    from machinable.component import Component
    from machinable.execution import Execution
    from machinable.record import Record


class Experiment(Element):
    def __init__(self, interface: str, version: VersionType = None):
        """Experiment

        # Arguments
        interface: The name of the interface as defined in the machinable.yaml
        config: Configuration to override the default config
        seed: Optional seed.
        """
        super().__init__()
        self.__model__: Optional[schema.Experiment] = None
        self._interface = compact(interface, version)
        self._resolved_interface: Optional[Interface] = None

        self._components: List[List[Union[str, dict]]] = []
        self._resolved_components: List["Component"] = []
        self._experiment_id = encode_experiment_id(generate_experiment_id())
        self._resources: Optional[dict] = None
        self._seed: Optional[int] = None

    def to_model(self) -> schema.Experiment:
        return schema.Experiment(
            interface=self._interface,
            config=dict(self.interface().config.copy()),
            experiment_id=self._experiment_id,
            resources=self._resources,
            seed=self._seed,
            components=[
                (component, dict(resolved_component.config.copy()))
                for component, resolved_component in zip(
                    self._components, self.components()
                )
            ],
        )

    @classmethod
    def from_model(cls, model: schema.Experiment) -> "Experiment":
        instance = cls(
            interface=model.interface[0], version=model.interface[1:]
        )
        instance.mount(model)
        return instance

    def mount(self, model: schema.Experiment):
        super().mount(model)
        self.__model__.config = OmegaConf.create(self.__model__.config)
        OmegaConf.set_readonly(self.__model__.config, True)

    def components(self, reload: bool = False) -> List["Component"]:
        if reload:
            self._resolved_components = []
        for component in self._components[len(self._resolved_components) :]:
            self._resolved_components.append(
                Project.get_component(component[0], component[1:])
            )

    def interface(self, reload: bool = False) -> Interface:
        """Resolves and returns the interface instance"""
        if self._resolved_interface is None or reload:
            self._resolved_interface = Interface.make(
                self._interface[0], self._interface[1:]
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

    def use(self, component: str, version: VersionType = None) -> "Experiment":
        """Adds a component

        # Arguments
        component: The name of the component as defined in the machinable.yaml
        config: Configuration to override the default config
        """
        # todo: if mounted has to derive automatically

        self._components.append(compact(component, version))

        return self

    @belongs_to
    def execution() -> "Execution":
        from machinable.execution import Execution

        return Execution

    @property
    def config(self):
        if not self.is_mounted():
            return self.interface().config

        return self.__model__.config

    @property
    def experiment_id(self) -> str:
        if not self.is_mounted():
            return self._experiment_id

        return self.__model__.experiment_id

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
        return f"Experiment() [{self._experiment_id}]"

    def __repr__(self):
        return f"Experiment() [{self._experiment_id}]"
