from typing import List, Tuple, Type, Union

from machinable.utils.traits import Discoverable, Jsonable


class Experiment(Jsonable, Discoverable):
    def __init__(
        self,
        component: str,
        version: Union[str, dict, None, List[Union[str, dict, None]]] = None,
        flags: Union[dict, None, List[Union[dict, None]]] = None,
        seed: Union[str, int, None] = None,
        uses: Union[List[tuple], None] = None,
    ):
        """Experiment

        The experiment interface is fluent, methods can be chained in arbitrary order.

        # Arguments
        component: String, the name of the components as defined in the machinable.yaml
        version: dict|String, a configuration update to override its default config
        flags: dict, optional flags dictionary
        seed: Experiment seed
        uses: List of components (can be added later via .uses())
        """
        self.component = component
        self.version = version
        self.flags = flags
        self.seed = seed
        self.components = uses or []

    def serialize(self):
        return {
            "component": self.component,
            "version": self.version,
            "flags": self.flags,
            "seed": self.seed,
            "components": self.components,
        }

    @classmethod
    def unserialize(cls, serialized):
        return cls.make(serialized)

    def uses(
        self,
        component: str,
        version: Union[str, dict, None, List[Union[str, dict, None]]] = None,
        flags: Union[dict, None, List[Union[dict, None]]] = None,
    ) -> "Experiment":
        """Makes an additional component available to the experiment

        # Arguments
        component: String, the name of the component as defined in the machinable.yaml
        version: dict|String, a configuration update to override its default config
            Use '_mixins_' key to override default mixins where `"^"` will be expanded as the default mixin config.
        flags: dict, optional flags to be passed to the component
        """
        self.components.append(
            (
                component,
                version,
                flags,
            )
        )

        return self

    def __str__(self):
        return f"Experiment({self.component}) <{len(self.components) + 1}>"

    def __repr__(self):
        return f"Experiment({self.component}, version={self.version}, flags={self.flags}, seed={self.seed}, uses={self.components})"
