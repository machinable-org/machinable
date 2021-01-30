# This file contains modified 3rd party source code from https://github.com/MasoniteFramework/orm.
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.

from typing import Optional

import machinable.errors
from machinable.collection import Collection
from machinable.settings import get_settings
from machinable.storage.storage import Storage
from machinable.utils.traits import Jsonable


class _ElementMeta(type):
    def __getattr__(self, attribute, *args, **kwargs):
        instantiated = self()
        return getattr(instantiated, attribute)


class Element(Jsonable, metaclass=_ElementMeta):
    """Base class for storage models"""

    __storage__: Optional["Storage"] = None
    __relations__: Optional[dict] = None

    """Pass through will pass any method calls to the storage.
    Anytime one of these methods are called on the element it will actually be called on the storage.
    """
    __passthrough__ = [
        "all",
        "bulk_create",
        "chunk",
        "count",
        "delete",
        "find_or_fail",
        "first_or_fail",
        "first",
        "get",
        "has",
        "joins",
        "last",
        "limit",
        "max",
        "min",
        "order_by",
        "select",
        "statement",
        "sum",
        "to_qmark",
        "to_sql",
        "update",
        "when",
        "where_has",
        "where_in",
        "where_like",
        "where_not_like",
        "where_null",
        "where",
        "with_",
    ]

    def __new__(cls, *args, **kwargs):
        element = super().__new__(cls)
        element.__attributes__ = {}
        element.__original_attributes__ = {}
        element.__dirty_attributes__ = {}
        element._relationships = {}
        return element

    def add_relation(self, relations):
        self._relationships.update(relations)
        return self

    @classmethod
    def storage(cls) -> Storage:
        if not isinstance(cls.__storage__, Storage):
            cls.__storage__ = Storage.make(get_settings()["default_storage"])

        return cls.__storage__

    @classmethod
    def collection(cls, data) -> Collection:
        """Returns a collection of the model type"""
        return Collection(data)

    @classmethod
    def hydrate(cls, data, relations=None):
        relations = relations or {}

    @classmethod
    def find(cls, uid):
        return False

    def save(self):
        """Save the element"""

    def __getattr__(self, attribute):
        if attribute in self.__passthrough__:

            def method(*args, **kwargs):
                return getattr(self.storage(), attribute)(*args, **kwargs)

            return method

        if (
            "__dirty_attributes__" in self.__dict__
            and attribute in self.__dict__["__dirty_attributes__"]
        ):
            return self.__dict__["__dirty_attributes__"][attribute]

        if (
            "__attributes__" in self.__dict__
            and attribute in self.__dict__["__attributes__"]
        ):
            return self.get_value(attribute)

        if attribute in self.__dict__.get("_relationships", {}):
            return self.__dict__["_relationships"][attribute]

        if attribute not in self.__dict__:
            raise AttributeError(
                f"{self.__class__.__name__} has no attribute {attribute}"
            )

        return None

    def __setattr__(self, attribute, value):
        try:
            if not attribute.startswith("_"):
                self.__dict__["__dirty_attributes__"].update({attribute: value})
            else:
                self.__dict__[attribute] = value
        except KeyError:
            pass

    def __str__(self):
        return self.__repr__()
