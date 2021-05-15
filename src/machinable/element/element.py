from typing import TYPE_CHECKING, Optional

from machinable.collection import Collection
from machinable.project.project import Project
from machinable.schema import SchemaType
from machinable.utils import Jsonable


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
