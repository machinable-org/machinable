from typing import TYPE_CHECKING, Any, Dict, List, Optional, Union

import shlex
import sys

from flatten_dict import flatten

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

from typing import Callable

import os
from functools import partial, wraps

from machinable import schema
from machinable.collection import Collection, InterfaceCollection
from machinable.element import (
    Element,
    get_dump,
    get_lineage,
    resolve_custom_predicate,
)
from machinable.index import Index
from machinable.settings import get_settings
from machinable.storage import Storage
from machinable.types import VersionType
from machinable.utils import load_file, save_file
from omegaconf import OmegaConf


def relation(relation_type: str) -> Any:
    def _relation(f: Callable) -> Any:
        @property
        @wraps(f)
        def _wrapper(
            self: "Element",
        ) -> Union["Interface", InterfaceCollection]:
            relation_name = f.__name__
            if (
                self.__related__.get(relation_name, None) is None
                and self.is_mounted()
            ):
                if relation_type != "has_many":
                    related_class = f()
                    use_cache = True
                    if isinstance(related_class, tuple):
                        related_class, use_cache = related_class
                else:
                    args = f()
                    use_cache = True
                    if len(args) == 2:
                        related_class, collection = args
                    elif len(args) == 3:
                        related_class, collection, use_cache = args
                    else:
                        assert False, "Invalid number of relation arguments"
                related = Index.retrieve_related(
                    uuid=self.uuid,
                    kind=self.kind,
                    relation_name=relation_name,
                    relation_type=relation_type,
                )
                if related is None:
                    return None
                if relation_type != "has_many":
                    retrieved = related_class.from_model(related)
                else:
                    retrieved = collection(
                        [related_class.from_model(r) for r in related]
                    )
                if not use_cache:
                    return retrieved
                self.__related__[relation_name] = retrieved

            return self.__related__.get(relation_name, None)

        return _wrapper

    return _relation


class Relation:
    direction: str = "outgoing"

    def __init__(
        self,
        fn,
        cached: bool = True,
        collection: Union[bool, Collection] = False,
        key: Optional[str] = None,
    ) -> None:
        self.fn = fn
        self.cached = cached
        self.collection = collection
        self.cls = None
        self._related_cls = None
        self._key = key

    @property
    def related_cls(self) -> "Interface":
        if self._related_cls is None:
            self._related_cls = self.fn()
        return self._related_cls

    @property
    def type_name(self) -> str:
        return self.__class__.__name__.lower()

    @property
    def name(self) -> str:
        return self.fn.__name__

    @property
    def key(self) -> str:
        if self._key is None:
            if self.direction == "outgoing":
                self._key = f"{self.cls.kind}.{self.related_cls.kind}"
            else:
                self._key = f"{self.related_cls.kind}.{self.cls.kind}"

        return self._key

    def collect(self, elements: List["Interface"]) -> Collection:
        if self.collection is True:
            return self.related_cls.collect(elements)
        return self.collection(elements)

    def __set_name__(self, cls, name):
        self.cls = cls
        cls.__relations__[name] = self

    def __get__(self, instance, owner):
        if (
            instance._relation_cache[self.name] is not True
            and instance.is_mounted()
        ):
            index = Storage.get().index
            if index is None:
                return None

            related = index.find_related(uuid=instance.uuid, relation=self.key)

            if self.collection is False:
                if related:
                    related = self.related_cls.from_model(related[0])
                else:
                    related = None
            else:
                related = self.collect(
                    [self.related_cls.from_model(r) for r in related or []]
                )

            instance._relation_cache[self.name] = self.cached

            instance.__related__[self.name] = related

        return instance.__related__[self.name]


class BelongsTo(Relation):
    direction = "reverse"


class HasOne(Relation):
    pass


class HasMany(Relation):
    pass


def relation(cls: Relation, multiple: bool = False) -> Any:
    def _relation(
        f: Optional[Callable] = None,
        *,
        cached: bool = True,
        collection: Union[bool, Collection] = multiple,
    ) -> Any:
        if f is None:
            return partial(cls, cached=cached, collection=collection)

        return cls(f, cached=cached, collection=collection)

    return _relation


belongs_to = relation(BelongsTo)
has_one = relation(HasOne)
has_many = relation(HasMany, multiple=True)


class Interface(Element):
    kind = "Interface"
    default = get_settings().default_interface
    __relations__: Dict[str, Relation] = {}  # relationship information

    def __init__(
        self,
        version: VersionType = None,
        uses: Union[None, "Interface", List["Interface"]] = None,
        derived_from: Optional["Interface"] = None,
    ):
        super().__init__(version=version)
        self.__model__ = schema.Interface(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            lineage=get_lineage(self),
        )
        self.__model__._dump = get_dump(self)

        # initialize relation data
        self.__related__ = {}
        self._relation_cache = {}
        for name, relation in self.__relations__.items():
            self._relation_cache[name] = False
            if relation.collection is not False:
                self.__related__[name] = relation.collect([])
            else:
                self.__related__[name] = None
        if uses:
            self.use(uses)
        self.__related__["ancestor"] = derived_from

        self._deferred_data = {}

    def commit(self) -> Self:
        Storage.get().commit(self)

        return self

    @belongs_to
    def project():
        from machinable.project import Project

        return Project

    @has_many(cached=False)
    def derived() -> InterfaceCollection:
        """Returns a collection of derived interfaces"""
        return Interface

    @belongs_to
    def ancestor() -> Optional["Interface"]:
        """Returns parent interface or None if interface is independent"""
        return Interface

    @has_many
    def uses() -> InterfaceCollection:
        return Interface

    def to_cli(self) -> str:
        cli = [self.module]
        for v in self.__model__.version:
            if isinstance(v, str):
                cli.append(v)
            else:
                cli.extend(
                    [
                        f"{key}={shlex.quote(str(val))}"
                        for key, val in flatten(v, reducer="dot").items()
                    ]
                )

        return " ".join(cli)

    def use(self, use: Union[Element, List[Element]]) -> Self:
        # todo: check for editablility

        if isinstance(use, (list, tuple)):
            for _use in use:
                self.use(_use)
            return self

        self.__related__["uses"].append(use)

        return self

    @classmethod
    def singleton(
        cls,
        module: Union[str, "Element"],
        version: VersionType = None,
        predicate: Optional[str] = get_settings().default_predicate,
        **kwargs,
    ) -> "Collection":
        candidates = cls.find_by_predicate(
            module,
            version,
            predicate,
            **kwargs,
        )
        if candidates:
            return candidates[-1]

        return cls.make(module, version, **kwargs)

    def is_mounted(self) -> bool:
        if self.__model__ is None:
            return False

        return os.path.exists(self.local_directory())

    @classmethod
    def find(cls, uuid: str) -> Optional["Element"]:
        from machinable.storage import Storage

        storage = Storage.get()

        # storage.index.find(uuid)

        if directory is None:
            return None

        return cls.from_directory(directory)

    @classmethod
    def find_many(cls, elements: List[str]) -> "Collection":
        return cls.collect([cls.find(element_id) for element_id in elements])

    @classmethod
    def find_by_predicate(
        cls,
        module: Union[str, "Element"],
        version: VersionType = None,
        predicate: Optional[str] = get_settings().default_predicate,
        **kwargs,
    ) -> "Collection":
        from machinable.storage import Storage

        storage = Storage.get()
        try:
            candidate = cls.make(module, version, **kwargs)
        except ModuleNotFoundError:
            return cls.collect([])

        element_type = candidate.kind.lower()
        handler = f"find_{element_type}_by_predicate"

        if hasattr(storage, handler):
            if predicate:
                predicate = OmegaConf.to_container(
                    OmegaConf.create(
                        {
                            p: candidate.predicate[p]
                            for p in resolve_custom_predicate(
                                predicate, candidate
                            )
                        }
                    )
                )
            storage_ids = getattr(storage, handler)(
                module
                if isinstance(module, str)
                else f"__session__{module.__name__}",
                predicate,
            )
        else:
            storage_ids = []

        return cls.collect(
            [
                cls.from_model(
                    getattr(storage, f"retrieve_{element_type}")(storage_id)
                )
                for storage_id in storage_ids
            ]
        )

    @classmethod
    def from_directory(cls, directory: str) -> "Element":
        """Returns an interface from a storage directory

        Note that this does not verify the integrity of the directory.
        In particular, the interface may be missing or not be indexed.
        """
        return cls.from_model(load_file(os.path.join(directory, "model.json")))

    def to_directory(self, directory: str, relations=True) -> None:
        save_file(os.path.join(directory, ".machinable"), self.__model__.uuid)
        save_file(os.path.join(directory, "model.json"), self.__model__)
        if relations:
            for k, v in self.__related__.items():
                if isinstance(v, Interface):
                    save_file(os.path.join(directory, "related", k), v.uuid)
                elif v is not None:
                    for i in v:
                        save_file(
                            os.path.join(directory, "related", k),
                            i.uuid + "\n",
                            mode="a",
                        )

    def local_directory(
        self, *append: str, create: bool = False
    ) -> Optional[str]:
        return Storage.get().local_directory(self.uuid, *append, create=create)

    def load_file(self, filepath: str, default=None) -> Optional[Any]:
        if not self.is_mounted():
            # has write been deferred?
            if filepath in self._deferred_data:
                return self._deferred_data[filepath]

            return default

        data = load_file(self.local_directory(filepath), default=None)

        return data if data is not None else default

    def save_file(self, filepath: str, data: Any) -> str:
        if os.path.isabs(filepath):
            raise ValueError("Filepath must be relative")

        if not self.is_mounted():
            # defer writes until interface storage is mounted
            self._deferred_data[filepath] = data
            return "$deferred"

        file = save_file(self.local_directory(filepath), data, makedirs=True)

        return file
