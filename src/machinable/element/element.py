# This file contains modified 3rd party source code from https://github.com/MasoniteFramework/orm.
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.

from typing import Optional

import machinable.errors
from machinable.collection import Collection
from machinable.settings import get_settings
from machinable.utils.traits import Jsonable


def get_storage(obj) -> "Storage":
    from machinable.storage.storage import Storage

    if not isinstance(obj.__storage__, Storage):
        obj.__storage__ = Storage.make(get_settings()["default_storage"])

    return obj.__storage__


class Element(Jsonable):
    """Base class for storage models"""

    __storage__: Optional["Storage"] = None
    __relations__ = {}

    @classmethod
    def storage(cls) -> "Storage":
        from machinable.storage.storage import Storage

        if not isinstance(cls.__storage__, Storage):
            cls.__storage__ = Storage.make(get_settings()["default_storage"])

        return cls.__storage__

    @property
    def uid(self):
        raise NotImplementedError

    @classmethod
    def from_storage(cls, uri):
        pass

    @classmethod
    def collection(cls, data) -> Collection:
        """Returns a collection of the model type"""
        return Collection(data)

    @classmethod
    def hydrate(cls, data, relations=None):
        relations = relations or {}

    @classmethod
    def find_or_create(cls, uid=None):
        return cls.create()

    def exists(self):
        return False

    @classmethod
    def find(cls, uid=None):
        return get_storage(cls).find(cls.__name__, uid)

    def save(self):
        # todo: update
        get_storage(self).create(self)

    @classmethod
    def on(cls, storage):
        cls.__storage__ = storage
        return cls
