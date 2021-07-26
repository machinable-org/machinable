from typing import TYPE_CHECKING, Any, Callable, List, Optional, Tuple, Union

from functools import wraps

import arrow
from machinable import schema
from machinable.collection import Collection
from machinable.utils import (
    Jsonable,
    find_subclass_in_module,
    import_from_directory,
    resolve_at_alias,
)

if TYPE_CHECKING:
    from machinable.storage import Storage


def belongs_to(f: Callable) -> Any:
    @property
    @wraps(f)
    def _wrapper(self: "Element"):
        related_class = f()
        use_cache = True
        if isinstance(related_class, tuple):
            related_class, use_cache = related_class
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            related = self.__model__._storage_instance.retrieve_related(
                self.__model__._storage_id,
                f"{self._kind.lower()}.{name}",
            )
            if related is None:
                return None
            element = related_class.from_model(related)
            if not use_cache:
                return element
            self.__related__[name] = element

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
        name = f.__name__
        if self.__related__.get(name, None) is None and self.is_mounted():
            related = self.__model__._storage_instance.retrieve_related(
                self.__model__._storage_id,
                f"{self._kind.lower()}.{name}",
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


class MetaElement(type):
    def __getitem__(cls, view: str) -> "Element":
        from machinable.view import get

        return get(resolve_at_alias(view, f"{cls._kind.lower()}s"), cls)


class Element(Jsonable, metaclass=MetaElement):
    """Element baseclass"""

    _kind = None

    def __new__(cls, *args, **kwargs):
        view = kwargs.pop("view", cls._kind in ["Experiment", "Execution"])
        if view is True:
            view = args[0] if len(args) > 0 else False
        if getattr(cls, "_active_view", None) is None and isinstance(view, str):
            from machinable.project import Project

            module = import_from_directory(view, Project.get().path())
            view_class = find_subclass_in_module(module, cls)
            if view_class is not None:
                return super().__new__(view_class)

        return super().__new__(cls)

    def __init__(self, view: Union[bool, None, str] = True):
        super().__init__()
        self.__model__: schema.Model = None
        self.__related__ = {}
        self._active_view: Optional[str] = None
        self._cache = {}

    def mount(self, storage: "Storage", storage_id: Any) -> bool:
        if self.__model__ is None:
            return False

        self.__model__._storage_instance = storage
        self.__model__._storage_id = storage_id

        return True

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

    def __getitem__(self, view: str) -> "Element":
        from machinable.view import from_element

        return from_element(
            resolve_at_alias(view, f"{self._kind.lower()}s"), self
        )

    @classmethod
    def from_model(cls, model: schema.Model) -> "Element":
        instance = cls()
        instance.__model__ = model
        return instance

    @classmethod
    def find(cls, element_id: str, *args, **kwargs) -> Optional["Element"]:
        from machinable.repository import Repository

        storage = Repository.get().storage()

        storage_id = getattr(storage, f"find_{cls._kind.lower()}")(
            element_id, *args, **kwargs
        )

        if storage_id is None:
            return None

        return cls.from_storage(storage_id, storage)

    @property
    def storage_id(self) -> Optional[str]:
        if not self.is_mounted():
            return None

        return self.__model__._storage_id

    @property
    def storage_instance(self) -> Optional["Storage"]:
        if not self.is_mounted():
            return None

        return self.__model__._storage_instance

    @classmethod
    def from_storage(cls, storage_id, storage=None) -> "Element":
        if storage is None:
            from machinable.repository import Repository

            storage = Repository.get().storage()

        return cls.from_model(
            getattr(storage, f"retrieve_{cls._kind.lower()}")(storage_id)
        )

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

            raise ValueError(f"Invalid {cls._kind.lower()} model: {element}.")

        if cls._kind is None:
            return schema.Model

        return getattr(schema, cls._kind)

    def serialize(self) -> dict:
        return self.__model__.dict()

    @classmethod
    def unserialize(cls, serialized):
        return cls.from_model(cls.model()(**serialized))

    def __reduce__(self) -> Union[str, Tuple[Any, ...]]:
        return (self.__class__, (), self.serialize())

    def __getstate__(self):
        return self.serialize()

    def __setstate__(self, state):
        self.__model__ = self.__class__.model()(**state)

    def __str__(self):
        return self.__repr__()
