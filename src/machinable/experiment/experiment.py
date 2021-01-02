from typing import Tuple, Type, Union

import copy
from collections import OrderedDict

from machinable.utils.importing import resolve_instance
from machinable.utils.traits import Discoverable, Jsonable
from machinable.utils.utils import is_valid_module_path


class Experiment(Jsonable, Discoverable):
    def __init__(self, component: Union[str, None], version=None, flags=None):
        """Experiment

        The experiment interface is fluent, methods can be chained in arbitrary order.

        # Arguments
        component: Component|String, the name of the components as defined in the machinable.yaml
        version: dict|String, a configuration update to override its default config
        flags: dict, optional flags dictionary
        """
        self.component = component
        self.version = version
        self.flags = flags
        self.components = None

    @classmethod
    def create(
        cls, args: Union[Type, str, Tuple, "Experiment"]
    ) -> "Experiment":
        """Creates an experiment from arguments

        # Returns
        machinable.Component
        """
        if isinstance(args, cls):
            return args

        discovered = cls.discover()
        if discovered is not None:
            return discovered

        if args is None:
            return cls(component=None)

        if isinstance(args, str):
            return cls(component=args)

        if isinstance(args, tuple):
            return cls(*args)

        raise ValueError(f"Invalid arguments: {args}")

    def unpack(self):
        if isinstance(self.version, list):
            return [__class__(self.name, v, self.flags) for v in self.version]

        return self

    def serialize(self):
        return (
            self.name,
            copy.deepcopy(self.version),
            copy.deepcopy(self.flags),
        )

    @classmethod
    def unserialize(cls, serialized):
        if isinstance(serialized, list):
            serialized = tuple(serialized)
        return cls.create(serialized)

    def uses(self, component, version=None, flags=None):
        """Makes a component available to the experiment

        # Arguments
        component: String, the name of the components as defined in the machinable.yaml
        version: dict|String, a configuration update to override its default config
            Use '_mixins_' key to override default mixins where `"^"` will be expanded as the default mixin config.
        flags: dict, optional flags to be passed to the component
        """
        return

    def __str__(self):
        return f"Experiment <{self.name}>"

    def __repr__(self):
        return f"Experiment({self.name}, version={self.version}, flags={self.flags})"
