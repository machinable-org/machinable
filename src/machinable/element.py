from typing import TYPE_CHECKING, Any, Callable, List, Optional, Tuple, Union

from functools import wraps

import arrow
from machinable import schema
from machinable.collection import Collection
from machinable.utils import Jsonable

if TYPE_CHECKING:
    from machinable.view import View


def belongs_to(f: Callable) -> Any:
    @property
    @wraps(f)
    def _wrapper(self: "Element"):
        related_class = f()
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            related = self.__model__._storage_instance.retrieve_related(
                self.__model__._storage_id,
                f"{self.__class__.__name__.lower()}.{name}",
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
        # if not self.is_mounted() and use_cache is False:
        #     return None
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            related = self.__model__._storage_instance.retrieve_related(
                self.__model__._storage_id,
                f"{self.__class__.__name__.lower()}.{name}",
            )
            if related is None:
                return None
            collected = collection(
                [related_class.from_model(r) for r in related]
            )
            if not use_cache:
                return collected
            self.__related__[name] = collected

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
        self.__model__: schema.Model = None
        self.__related__ = {}
        self._cache = {}

    def is_mounted(self) -> bool:
        if self.__model__ is None:
            return False

        return (
            self.__model__._storage_instance is not None
            and self.__model__._storage_id is not None
        )

    @belongs_to
    def project():
        from machinable.project import Project

        return Project

    def __getitem__(self, view: str) -> "View":
        from machinable.view import View

        if view.startswith("!") or view.endswith("!"):
            # force reconstruction
            return View.make(view.replace("!", ""), self)

        if f"views:{view}" not in self._cache:
            self._cache[f"views:{view}"] = View.make(view, self)

        return self._cache[f"views:{view}"]

    @classmethod
    def from_model(cls, model: schema.Model) -> "Element":
        instance = cls()
        instance.__model__ = model
        return instance

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
    def model(cls, element: Optional[Any] = None) -> schema.Model:
        if element is not None:
            if isinstance(element, cls):
                return element.__model__

            if isinstance(element, cls.model()):
                return element

            raise ValueError(
                f"Invalid {cls.__name__.lower()} model: {element}."
            )

        return getattr(schema, cls.__name__)

    def serialize(self) -> dict:
        return self.__model__.dict()

    @classmethod
    def unserialize(cls, serialized):
        return cls.from_model(cls.model(**serialized))

    def __reduce__(self) -> Union[str, Tuple[Any, ...]]:
        return (self.__class__, (), self.serialize())

    def __getstate__(self):
        return self.serialize()

    def __setstate__(self, state):
        self.__model__ = self.__class__.model()(**state)

    def __str__(self):
        return self.__repr__()
