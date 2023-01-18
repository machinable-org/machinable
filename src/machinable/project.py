import types
from typing import TYPE_CHECKING, Any, Dict, List, Optional, Union

import getpass
import importlib
import os
import platform
import socket
import sys

import machinable
from commandlib import Command
from machinable import schema
from machinable.element import Element, get_lineage, instantiate, normversion
from machinable.errors import ConfigurationError
from machinable.types import VersionType
from machinable.utils import (
    find_subclass_in_module,
    get_commit,
    get_diff,
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


def fetch_vendors(project: "Project"):
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

            if project.on_resolve_vendor(name, source, top_level) is not False:
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


class Project(Element):
    kind = "Project"

    def __init__(
        self,
        directory: Optional[str] = None,
        version: VersionType = None,
        name: Optional[str] = None,
    ):
        super().__init__()
        if directory is None:
            directory = os.getcwd()
        directory = os.path.abspath(directory)
        if name is None:
            name = os.path.basename(directory)
        self.__model__ = schema.Project(
            directory=directory,
            name=name,
            version=normversion(version),
            lineage=get_lineage(self),
        )
        self._parent: Optional[Project] = None
        self._provider: str = "_machinable/project"
        self._resolved_provider: Optional[Project] = None

    @classmethod
    def instance(
        cls,
        directory: Optional[str] = None,
        version: VersionType = None,
    ) -> "Project":
        return Project(directory, version).provider()

    def provider(self, reload: Union[str, bool] = False) -> "Project":
        """Resolves and returns the provider instance"""
        if isinstance(reload, str):
            self._provider = reload
            self._resolved_provider = None
        if self._resolved_provider is None or reload:
            if isinstance(self._provider, str):
                self._resolved_provider = find_subclass_in_module(
                    module=import_from_directory(
                        self._provider, self.__model__.directory
                    ),
                    base_class=Project,
                    default=Project,
                )(self.__model__.directory, version=self.__model__.version)
            else:
                self._resolved_provider = Project(
                    version=self.__model__.version
                )

        return self._resolved_provider

    @property
    def module(self) -> Optional[str]:
        if self.provider().__module__ != "machinable.project":
            return self._provider.replace("/", ".")

        return self.provider().__module__

    def add_to_path(self) -> None:
        if (
            os.path.exists(self.__model__.directory)
            and self.__model__.directory not in sys.path
        ):
            if self.is_root():
                sys.path.insert(0, self.__model__.directory)
            else:
                sys.path.append(self.__model__.directory)

    def name(self) -> str:
        return self.__model__.name

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

    def _element(self, module: str, base_class: Any = None) -> "Element":
        if base_class is None:
            base_class = Element

        # allow overrides
        module = self.provider().on_resolve_element(module)

        # import project-relative
        module = (
            import_from_directory(
                module,
                self.path(),
                or_fail=False,
            )
            or module
        )

        # import globally
        if isinstance(module, str):
            try:
                module = importlib.import_module(module)
            except ModuleNotFoundError as _e:
                raise ModuleNotFoundError(
                    f"Could not find module '{module}' in project {self.path()}"
                ) from _e

        element_class = find_subclass_in_module(module, base_class)
        if element_class is None:
            raise ConfigurationError(
                f"Could not find an element inheriting from the {base_class.__name__} base class. "
                f"Is it correctly defined in {module.__name__}?"
            )

        return element_class

    def element(
        self,
        module: str,
        version: VersionType = None,
        base_class: Any = None,
        **constructor_kwargs,
    ) -> "Element":
        element_class = self._element(module, base_class)
        return instantiate(
            self.provider().on_resolve_element(module),
            element_class,
            version,
            **constructor_kwargs,
        )

    def get_diff(self) -> Union[str, None]:
        return get_diff(self.path())

    def exists(self) -> bool:
        return os.path.exists(self.__model__.directory)

    def serialize(self) -> dict:
        return {
            "directory": self.__model__.directory,
            "provider": self._provider,
        }

    @classmethod
    def unserialize(cls, serialized: dict) -> "Project":
        return cls(**serialized)

    def get_host_info(self) -> dict:
        """Returned dictionary will be recorded as host information"""
        return {
            "network_name": platform.node(),
            "hostname": socket.gethostname(),
            "machine": platform.machine(),
            "python_version": platform.python_version(),
            "user": getpass.getuser(),
            "argv": sys.argv,
            "machinable_version": machinable.get_version(),
        }

    def on_resolve_element(self, module: str) -> str:
        return module

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

    def global_predicate(self) -> Dict:
        """Project-wide element predicates."""
        return {}

    def __repr__(self) -> str:
        return f"Project({self.__model__.directory})"
