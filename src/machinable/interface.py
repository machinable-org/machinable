from typing import Any, List, Optional, Union

import shlex
import sys

from flatten_dict import flatten

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

import os

from machinable import schema
from machinable.collection import (
    Collection,
    ComponentCollection,
    ElementCollection,
)
from machinable.element import (
    Element,
    belongs_to,
    get_dump,
    get_lineage,
    has_many,
    resolve_custom_predicate,
)
from machinable.settings import get_settings
from machinable.types import VersionType
from omegaconf import OmegaConf


class Interface(Element):
    kind = "Interface"
    default = get_settings().default_interface

    def __init__(
        self,
        version: VersionType = None,
        uses: Union[None, Element, List[Element]] = None,
        derived_from: Optional["Component"] = None,
    ):
        super().__init__(version=version)
        self.__model__ = schema.Interface(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            lineage=get_lineage(self),
        )
        self.__model__._dump = get_dump(self)
        self.__related__["uses"] = ElementCollection()
        if uses:
            self.use(uses)
        if derived_from is not None:
            self.__model__.derived_from = derived_from.uuid
            self.__related__["ancestor"] = derived_from

    def commit(self) -> "Component":
        self.on_before_commit()

        Storage.get().commit(self)

        return self

    @has_many
    def derived() -> "ComponentCollection":
        """Returns a collection of derived components"""
        return Component, ComponentCollection, False

    @belongs_to
    def ancestor() -> Optional["Component"]:
        """Returns parent component or None if component is independent"""
        return Component

    @has_many
    def uses() -> ElementCollection:
        return Element, ElementCollection

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

    def use(self, use: Union[Element, List[Element]]) -> "Self":
        self._assert_editable()

        if isinstance(use, (list, tuple)):
            for _use in use:
                self.use(_use)
            return self

        if not isinstance(use, Element):
            raise ValueError(f"Expected element, but found: {type(use)} {use}")

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

    # def mount(self, storage: "Storage", storage_id: Any) -> bool:
    #     if self.__model__ is None:
    #         return False

    #     self.__model__._storage_instance = storage
    #     self.__model__._storage_id = storage_id

    #     return True

    def is_mounted(self) -> bool:
        if self.__model__ is None:
            return False

        return (
            self.__model__._storage_instance is not None
            and self.__model__._storage_id is not None
        )

    @classmethod
    def find(cls, element_id: str, *args, **kwargs) -> Optional["Element"]:
        from machinable.storage import Storage

        storage = Storage.get()

        storage_id = getattr(storage, f"find_{cls.kind.lower()}")(
            element_id, *args, **kwargs
        )

        if storage_id is None:
            return None

        return cls.from_storage(storage_id, storage)

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
            from machinable.storage import Storage

            storage = Storage.get()

        return cls.from_model(
            getattr(storage, f"retrieve_{cls.kind.lower()}")(storage_id)
        )

    def directory(self, *append: str) -> Optional[str]:
        if not self.is_mounted():
            return None

        return self.__model__._storage_instance.path(self, *append)

    def on_compute_path(self) -> None:
        pass

    def local_directory(
        self, *append: str, create: bool = False
    ) -> Optional[str]:
        if not self.is_mounted():
            return None

        return self.__model__._storage_instance.local_directory(
            self, *append, create=create
        )

    def load_file(self, filepath: str, default=None) -> Optional[Any]:
        if not self.is_mounted():
            # has write been deferred?
            if filepath in self._deferred_data:
                return self._deferred_data[filepath]

            return default

        data = self.__model__._storage_instance.retrieve_file(self, filepath)

        return data if data is not None else default

    def save_file(self, filepath: str, data: Any) -> str:
        if os.path.isabs(filepath):
            raise ValueError("Filepath must be relative")

        if not self.is_mounted():
            # defer writes until element storage creation
            self._deferred_data[filepath] = data
            return "$deferred"

        file = self.__model__._storage_instance.create_file(
            self, filepath, data
        )

        # mark scripts as executable
        if filepath.endswith(".sh"):
            st = os.stat(file)
            os.chmod(file, st.st_mode | stat.S_IEXEC)

        return file

    def save_data(self, filepath: str, data: Any) -> str:
        return self.save_file(os.path.join("data", filepath), data)

    def load_data(self, filepath: str, default=None) -> Optional[Any]:
        return self.load_file(os.path.join("data", filepath), default)
