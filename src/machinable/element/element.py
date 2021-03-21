# This file contains modified 3rd party source code from https://github.com/MasoniteFramework/orm.
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.

from typing import Optional

from machinable.collection import Collection
from machinable.project.project import Project
from machinable.settings import get_settings
from machinable.storage.storage import Storage
from machinable.utils.traits import Jsonable


class Element(Jsonable):
    """Element baseclass"""

    __project__: Optional[Project] = None
    __storage__: Optional[Storage] = None

    def __init__(self) -> None:
        super().__init__()
        self.uuid = None
        self.url = None
        self.__related__ = {}

        if not isinstance(self.__project__, Project):
            self.__project__ = Project.make(get_settings()["default_project"])

        if not isinstance(self.__storage__, Storage):
            self.__storage__ = Storage.make(get_settings()["default_storage"])

    def exists(self):
        return self.uuid is not None

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
