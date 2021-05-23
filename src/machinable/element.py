from typing import Any, Callable, List, Optional

from functools import wraps

import arrow
from machinable import schema
from machinable.collection import Collection
from machinable.utils import Jsonable


def belongs_to(f: Callable) -> Any:
    @property
    @wraps(f)
    def _wrapper(self: "Element"):
        related_class = f()
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            related = self.__model__._storage[name].retrive_related(
                self.__model__, name
            )
            self.__related__[name] = related_class.from_model(related)

        return self.__related__.get(name, None)

    return _wrapper


has_one = belongs_to


def has_many(f: Callable) -> Any:
    @property
    @wraps(f)
    def _wrapper(self: "Element") -> Any:
        args = f()
        use_cache = True
        if len(args) == 2:
            related_class, collection = args
        elif len(args) == 3:
            related_class, collection, use_cache = args
        else:
            assert False, "Invalid number of relation arguments"
        if not self.is_mounted() and use_cache is False:
            return None
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            related = self.__model__._storage[name].retrieve_related(
                name, self.__model__
            )
            self.__related__[name] = collection(
                [related_class.from_model(r) for r in related]
            )

        return self.__related__.get(name, None)

    return _wrapper


class Connectable:
    """Connectable trait"""

    __connection__: Optional["Connectable"] = None

    @classmethod
    def get(cls) -> "Connectable":
        return cls() if cls.__connection__ is None else cls.__connection__

    def connect(self) -> "Connectable":
        self.__class__.__connection__ = self
        return self

    def close(self) -> "Connectable":
        if self.__class__.__connection__ is self:
            self.__class__.__connection__ = None
        return self

    def __enter__(self):
        self._outer_connection = (  # pylint: disable=attribute-defined-outside-init
            self.__class__.__connection__
        )
        self.connect()
        return self

    def __exit__(self, exc_type, exc_value, exc_traceback):
        if self.__class__.__connection__ is self:
            self.__class__.__connection__ = None
        if getattr(self, "_outer_connection", None) is not None:
            self.__class__.__connection__ = self._outer_connection


class Element(Jsonable):
    """Element baseclass"""

    def __init__(self):
        super().__init__()
        self.__model__ = None
        self.__related__ = {}
        self._cache = {}

    def is_mounted(self):
        return self.__model__ is not None

    def mount(self, model: schema.Model):
        if model._storage_instance is None or model._storage_id is None:
            raise ValueError("Model has to expose storage information")

        self.__model__ = model

    @belongs_to
    def project():
        from machinable.project import Project

        return Project

    @classmethod
    def from_model(cls, model: schema.Model) -> "Element":
        instance = cls()
        instance.__model__ = model
        return instance

    def to_model(self):
        raise NotImplementedError

    @classmethod
    def find(cls, element_id: str) -> "Element":
        from machinable.repository import Repository

        return Repository.get().storage().find(cls.__name__, element_id)

    @classmethod
    def find_many(cls, elements: List[str]) -> "Collection":
        return cls.collect([cls.find(element_id) for element_id in elements])

    def find_latest(self, limit=10, since=None):
        if since is None:
            condition = {"<=": arrow.now()}
        else:
            condition = {">": since}
        raise NotImplementedError

    @classmethod
    def collect(cls, elements) -> Collection:
        """Returns a collection of the element type"""
        return Collection(elements)

    @classmethod
    def unserialize(cls, serialized):
        return cls(**serialized)

    def __str__(self):
        return self.__repr__()
