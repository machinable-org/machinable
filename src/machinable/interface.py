from typing import TYPE_CHECKING, Any, Dict, List, Optional, Union

import inspect
import shlex
import sys

from flatten_dict import flatten

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

from typing import Callable

import os
from functools import partial

import dill as pickle
from machinable import errors, schema
from machinable.collection import Collection, InterfaceCollection
from machinable.element import _CONNECTIONS as connected_elements
from machinable.element import Element, get_dump, get_lineage
from machinable.types import VersionType
from machinable.utils import (
    id_from_uuid,
    is_directory_version,
    joinpath,
    load_file,
    save_file,
    update_uuid_payload,
)
from uuid_extensions import uuid7


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
        if cls.__relations__ is None:
            cls.__relations__ = {}
        cls.__relations__[name] = self

    def __get__(self, instance, owner):
        if (
            not instance._relation_cache.get(self.fn.__name__, None)
            and instance.is_mounted()
        ):
            from machinable.index import Index

            related = Index.get().find_related(
                relation=self.name, uuid=instance.uuid, inverse=self.inverse
            )

            if related is not None:
                related = [
                    Interface.find_by_id(r.uuid, fetch=False) for r in related
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


def _uuid_symlink(directory, uuid, mode="file"):
    dst = os.path.join(directory, id_from_uuid(uuid))
    try:
        os.makedirs(dst, exist_ok=True)
        if mode == "file":
            with open(os.path.join(dst, "link"), "w") as f:
                f.write("../../" + uuid)
        else:
            os.symlink("../../" + uuid, os.path.join(dst, "link"))
    except OSError:
        pass

    return uuid


class Interface(Element):
    kind = "Interface"
    default = None
    # class level relationship information
    # note that the actual data is kept in
    # the __related__ object propery and
    # existence should be checked on
    # actual interface instance
    __relations__: Optional[Dict[str, Relation]] = None

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

        self._kwargs["uses"] = uses
        self._kwargs["derived_from"] = derived_from

        # initialize relation data
        self.__related__ = {}
        self._relation_cache = {}
        if self.__relations__ is None:
            self.__relations__ = {}
        # relation_names = defaultdict(lambda: 0)
        for name, relation in self.__relations__.items():
            # if relation_names[relation.name] > 2:
            #     raise RuntimeError(f"Relationship name '{relation.name}' is ambigous. Set key on '{relation.fn.__name__}' to distinguish.")
            # relation_names[relation.name] += 1
            if relation.multiple:
                self.__related__[name] = relation.collect([])
            else:
                self.__related__[name] = None
        if uses:
            if not isinstance(uses, (list, tuple)):
                uses = [uses]
            for use in uses:
                self.__related__["uses"].append(use)
            self._relation_cache["uses"] = True

        if derived_from:
            self.__related__["ancestor"] = derived_from
            self._relation_cache["ancestor"] = True

        self._deferred_data = {}
        self._futures_stack = set()

    @classmethod
    def collect(cls, elements) -> InterfaceCollection:
        return InterfaceCollection(elements)

    def push_related(self, key: str, value: "Interface") -> None:
        if self.is_committed():
            raise errors.MachinableError(
                f"{repr(self)} already exists and cannot be modified."
            )
        if self.__relations__[key].multiple:
            self.__related__[key].append(value)
        else:
            self.__related__[key] = value
        self._relation_cache[key] = True

    def is_committed(self) -> bool:
        from machinable.index import Index

        return Index.get().find_by_id(self.uuid) is not None

    def commit(self) -> Self:
        from machinable.index import Index

        index = Index.get()

        # only commit if not already in index
        if index.find_by_id(self.uuid) is not None:
            return self

        self.on_before_commit()

        self.__model__.context = context = self.compute_context()
        self.__model__.uuid = update_uuid_payload(self.__model__.uuid, context)

        # ensure that configuration and predicate has been computed
        assert self.config is not None
        self.__model__.predicate = self.compute_predicate()

        self.on_commit()

        # commit to index
        for k, v in self.__related__.items():
            if v is None:
                continue
            r = self.__relations__[k]
            if not r.multiple:
                v = [v]
            for u in [i.commit().uuid for i in v]:
                if r.inverse:
                    index.create_relation(r.name, u, self.uuid)
                else:
                    index.create_relation(r.name, self.uuid, u)
        index.commit(self.__model__)

        # save to directory
        self.to_directory(self.local_directory(create=True))

        # commit to storage
        from machinable.storage import Storage

        for storage in Storage.connected():
            storage.commit(self)

        # write deferred files
        for filepath, data in self._deferred_data.items():
            self.save_file(filepath, data)
        self._deferred_data = {}

        self.on_after_commit()

        return self

    def on_before_commit(self):
        """Event hook before interface is committed."""

    def on_commit(self):
        """Event hook during interface commit when uuid, config, context
        and predicate have been computed and commit is about to be performed"""

    def on_after_commit(self):
        """Event hook after interface has been committed."""

    @belongs_to
    def project():
        from machinable.project import Project

        return Project

    @has_many(cached=False, key="derivatives")
    def derived() -> InterfaceCollection:
        """Returns a collection of derived interfaces"""
        return Interface

    @belongs_to(key="derivatives")
    def ancestor() -> Optional["Interface"]:
        """Returns parent interface or None if interface is independent"""
        return Interface

    @has_many(key="using")
    def uses() -> InterfaceCollection:
        return Interface

    @belongs_to_many(key="using")
    def used_by() -> InterfaceCollection:
        return Interface

    def related(self, deep: bool = False) -> InterfaceCollection:
        """Returns a collection of related interfaces"""
        collection = []
        for k, v in self.__relations__.items():
            if getattr(self, k, False) is False:
                continue
            if v.multiple:
                collection.extend(getattr(self, k))
            else:
                r = getattr(self, k)
                if r is not None:
                    collection.append(r)

        if deep:
            seen = {self.uuid}
            for i in collection:
                if not hasattr(i, "related") or i.uuid in seen:
                    continue
                collection.extend(i.related(deep=False).all())
                seen.add(i.uuid)

        return InterfaceCollection(collection).unique(lambda x: x.uuid)

    def related_iterator(self):
        seen = {self.uuid}
        for relation_attribute, relationship in self.__relations__.items():
            if getattr(self, relation_attribute, False) is False:
                continue
            related = getattr(self, relation_attribute)
            if not related:
                continue
            if not relationship.multiple:
                related = [related]
            for r in related:
                if r.uuid in seen:
                    continue
                yield r, relationship, seen
                seen.add(r.uuid)

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

    def derive(
        self,
        module: Union[str, Element, None] = None,
        version: VersionType = None,
        **kwargs,
    ) -> Self:
        if module is None:
            return self.make(module, version, derived_from=self, **kwargs)

        return self.derived.singleton(
            module, version, derived_from=self, **kwargs
        )

    @classmethod
    def singleton(
        cls,
        module: Union[str, "Element"],
        version: VersionType = None,
        **kwargs,
    ) -> "Collection":
        if module in [
            "machinable.index",
            "machinable.project",
        ] and is_directory_version(version):
            # interpret as shortcut for directory
            version = {"directory": version}
        candidates = cls.find(
            module,
            version,
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
    def find_by_id(cls, uuid: str, fetch: bool = True) -> Optional["Interface"]:
        from machinable.index import Index

        index = Index.get()

        model = index.find_by_id(uuid)
        if not model:
            return None

        if fetch is False and not model.module.startswith("__session__"):
            return cls.from_model(model)

        local_directory = index.local_directory(model.uuid)

        if not os.path.exists(local_directory):
            # try to fetch storage
            from machinable.storage import fetch as fetch_from_storage

            if not fetch_from_storage(model.uuid, local_directory):
                return None

        return cls.from_directory(local_directory)

    @classmethod
    def find_many_by_id(
        cls, uuids: List[str], fetch: bool = True
    ) -> "InterfaceCollection":
        return cls.collect([cls.find_by_id(uuid, fetch) for uuid in uuids])

    @classmethod
    def find_by_hash(
        cls, context_hash: str, fetch: bool = True
    ) -> Optional["Interface"]:
        from machinable.index import Index

        index = Index.get()

        return cls.collect(
            [
                cls.find_by_id(m.uuid, fetch)
                for m in index.find_by_hash(context_hash)
            ]
        )

    @classmethod
    def find(
        cls,
        module: Union[str, "Element"],
        version: VersionType = None,
        **kwargs,
    ) -> "InterfaceCollection":
        from machinable.index import Index

        index = Index.get()

        if module is None:
            context = {"predicate": {}}
            for scope in connected_elements["Scope"]:
                context["predicate"].update(scope())
            return cls.collect(
                [
                    cls.find_by_id(interface.uuid, fetch=False)
                    for interface in index.find_by_context(context)
                ]
            ).filter(lambda i: i.matches(context))

        try:
            candidate = cls.make(module, version, **kwargs)
        except ModuleNotFoundError:
            return cls.collect([])

        context = candidate.compute_context()
        if context is None:
            return cls.collect([])

        found = []

        for model in index.find_by_context(context):
            if not model.module.startswith("__session__"):
                found.append(cls.from_model(model))
                continue

            local_directory = index.local_directory(model.uuid)
            if not os.path.exists(local_directory):
                from machinable.storage import fetch as fetch_from_storage

                if not fetch_from_storage(model.uuid, local_directory):
                    continue

            # if in-session object, we need to update the pickled update
            #  since it might have changed
            assert not isinstance(module, str)
            save_file([local_directory, "dump.p"], pickle.dumps(module))

            found.append(cls.from_directory(local_directory))

        return cls.collect(found).filter(lambda i: i.matches(context))

    @classmethod
    def from_directory(cls, directory: str) -> Self:
        """Returns an interface from a storage directory

        Note that this does not verify the integrity of the directory.
        In particular, the interface may be missing or not be indexed.
        """
        data = load_file([directory, "model.json"])

        model = getattr(schema, data["kind"], None)
        if model is None:
            # TODO: users should have an option to register custom interface types
            raise ValueError(f"Invalid interface kind: {model['kind']}")

        interface = model(**data)
        if interface.module.startswith("__session__"):
            interface._dump = load_file([directory, "dump.p"], None)

        return cls.from_model(interface)

    def to_directory(self, directory: str, relations: bool = True) -> Self:
        save_file([directory, ".machinable"], self.__model__.uuid)
        save_file([directory, "model.json"], self.__model__)
        if self.__model__._dump is not None:
            save_file([directory, "dump.p"], self.__model__._dump)

        def _write_meta(d, r, uuid, related_uuid):
            save_file(
                [d, "related", "metadata.jsonl"],
                {
                    "uuid": uuid,
                    "related_uuid": related_uuid,
                    "name": r.name,
                    "multiple": r.multiple,
                    "inverse": r.inverse,
                    "cached": r.cached,
                    "fn": r.fn.__name__,
                },
                mode="a",
            )

        if relations:
            for k, v in self.__related__.items():
                if not v:
                    continue
                r = self.__relations__[k]
                if not r.multiple:
                    v = [v]
                # forward
                save_file(
                    [directory, "related", k],
                    "\n".join([_uuid_symlink(directory, i.uuid) for i in v])
                    + "\n",
                    mode="a",
                )
                for u in v:
                    if r.inverse:
                        _write_meta(directory, r, u.uuid, self.uuid)
                    else:
                        _write_meta(directory, r, self.uuid, u.uuid)
                # inverse
                for i in v:
                    try:
                        ir = [
                            _
                            for _ in i.__relations__.values()
                            if _.name == r.name and _ is not r
                        ][0]
                        save_file(
                            [i.local_directory(), "related", ir.fn.__name__],
                            _uuid_symlink(i.local_directory(), self.uuid)
                            + "\n",
                            mode="a",
                        )
                        if ir.inverse:
                            _write_meta(
                                i.local_directory(), ir, i.uuid, self.uuid
                            )
                        else:
                            _write_meta(
                                i.local_directory(), ir, self.uuid, i.uuid
                            )
                    except:
                        pass

        return self

    def fetch(
        self, directory: Optional[str] = None, force: bool = False
    ) -> bool:
        if not self.is_committed():
            return False

        if "fetched" in self._cache and not force:
            return True

        if directory is None:
            from machinable.index import Index

            directory = Index.get().local_directory(self.uuid)

        if not os.path.exists(directory) or force:
            from machinable.storage import fetch

            if not fetch(self.uuid, directory):
                return False

        self._cache["fetched"] = True
        return True

    def local_directory(self, *append: str, create: bool = False) -> str:
        from machinable.index import Index

        directory = Index.get().local_directory(self.uuid, *append)

        if create:
            os.makedirs(directory, exist_ok=True)

        return directory

    def load_file(
        self, filepath: Union[str, List[str]], default=None
    ) -> Optional[Any]:
        filepath = joinpath(filepath)
        if not self.is_mounted():
            # has write been deferred?
            if filepath in self._deferred_data:
                return self._deferred_data[filepath]

            return default

        data = load_file(self.local_directory(filepath), default=None)

        return data if data is not None else default

    def save_file(self, filepath: Union[str, List[str]], data: Any) -> str:
        filepath = joinpath(filepath)

        if os.path.isabs(filepath):
            raise ValueError("Filepath must be relative")

        if not self.is_mounted():
            # defer writes until interface storage is mounted
            self._deferred_data[filepath] = data
            return "$deferred"

        file = save_file(self.local_directory(filepath), data, makedirs=True)

        return file

    def launch(self) -> Self:
        ...

    def cached(self):
        from machinable.execution import Execution

        with Execution().deferred() as e:
            self.launch()
        return e.executables.reduce(
            lambda result, x: result and x.cached(), True
        )

    def future(self) -> Optional[Self]:
        from machinable.execution import Execution

        if Execution.is_connected():
            self.launch()
            return None

        ready = self.cached()

        # if this is called within an interface, we keep
        #  track of the state for later reference
        outer = None
        stack = inspect.stack()
        try:
            outer = stack[1][0].f_locals.get("self", None)
        finally:
            del stack

        if isinstance(outer, Interface) and outer != self:
            if ready:
                outer._futures_stack.discard(self.id)
            else:
                outer._futures_stack.add(self.id)

        if not ready or len(self._futures_stack) > 0:
            return None

        return self

    # a posteriori modifiers

    def all(self) -> "InterfaceCollection":
        module = (
            self.module
            if not self.module.startswith("__session__")
            else self.__class__
        )
        return self.find(module, self.__model__.version, **self._kwargs)

    def new(self) -> Self:
        return self.make(self.module, self.__model__.version, **self._kwargs)
