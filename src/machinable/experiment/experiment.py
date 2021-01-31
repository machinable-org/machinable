from typing import List, Tuple, Type, Union

from machinable.config.mapping import config_map
from machinable.element.element import Element
from machinable.utils.traits import Discoverable, Jsonable
from machinable.utils.utils import (
    decode_experiment_id,
    encode_experiment_id,
    generate_experiment_id,
)


class Experiment(Element, Discoverable):
    def __init__(
        self,
        component: Union[str, dict, None] = None,
        config: Union[str, dict, None, List[Union[str, dict, None]]] = None,
        flags: Union[dict, None, List[Union[dict, None]]] = None,
        seed: Union[str, int, None] = None,
    ):
        """Experiment

        # Arguments
        component: The name of the component as defined in the machinable.yaml
        config: A config update to override the default config
        flags: Additional flags
        seed: Experiment seed
        """
        super().__init__()
        self.on = component
        self.version = {"config": config, "flags": flags}
        self.seed = seed
        # compute/generate experiment ID
        if isinstance(seed, str):
            decode_experiment_id(seed, or_fail=True)
            self.experiment_id = seed
        elif seed is None or isinstance(seed, int):
            self.experiment_id = encode_experiment_id(
                generate_experiment_id(random_state=seed)
            )
        else:
            raise ValueError(f"Invalid seed: {seed}")
        self.uses = []
        self.spec = None

    @property
    def execution(self):
        return self._related["execution"]

    @property
    def config(self):
        #
        pass

    @classmethod
    def unserialize(cls, serialized):
        return cls.make(serialized)

    def use(
        self,
        component: str,
        config: Union[str, dict, None, List[Union[str, dict, None]]] = None,
        flags: Union[dict, None, List[Union[dict, None]]] = None,
    ) -> "Experiment":
        """Makes an additional component available

        # Arguments
        component: The name of the component as defined in the machinable.yaml
        version: A configuration update to override its default config
        flags: Additional flags
        """
        self.uses.append(
            (
                component,
                config,
                flags,
            )
        )

        return self

    def __str__(self):
        return f"Experiment({self.on}) [{self.experiment_id}]"

    def __repr__(self):
        return f"Experiment({self.on}, version={self.version}, seed={self.seed}, uses={self.uses})  [{self.experiment_id}]"
