from typing import TYPE_CHECKING, List, Optional, Union

from machinable.component import compact, extract
from machinable.element import Element, belongs_to
from machinable.schema import ExperimentType
from machinable.types import Version
from machinable.utils import encode_experiment_id, generate_experiment_id

if TYPE_CHECKING:
    from machinable.execution import Execution


class Experiment(Element):
    def __init__(
        self,
        interface: str,
        version: Version = None,
        seed: Union[int, None] = None,
    ):
        """Experiment

        # Arguments
        interface: The name of the interface as defined in the machinable.yaml
        config: Configuration to override the default config
        seed: Optional seed.
        """
        super().__init__()
        self._interface = compact(interface, version)
        self._seed = seed

        self._components = []
        self._experiment_id = encode_experiment_id(generate_experiment_id())

    def execute(
        self,
        repository: List[Union[str, dict, None]] = None,
        engine: List[Union[str, dict, None]] = None,
        resources: Optional[dict] = None,
    ) -> "Experiment":
        """Executes the experiment"""
        from machinable.execution import Execution

        Execution(*extract(engine), seed=None).add(
            experiment=self, resources=resources
        ).submit(repository=repository)

        return self

    def use(self, component: str, version: Version = None) -> "Experiment":
        """Adds a component

        # Arguments
        component: The name of the component as defined in the machinable.yaml
        config: Configuration to override the default config
        """
        self._components.append(compact(component, version))

        return self

    def _to_model(self) -> ExperimentType:
        return ExperimentType()  # todo

    @belongs_to
    def execution() -> "Execution":
        from machinable.execution import Execution

        return Execution

    @property
    def config(self):
        if not self.is_mounted():
            # generate preview based on the current state
            return self.to_model(mount=False).config

        return self.__model__.config

    def __str__(self):
        return f"Experiment() [{self._experiment_id}]"

    def __repr__(self):
        return f"Experiment() [{self._experiment_id}]"
