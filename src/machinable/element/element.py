# This file contains modified 3rd party source code from https://github.com/MasoniteFramework/orm.
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.

from typing import Optional

from machinable.collection import Collection
from machinable.settings import get_settings
from machinable.storage.storage import Storage
from machinable.utils.traits import Jsonable

connection = {
    "default": "mysql",
    "sqlite": {"database": ":memory:"},
    "mysql": {
        "host": "127.0.0.1",
        "database": "masonite",
        "user": "root",
        "password": "root",
        "port": 3306,
        "prefix": "",
        "options": {
            #
        },
    },
}


class Element(Jsonable):
    """Base class for storage models"""

    __storage__: Optional["Storage"] = None

    def __init__(self) -> None:
        super().__init__()
        self.uuid = None
        self._related = {}

        if not isinstance(self.__storage__, Storage):
            self.__storage__ = Storage.make(get_settings()["default_storage"])

    def exists(self):
        return self.uuid is not None

    # todo: resolve __storage__ and forward to self.__storage__.find()
    @classmethod
    def find(cls, element_id):
        from machinable.repository.repository import Repository

        # hack
        # which uses where(self.__storage__.filesystem.url) and
        # returns the repository in form of a hydrated element
        # (and any other elements it like to hydrate)
        # it has to hydrate the UUID
        repository = "bla"
        element = cls()
        element._related["repository"] = Repository(repository)
        element.experiment_id = element_id
        return element

    @classmethod
    def collection(cls, data) -> Collection:
        """Returns a collection of the model type"""
        return Collection(data)

    def __str__(self):
        return self.__repr__()
