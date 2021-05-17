from typing import TYPE_CHECKING, Optional

from machinable.collection import Collection
from machinable.project import Project
from machinable.schema import SchemaType
from machinable.utils import Jsonable


def belongs_to(f):
    @property
    def _wrapper(self):
        related_class = f()
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            related = self.__model__._storage[name].retrive_related(
                self.__model__, name
            )
            self.__related__[name] = related_class.from_model(related)

        return self.__related__[name]

    return _wrapper


has_one = belongs_to


def has_many(f):
    @property
    def _wrapper(self):
        related_class, collection = f()
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            related = self.__model__._storage[name].retrieve_related(
                name, self.__model__
            )
            self.__related__[name] = collection(
                [related_class.from_model(r) for r in related]
            )

        return self.__related__[name]

    return _wrapper


class Element(Jsonable):
    """Element baseclass"""

    def __init__(self, *args, **kwargs):
        super().__init__()
        self.__model__ = None
        self.__related__ = {}
        self.__project__ = Project.get()

    def is_mounted(self):
        return self.__model__ is not None

    def to_model(self, mount=True) -> SchemaType:
        model = self._to_model()

        if not mount:
            return model

        self.__model__ = model
        return self.__model__

    def _to_model(self) -> SchemaType:
        raise NotImplementedError

    @classmethod
    def from_model(cls, model: SchemaType) -> "Element":
        instance = cls()
        instance.__model__ = model
        return instance

    @classmethod
    def find(cls, element_id):
        return Project.get().provider().find(cls.__name__, element_id)

    @classmethod
    def collect(cls, elements) -> Collection:
        """Returns a collection of the element type"""
        return Collection(elements)

    @classmethod
    def unserialize(cls, serialized):
        return cls(**serialized)

    def __str__(self):
        return self.__repr__()
