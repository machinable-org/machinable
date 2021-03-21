from typing import List, Union

from machinable.element.element import Element
from machinable.utils.utils import encode_experiment_id, generate_experiment_id


class Experiment(Element):
    def __init__(
        self,
        component: Union[str, dict, None] = None,
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
        self.components = []
        self.use(component, config, flags)
        self.experiment_id = encode_experiment_id(generate_experiment_id())
        self.__component__ = None

    @property
    # has_one
    def component(self):
        return self.__component__

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
        self.__project__.has_component(component, or_fail=True)

        self.components.append((component, config, flags))

        return self

    def __str__(self):
        return f"Experiment() [{self.experiment_id}]"

    def __repr__(self):
        return f"Experiment() [{self.experiment_id}]"
