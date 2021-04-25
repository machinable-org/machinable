from typing import TYPE_CHECKING, List, Union

from machinable.element.element import Element
from machinable.element.relations import belongs_to
from machinable.schema import ExperimentType
from machinable.utils import encode_experiment_id, generate_experiment_id

if TYPE_CHECKING:
    from machinable.execution.execution import Execution


class Experiment(Element):
    def __init__(
        self,
        component: Union[str, None] = None,
        config: Union[str, dict, None, List[Union[str, dict, None]]] = None,
        flags: Union[dict, None, List[Union[dict, None]]] = None,
    ):
        """Experiment

        # Arguments
        component: The name of the component as defined in the machinable.yaml
        config: Configuration to override the default config
        flags: Additional flags
        """
        super().__init__()
        self._experiment_id = encode_experiment_id(generate_experiment_id())
        self._component = component
        self._config = config
        self._flags = flags
        self._components = []

    def use(
        self,
        component: str,
        config: Union[str, dict, None, List[Union[str, dict, None]]] = None,
        flags: Union[dict, None, List[Union[dict, None]]] = None,
    ) -> "Experiment":
        """Makes an additional component available to the experiment

        # Arguments
        component: The name of the component as defined in the machinable.yaml
        config: Configuration to override the default config
        flags: Additional flags
        """
        self._components.append((component, config, flags))

        return self

    def _to_model(self) -> ExperimentType:
        return ExperimentType(
            components=[
                self.__project__.parse_component(*component)
                for component in self._components
            ],
            **self.__project__.parse_component(
                self._component, self._config, self._flags
            ),
        )

    @belongs_to
    def execution(self) -> "Execution":
        from machinable.execution.execution import Execution

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
