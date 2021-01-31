# This file contains modified 3rd party source code from https://github.com/MasoniteFramework/orm.
# The copyright and license agreement can be found in the ThirdPartyNotices.txt file at the root of this repository.

from typing import Optional

from machinable.collection import Collection
from machinable.settings import get_settings
from machinable.storage.storage import Storage
from machinable.utils.traits import Jsonable
from masoniteorm.connections import ConnectionFactory, ConnectionResolver
from masoniteorm.models import Model
from masoniteorm.query import QueryBuilder

connection = {
    "default": "mysql",
    "sqlite": {"database": ":mem:"},
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
DB = ConnectionResolver().set_connection_details(connection)


class ElementQueryBuilder(QueryBuilder):
    def on(self, connection):

        if connection == "default":
            self.connection = self._connection_details.get("default")
        else:
            self.connection = connection

        if self.connection not in self._connection_details:
            raise ConnectionNotRegistered(
                f"Could not find the '{self.connection}' connection details"
            )

        self._connection_driver = self._connection_details.get(
            self.connection
        ).get("driver")
        self.connection_class = DB.connection_factory._connections.get("mysql")

        self.grammar = self.connection_class.get_default_query_grammar()

        return self


class Element(Model):
    """Base class for storage models"""

    __storage__: Optional["Storage"] = None

    def get_builder(self):

        self.builder = ElementQueryBuilder(
            connection=self.__connection__,
            table=self.get_table_name(),
            connection_details=connection,
            model=self,
            scopes=self._scopes,
            dry=self.__dry__,
        )

        return self.builder

    @classmethod
    def storage(cls) -> Storage:
        if not isinstance(cls.__storage__, Storage):
            cls.__storage__ = Storage.make(get_settings()["default_storage"])

        return cls.__storage__

    @classmethod
    def collection(cls, data) -> Collection:
        """Returns a collection of the model type"""
        return Collection(data)

    def __str__(self):
        return self.__repr__()
