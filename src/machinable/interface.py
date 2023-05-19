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


class Relation:
    inverse: bool = False
    multiple: bool = False

    def __init__(
        self,
        fn,
        cached: bool = True,
        collection: Optional[Collection] = None,
        key: Optional[str] = None,
    ) -> None:
        self.fn = fn
        self.cached = cached
        self.collection = collection
        self.key = key

        self.cls = None
        self._related_cls = None

    @property
    def related_cls(self) -> "Interface":
        if self._related_cls is None:
            self._related_cls = self.fn()
        return self._related_cls

    @property
    def name(self) -> str:
        if not self.inverse:
            return f"{self.cls.kind}.{self.related_cls.kind}.{self.key or 'default'}"
        else:
            return f"{self.related_cls.kind}.{self.cls.kind}.{self.key or 'default'}"

    def collect(self, elements: List["Interface"]) -> Collection:
        if self.collection is None:
            return self.related_cls.collect(elements)
        return self.collection(elements)

    def __set_name__(self, cls, name):
        self.cls = cls
        cls.__relations__[name] = self

    def __get__(self, instance, owner):
        if (
            not instance._relation_cache.get(self.fn.__name__, None)
            and instance.is_mounted()
        ):
            storage = Storage.get()
            if storage.index is None:
                return None

            related = storage.index.find_related(
                relation=self.name, uuid=instance.uuid, inverse=self.inverse
            )

            if related is not None:
                related = [
                    Interface.from_directory(storage.local_directory(r.uuid))
                    for r in related
                    if storage.retrieve(r.uuid)
                ]

                if self.multiple is False:
                    related = related[0] if len(related) > 0 else None
                else:
                    related = self.collect(related)

            instance._relation_cache[self.fn.__name__] = self.cached
            instance.__related__[self.fn.__name__] = related

        return instance.__related__[self.fn.__name__]


class HasOne(Relation):
    pass


class HasMany(Relation):
    multiple = True


class BelongsTo(Relation):
    inverse = True


class BelongsToMany(Relation):
    inverse = True
    multiple = True


def _relation(cls: Relation) -> Any:
    def _wrapper(
        f: Optional[Callable] = None,
        *,
        cached: bool = True,
        collection: Optional[Collection] = None,
        key: Optional[str] = None,
    ) -> Any:
        if f is None:
            return partial(cls, cached=cached, collection=collection, key=key)

        return cls(f, cached=cached, collection=collection, key=key)

    return _wrapper


belongs_to = _relation(BelongsTo)
has_one = _relation(HasOne)
has_many = _relation(HasMany)
belongs_to_many = _relation(BelongsToMany)


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
            if relation.multiple:
                self.__related__[name] = relation.collect([])
            else:
                self.__related__[name] = None
        if uses:
            self.use(uses)
        self.push_related("ancestor", derived_from)

        self._deferred_data = {}

    def push_related(self, key: str, value: "Interface") -> None:
        # todo: check for editablility
        if self.__relations__[key].multiple:
            self.__related__[key].append(value)
        else:
            self.__related__[key] = value
        self._relation_cache[key] = True

    def commit(self) -> Self:
        Storage.get().commit(self)

        # write deferred files
        for filepath, data in self._deferred_data.items():
            self.save_file(filepath, data)
        self._deferred_data = {}

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

        self.push_related("uses", use)

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

        if not (
            storage.index
            and storage.index.find(uuid)
            and storage.retrieve(uuid)
        ):
            return None

        return cls.from_directory(storage.local_directory(uuid))

    @classmethod
    def find_many(cls, uuids: List[str]) -> "Collection":
        return cls.collect([cls.find(uuid) for uuid in uuids])

    @classmethod
    def find_by_predicate(
        cls,
        module: Union[str, "Element"],
        version: VersionType = None,
        predicate: Optional[str] = get_settings().default_predicate,
        **kwargs,
    ) -> "Collection":
        try:
            candidate = cls.make(module, version, **kwargs)
        except ModuleNotFoundError:
            return cls.collect([])

        if predicate:
            predicate = OmegaConf.to_container(
                OmegaConf.create(
                    {
                        p: candidate.predicate[p]
                        for p in resolve_custom_predicate(predicate, candidate)
                    }
                )
            )

        from machinable.storage import Storage

        return cls.collect(
            [
                cls.find(interface.uuid)
                for interface in Storage.get().index.find_by_predicate(
                    module
                    if isinstance(module, str)
                    else f"__session__{module.__name__}",
                    predicate,
                )
            ]
        )

    @classmethod
    def from_directory(cls, directory: str) -> "Element":
        """Returns an interface from a storage directory

        Note that this does not verify the integrity of the directory.
        In particular, the interface may be missing or not be indexed.
        """
        data = load_file(os.path.join(directory, "model.json"))

        model = getattr(schema, data["kind"], None)
        if model is None:
            # TODO: users should have an option to register custom interface types
            raise ValueError(f"Invalid interface kind: {model['kind']}")

        interface = model(**data)
        if interface.module.startswith("__session__"):
            interface._dump = load_file(os.path.join(directory, "dump.p"), None)

        return cls.from_model(interface)

    def to_directory(self, directory: str, relations=True) -> Self:
        save_file(os.path.join(directory, ".machinable"), self.__model__.uuid)
        save_file(os.path.join(directory, "model.json"), self.__model__)
        if self.__model__._dump is not None:
            save_file(os.path.join(directory, "dump.p"), self.__model__._dump)
        if relations:
            for k, v in self.__related__.items():
                if hasattr(v, "uuid"):
                    save_file(os.path.join(directory, "related", k), v.uuid)
                elif v is not None:
                    for i in v:
                        save_file(
                            os.path.join(directory, "related", k),
                            i.uuid + "\n",
                            mode="a",
                        )

        return self

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
