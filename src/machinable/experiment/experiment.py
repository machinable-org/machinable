from typing import List, Tuple, Type, Union

from machinable.config.mapping import config_map
from machinable.element.element import Element
from machinable.utils.traits import Discoverable, Jsonable
from machinable.utils.utils import generate_experiment_id


def cached(f):
    return f


class Experiment(Element, Discoverable):
    # relations: component, components

    def __init__(
        self,
        on: Union[str, dict],
        version: Union[str, dict, None, List[Union[str, dict, None]]] = None,
        flags: Union[dict, None, List[Union[dict, None]]] = None,
        seed: Union[str, int, None] = None,
        use: Union[List[tuple], None] = None,
    ):
        """Experiment

        The experiment interface is fluent, methods can be chained in arbitrary order.

        # Arguments
        on: String, the name of the component as defined in the machinable.yaml
        version: dict|String, a configuration update to override its default config
        flags: dict, optional flags dictionary
        seed: Experiment seed
        use: List of components (can be added later via .uses())
        """
        self.__attributes__ = {}

        self.on = on
        self.version = version
        self.flags = flags
        self.seed = seed
        self.uses = use or []

    @property
    def uid(self):
        return generate_experiment_id()

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

    def use(
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

    def parse(self, config) -> "Experiment":
        """"""
        # todo: seed, execution and so on has to come from somewher
        # see parser.py

        if isinstance(self.component, str):
            self.component = config.component(
                self.component, self.version, self.flags
            )
            self.__attributes__["config"] = self.component

        self.components = [
            (config.component(*c), *c[1:]) if isinstance(c[0], str) else c
            for c in self.components
        ]

        return self

    @property
    @cached
    def config(self):
        """Returns the experiment's config"""
        # if "config" not in self._cache:
        #     self._cache["config"] = config_map(
        #         self.file("component.json")["config"]
        #     )
        if "config" in self.__attributes__:
            return config_map(self.__attributes__["config"])
        return self.__attributes__.get("config", None)

    def __str__(self):
        return f"Experiment({self.component}) <{len(self.components) + 1}>"

    def __repr__(self):
        return f"Experiment({self.component}, version={self.version}, flags={self.flags}, seed={self.seed}, uses={self.components})"
