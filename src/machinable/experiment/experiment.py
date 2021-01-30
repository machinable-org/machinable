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
        on: Union[str, dict, None] = None,
        config: Union[str, dict, None, List[Union[str, dict, None]]] = None,
        flags: Union[dict, None, List[Union[dict, None]]] = None,
        seed: Union[str, int, None] = None,
        uses: Union[List[tuple], None] = None,
    ):
        """Experiment

        # Arguments
        on: The name of the component as defined in the machinable.yaml
        version: A config update to override the default config
        flags: Additional flags
        seed: Experiment seed
        uses: List of components (can be added later via .use())
        """
        self.on = on
        self.version = {"config": config, "flags": flags}
        self.seed = seed
        self.uses = uses or []
        # compute/generate experiment ID
        if isinstance(seed, str):
            decode_experiment_id(seed, or_fail=True)
            self.experiment_id = seed
        elif seed is None or isinstance(seed, int):
            self.experiment_id = generate_experiment_id(random_state=seed)
        else:
            raise ValueError(f"Invalid seed: {seed}")

    def serialize(self):
        return {
            "on": self.on,
            "config": self.version["config"],
            "flags": self.version["flags"],
            "seed": self.seed,
            "uses": self.uses,
        }

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
        return f"Experiment({self.on}) <{len(self.uses) + 1}>"

    def __repr__(self):
        return f"Experiment({self.on}, version={self.version}, seed={self.seed}, using={self.uses})"
