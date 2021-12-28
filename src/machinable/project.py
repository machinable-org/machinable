import types
from typing import TYPE_CHECKING, Any, List, Optional, Union

import getpass
import importlib
import os
import platform
import socket
import sys

import machinable
from commandlib import Command
from machinable import schema
from machinable.config import from_file as load_config_from_file
from machinable.config import parse as parse_config
from machinable.config import prefix as prefix_config
from machinable.element import Connectable, Element, compact, normversion
from machinable.errors import ConfigurationError, MachinableError
from machinable.types import VersionType
from machinable.utils import (
    find_subclass_in_module,
    get_commit,
    get_diff,
    get_machinable_version,
    get_root_commit,
    import_from_directory,
)

if TYPE_CHECKING:
    from machinable.project import Project


def fetch_link(source, target):
    os.symlink(source, target, target_is_directory=True)
    return True


def fetch_directory(source, target):
    if not os.path.isdir(source):
        raise ValueError(f"{source} is not a directory")

    # we use symlink rather than copy for performance and consistency
    fetch_link(source, target)

    return True


def fetch_git(source, target):
    git = Command("git")
    name, directory = os.path.split(target)
    clone = git("clone").in_dir(directory)
    clone(source, name).run()

    return True


def fetch_vendor(source, target):
    if source is None:
        return False

    # git
    if source.startswith("git+"):
        return fetch_git(source[4:], target)

    # symlink
    if source.startswith("link+"):
        return fetch_link(source[5:], target)

    # default: directory
    return fetch_directory(source, target)


def fetch_vendors(project: "Project", config: Optional[dict] = None):
    if config is None:
        config = project.config().get("vendors", {})
    top_level_vendor = project.get_root().path("vendor")
    os.makedirs(top_level_vendor, exist_ok=True)

    vendors = []
    for dependency in project.get_vendors():
        if isinstance(dependency, str):
            dependency = {dependency: None}

        for name, args in dependency.items():
            vendors.append(name)

            # source config
            if not isinstance(args, str):
                args = None

            # give local .machinablerc priority over project config
            source = args
            if isinstance(source, str):
                source = os.path.expanduser(source)

            # local target folder
            os.makedirs(project.path("vendor"), exist_ok=True)
            target = project.path("vendor", name)

            # protect against invalid symlinks
            if os.path.islink(target) and not os.path.exists(target):
                os.unlink(target)

            # skip if already existing
            if os.path.exists(target):
                break

            # top-level target folder
            top_level = os.path.join(top_level_vendor, name)

            # protect against invalid symlinks
            if os.path.islink(top_level) and not os.path.exists(top_level):
                os.unlink(top_level)

            if (
                project.provider().on_resolve_vendor(name, source, top_level)
                is not False
            ):
                # fetch import to the top-level if it does not exist
                if not os.path.exists(top_level):
                    print(f"Fetching '+.{name}' to {top_level}")
                    if not fetch_vendor(source, top_level):
                        raise FileNotFoundError(
                            f"Could not fetch '+.{name}'. Please place it into {top_level}"
                        )

            # symlink from top-level to local target if not identical
            if top_level != target:
                os.symlink(top_level, target, target_is_directory=True)

            break

    return vendors


class Project(Connectable, Element):
    _kind = "Project"

    def __init__(
        self,
        directory: Optional[str] = None,
        version: VersionType = None,
    ):
        super().__init__()
        if directory is None:
            directory = os.getcwd()
        directory = os.path.abspath(directory)
        self.__model__ = schema.Project(
            directory=directory,
            version=normversion(version),
        )
        self._provider: str = "_machinable/project"
        self._resolved_provider: Optional[Provider] = None
        self._parent: Optional[Project] = None
        self._config: Optional[dict] = None
        self._parsed_config: Optional[dict] = None
        self._vendor_config: Optional[dict] = None

    def add_to_path(self) -> None:
        if (
            os.path.exists(self.__model__.directory)
            and self.__model__.directory not in sys.path
        ):
            if self.is_root():
                sys.path.insert(0, self.__model__.directory)
            else:
                sys.path.append(self.__model__.directory)

    def connect(self) -> "Project":
        self.add_to_path()
        return super().connect()

    def path(self, *append: str) -> str:
        return os.path.join(self.__model__.directory, *append)

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
                for vendor in os.listdir(self.path("vendor"))
                if os.path.isdir(self.path("vendor", vendor))
                # todo: how to ignore vendors?
            ]
        except FileNotFoundError:
            return []

    def get_code_version(self) -> dict:
        return {
            "id": get_root_commit(self.__model__.directory),
            "project": get_commit(self.__model__.directory),
            "vendor": {
                vendor: get_commit(self.path("vendor", vendor))
                for vendor in self.get_vendors()
            },
        }

    def get_diff(self) -> Union[str, None]:
        return

    def exists(self) -> bool:
        return os.path.exists(self.__model__.directory)

    def config(self, reload: bool = False) -> dict:
        if self._config is None or reload:
            self._config = self.provider().load_config(self.__model__.directory)

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

    def parsed_config(self, reload: bool = False) -> dict:
        if self._parsed_config is None or reload:
            vendor_config = self.vendor_config(reload=reload)
            self._parsed_config = parse_config(
                self.config(reload=reload), vendor_config
            )

        return self._parsed_config

    def has_component(self, name: str) -> bool:
        return name in self.parsed_config()

    def get_component(
        self,
        name: str,
        version: VersionType = None,
        uses: Optional[dict] = None,
        parent: Union["Element", "Component", None] = None,
    ) -> Element:
        config = {}
        kind = "components"

        if uses is None:
            uses = {}
        if not isinstance(uses, dict):
            raise ValueError(f"Uses must be a mapping, found {uses}")
        uses = {k: compact(v) for k, v in uses.items()}

        if name in self.parsed_config():
            component = self.parsed_config()[name]
            module = self.provider().on_component_import(
                component["module"], self
            )
            if module is None or isinstance(module, str):
                module = import_from_directory(
                    module if isinstance(module, str) else component["module"],
                    self.__model__.directory,
                    or_fail=True,
                )

            config = {
                **component["config_data"],
                "_lineage_": component["lineage"],
            }
            kind = component["kind"]
        else:
            try:
                module = importlib.import_module(name)
            except ModuleNotFoundError as _e:
                raise ValueError(f"Could not find component '{name}'") from _e

        base_class = self.provider().get_component_class(kind)
        if base_class is None:
            raise ConfigurationError(
                f"Could not resolve component type {kind}. "
                "Is it registered in the project's provider?"
            )
        component_class = find_subclass_in_module(module, base_class)
        if component_class is None:
            raise ConfigurationError(
                f"Could not find a component inheriting from the {base_class.__name__} base class. "
                f"Is it correctly defined in {module.__name__}?"
            )

        try:
            return component_class(
                config={**config, "_uses_": uses},
                version=version,
                parent=parent,
            )
        except TypeError as _e:
            raise MachinableError(
                f"Could not instantiate component {component_class.__module__}.{component_class.__name__}"
            ) from _e

    def serialize(self) -> dict:
        return {
            "directory": self.__model__.directory,
            "provider": self._provider,
        }

    @classmethod
    def unserialize(cls, serialized: dict) -> "Project":
        return cls(**serialized)

    @property
    def name(self) -> Optional[str]:
        if not isinstance(self.config().get("name", None), str):
            return None

        return self.config()["name"]

    def get_component_class(self, kind: str) -> Optional[Any]:
        """Returns the component base class for the component kind"""
        return getattr(machinable, kind[:-1].capitalize(), None)

    def get_host_info(self) -> dict:
        """Returned dictionary will be recorded as host information"""
        return {
            "network_name": platform.node(),
            "hostname": socket.gethostname(),
            "machine": platform.machine(),
            "python_version": platform.python_version(),
            "user": getpass.getuser(),
            "environ": os.environ.copy(),
            "argv": sys.argv,
            "machinable_version": get_machinable_version(),
        }

    def load_config(self, directory: str) -> dict:
        """Returns the configuration of the given project directory

        By default this will load a machinable.yaml file. You may
        overwrite this method to support other configuration formats
        in your project. Note that this method should return the raw
        configuration that will be parsed at a later stage
        """
        return load_config_from_file(
            os.path.join(directory, "machinable.yaml"), default={}
        )

    def on_resolve_vendor(
        self, name: str, source: str, target: str
    ) -> Optional[bool]:
        """Event triggered when vendor is resolved

        # Arguments
        name: The name of the vendor
        source: The source configuration
        target: The target directory (may or may not exists yet)

        Return False to prevent the default automatic resolution
        """

    def on_component_import(
        self, module: str, project: "Project"
    ) -> Union[None, str, types.ModuleType]:
        """Event triggered before a component is imported from a module

        You can prevent the import and return a component or an alternative module import path
        from this method to be used instead.

        # Arguments
        module: The module that is about to be imported
        project: The machinable project
        """

    def __repr__(self) -> str:
        return f"Project({self.__model__.directory})"
