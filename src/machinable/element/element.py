# This file contains modified 3rd party source code from https://github.com/MasoniteFramework/orm.
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.

from typing import Optional

from machinable.collection import Collection
from machinable.project.project import Project
from machinable.schema import SchemaType
from machinable.settings import get_settings
from machinable.storage.storage import Storage
from machinable.utils.traits import Jsonable


class Element(Jsonable):
    """Element baseclass"""

    __project__: Optional[Project] = None
    __storage__: Optional[Storage] = None

    def __init__(self, *args, **kwargs):
        super().__init__()
        self.__model__ = None
        self.__related__ = {}

        if not isinstance(self.__project__, Project):
            self.__project__ = Project.make(get_settings()["default_project"])

        if not isinstance(self.__storage__, Storage):
            self.__storage__ = Storage.make(get_settings()["default_storage"])

    def mounted(self):
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
        if not isinstance(cls.__storage__, Storage):
            cls.__storage__ = Storage.make(get_settings()["default_storage"])
        return cls.__storage__.find(cls.__name__, element_id)

    @classmethod
    def collect(cls, elements) -> Collection:
        """Returns a collection of the element type"""
        return Collection(elements)

    @classmethod
    def unserialize(cls, serialized):
        return cls.make(serialized)

    @classmethod
    def make(cls, args):
        """Creates an element instance"""
        if isinstance(args, cls):
            return args

        if args is None:
            return cls()

        if isinstance(args, str):
            return cls(args)

        if isinstance(args, tuple):
            return cls(*args)

        if isinstance(args, dict):
            return cls(**args)

        raise ValueError(f"Invalid arguments: {args}")

    def __str__(self):
        return self.__repr__()
