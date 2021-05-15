from typing import List, Optional, Tuple, Union

import os
import pickle
import sys

from machinable.component import Component
from machinable.config import parse as parse_config
from machinable.config import prefix as prefix_config
from machinable.errors import ConfigurationError, ExecutionFailed
from machinable.provider import Provider
from machinable.settings import get_settings
from machinable.storage.storage import Storage
from machinable.utils import (
    Jsonable,
    find_subclass_in_module,
    import_from_directory,
)
from machinable.utils.vcs import get_commit, get_diff, get_root_commit


class Project(Jsonable):

    __connection__: Optional["Project"] = None

    def __init__(
        self,
        directory: Optional[str] = None,
        provider: Union[str, Provider, None] = None,
        mode: Optional[str] = None,
    ):
        super().__init__()
        if directory is None:
            directory = os.getcwd()
        self._directory = os.path.abspath(directory)
        self._provider: Union[str, Provider, None] = provider
        self._resolved_provider: Optional[Provider] = None
        self._mode: Optional[str] = mode
        self._parent: Optional[Project] = None
        self._config: Optional[dict] = None
        self._parsed_config: Optional[dict] = None
        self._vendor_config: Optional[dict] = None

    @classmethod
    def get(cls) -> "Project":
        return Project() if cls.__connection__ is None else cls.__connection__

    def add_to_path(self) -> None:
        if os.path.exists(self._directory) and self._directory not in sys.path:
            if self.is_root():
                sys.path.insert(0, self._directory)
            else:
                sys.path.append(self._directory)

    def connect(self) -> "Project":
        self.add_to_path()
        Project.__connection__ = self
        return self

    def close(self) -> "Project":
        if Project.__connection__ is self:
            Project.__connection__ = None
        return self

    def path(self, *append: str) -> str:
        return os.path.join(self._directory, *append)

    def is_root(self) -> bool:
        return self._parent is None

    def get_root(self) -> "Project":
        if self.is_root():
            return self

        p = self._parent
        while not p.is_root():
            p = p._parent

        return p

    def get_vendors(self) -> List[str]:
        try:
            return [
                vendor
                for vendor in os.listdir(
                    self.path("vendor")
                )  # todo: how to ignore vendors?
            ]
        except FileNotFoundError:
            return []

    def get_code_version(self) -> dict:
        return {
            "id": get_root_commit(self._directory),
            "project": get_commit(self._directory),
            "vendor": {
                vendor: get_commit(self.path("vendor", vendor))
                for vendor in self.get_vendors()
            },
        }

    def get_diff(self):
        return get_diff(self._directory, search_parent_directories=False) or ""

    def exists(self) -> bool:
        return os.path.exists(self._directory)

    def provider(self, reload: bool = False) -> Provider:
        """Resolves and returns the provider instance"""
        if self._resolved_provider is None or reload:
            if isinstance(self._provider, str):
                self._resolved_provider = find_subclass_in_module(
                    module=import_from_directory(
                        self._provider, self._directory
                    ),
                    base_class=Provider,
                    default=Provider,
                )(mode=self._mode)
            elif issubclass(self._provider, Provider):
                self._resolved_provider = self._provider(mode=self._mode)
            else:
                self._resolved_provider = Provider(mode=self._mode)

        return self._resolved_provider

    def config(self, reload: bool = False) -> dict:
        if self._config is None or reload:
            self._config = self.provider().load_config(self._directory)

        return self._config

    def vendor_config(self, reload: bool = False) -> dict:
        if self._vendor_config is None or reload:
            self._vendor_config = {}
            for vendor_name in self.get_vendors():
                vendor_project = Project(self.path("vendor", vendor_name))
                vendor_project._parent = self

                vendor_config = prefix_config(
                    vendor_project.parsed_config(), "vendor." + vendor_name
                )
                self._vendor_config.update(vendor_config)

        return self._vendor_config

    def parsed_config(self, reload: bool = False):
        if self._parsed_config is None or reload:
            vendor_config = self.vendor_config(reload=reload)
            self._parsed_config = parse_config(
                self.config(reload=reload), vendor_config
            )

        return self._parsed_config

    def has_component(self, name: str, or_fail=False) -> bool:
        if name in self.parsed_config():
            return True

        if not or_fail:
            return False

        # todo: display richer error message with list of available components
        raise ValueError(f"Project {self._directory} has no component '{name}'")

    def get_component(
        self,
        name: str,
        version: Union[str, dict, None, List[Union[str, dict, None]]] = None,
    ) -> Component:
        self.has_component(name, or_fail=True)

        spec = self.parsed_config()[name]
        module = import_from_directory(
            spec["module"], self._directory, or_fail=True
        )
        base_class = self.provider().get_component_class(spec["kind"])
        if base_class is None:
            raise ConfigurationError(
                f"Could not resolve component type {spec['kind']}. "
                "Is it registered in the project's provider?"
            )
        component_class = find_subclass_in_module(module, base_class)
        if component_class is None:
            raise ConfigurationError(
                f"Could not find a component inheriting from the {base_class.__name__} base class."
                f"Is it correctly defined in {module}?"
            )

        return component_class(spec=spec, version=version)

    def serialize(self) -> dict:
        return {
            "directory": self._directory,
            "provider": self._provider,
            "mode": self._mode,
        }

    @classmethod
    def unserialize(cls, serialized: dict) -> "Project":
        return cls(**serialized)

    @property
    def name(self) -> Optional[str]:
        if not isinstance(self.config().get("name", None), str):
            return None

        return self.config()["name"]

    def __enter__(self):
        self.connect()
        return self

    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.close()

    def __repr__(self) -> str:
        return f"Project({self._directory})"
