from typing import TYPE_CHECKING, List, Optional, Union

from machinable import schema
from machinable.component import compact
from machinable.element import Element, belongs_to
from machinable.interface import Interface
from machinable.project import Project
from machinable.types import VersionType
from machinable.utils import encode_experiment_id, generate_experiment_id

if TYPE_CHECKING:
    from machinable.component import Component
    from machinable.execution import Execution


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
                (
                    component,
                    dict(resolved_component.config.copy()),
                )
                for component, resolved_component in zip(
                    self._components, self.components()
                )
            ],
        )

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

    def __str__(self):
        return f"Experiment() [{self._experiment_id}]"

    def __repr__(self):
        return f"Experiment() [{self._experiment_id}]"
