import json

from machinable.utils.importing import resolve_instance
from machinable.utils.utils import is_valid_module_path


class Jsonable:
    def as_json(self, stringify=True):
        serialized = self.serialize()
        if stringify:
            serialized = json.dumps(serialized)
        return serialized

    @classmethod
    def from_json(cls, serialized):
        if isinstance(serialized, str):
            serialized = json.loads(serialized)
        return cls.unserialize(serialized)

    def clone(self):
        return self.__class__.from_json(self.as_json())

    # abstract methods

    def serialize(self):
        raise NotImplementedError

    @classmethod
    def unserialize(cls, serialized):
        raise NotImplementedError


class Discoverable:
    def __init_subclass__(cls, *args, **kwargs):
        super().__init_subclass__(*args, **kwargs)
        # register(cls) todo

    @classmethod
    def make(cls, args):
        """Creates an instance"""
        if isinstance(args, cls):
            return args

        discovered = cls.discover()
        if discovered is not None:
            return discovered

        if args is None:
            return cls()

        if isinstance(args, str):
            return cls(args)

        if isinstance(args, tuple):
            return cls(*args)

        if isinstance(args, dict):
            return cls(**args)

        raise ValueError(f"Invalid arguments: {args}")

    @classmethod
    def discover(cls):
        return None
        resolved = resolve_instance(args, Experiment, "_machinable.experiments")
        if resolved is not None:
            return resolved
