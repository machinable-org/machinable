from typing import TYPE_CHECKING, List, Union

from machinable.element import Element, belongs_to
from machinable.schema import ExperimentType
from machinable.utils import encode_experiment_id, generate_experiment_id

if TYPE_CHECKING:
    from machinable.execution import Execution


class Experiment(Element):
    def __init__(
        self,
        interface: Union[str, None] = None,
        config: Union[str, dict, None, List[Union[str, dict, None]]] = None,
    ):
        """Experiment

        # Arguments
        interface: The name of the interface as defined in the machinable.yaml
        config: Configuration to override the default config
        """
        super().__init__()
        self._experiment_id = encode_experiment_id(generate_experiment_id())
        self._interface = interface
        self._config = config
        self._components = []

    def use(
        self,
        component: str,
        config: Union[str, dict, None, List[Union[str, dict, None]]] = None,
    ) -> "Experiment":
        """Adds a component

        # Arguments
        component: The name of the component as defined in the machinable.yaml
        config: Configuration to override the default config
        """
        self._components.append((component, config))

        return self

    def _to_model(self) -> ExperimentType:
        return ExperimentType()  # todo

    @belongs_to
    def execution(self) -> "Execution":
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
