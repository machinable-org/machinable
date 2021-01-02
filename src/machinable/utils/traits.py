import json


class Jsonable:
    def to_json(self, stringify=True):
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
        return self.__class__.from_json(self.to_json())

    # abstract methods

    def serialize(self):
        raise NotImplementedError

    @classmethod
    def unserialize(cls, serialized):
        raise NotImplementedError


class Discoverable(type):
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        # register(cls) todo

    @classmethod
    def discover(cls):
        resolved = resolve_instance(args, Experiment, "_machinable.experiments")
        if resolved is not None:
            return resolved
