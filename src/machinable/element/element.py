from typing import TYPE_CHECKING, Optional

import os

from machinable.collection import Collection
from machinable.project.project import Project
from machinable.schema import SchemaType
from machinable.storage.storage import Storage
from machinable.utils import Jsonable
from machinable.view.view import View


class Element(Jsonable):
    """Element baseclass"""

    __project__: Optional[Project] = None

    def __init__(self, *args, **kwargs):
        super().__init__()
        self.__model__ = None
        self.__related__ = {}

        if not isinstance(self.__project__, Project):
            self.__project__ = Project()

    def view(self, name: str) -> View:
        # lookup available under alias?
        pass

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
        if not isinstance(cls.__project__, Project):
            cls.__project__ = Project()
        return cls.__project__.provider().find(cls.__name__, element_id)

    @classmethod
    def collect(cls, elements) -> Collection:
        """Returns a collection of the element type"""
        return Collection(elements)

    @classmethod
    def unserialize(cls, serialized):
        return cls(**serialized)

    def __str__(self):
        return self.__repr__()
