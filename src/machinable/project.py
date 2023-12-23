from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union

import getpass
import importlib
import os
import platform
import shutil
import socket
import subprocess
import sys
import urllib.request

import machinable
from machinable import schema
from machinable.element import (
    Element,
    extend,
    get_lineage,
    instantiate,
    normversion,
)
from machinable.errors import ConfigurationError
from machinable.interface import Interface
from machinable.types import VersionType
from machinable.utils import (
    find_subclass_in_module,
    get_commit,
    get_diff,
    get_root_commit,
    import_from_directory,
    is_directory_version,
)
from pydantic import BaseModel, Field, field_validator

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


def fetch_git(source: str, target: str) -> bool:
    name, directory = os.path.split(target)
    command = ["git", "clone", source, name]
    process = subprocess.Popen(command, cwd=directory)
    process.communicate()

    if process.returncode != 0:
        return False

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


def import_element(
    directory: str, module: str, base_class: Any = None
) -> "Element":
    if base_class is None:
        base_class = Element

    # import project-relative
    module = (
        import_from_directory(
            module,
            directory,
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
                f"Could not find module '{module}' in project {directory}"
            ) from _e

    element_class = find_subclass_in_module(module, base_class)
    if element_class is None:
        raise ConfigurationError(
            f"Could not find an element inheriting from the {base_class.__name__} base class. "
            f"Is it correctly defined in {module.__name__}?"
        )

    return element_class


class Project(Interface):
    kind = "Project"

    class Config(BaseModel):
        directory: Optional[str] = Field(default_factory=lambda: os.getcwd())

        @field_validator("directory")
        def normalize_directory(cls, v):
            return os.path.normpath(os.path.abspath(os.path.expanduser(v)))

    def __init__(
        self,
        version: VersionType = None,
    ):
        if is_directory_version(version):
            # interpret as shortcut for directory
            version = {"directory": version}
        super().__init__(version=version)
        self.__model__ = schema.Project(
            kind=self.kind,
            version=normversion(version),
            lineage=get_lineage(self),
        )
        self._parent: Optional[Project] = None
        self._provider: str = "_machinable/project"
        self._resolved_provider: Optional[Project] = None

    def provider(self, reload: Union[str, bool] = False) -> "Project":
        """Resolves and returns the provider instance"""
        if isinstance(reload, str):
            self._provider = reload
            self._resolved_provider = None
        if self._resolved_provider is None or reload:
            if isinstance(self._provider, str):
                self._resolved_provider = find_subclass_in_module(
                    module=import_from_directory(
                        self._provider, self.config.directory
                    ),
                    base_class=Project,
                    default=Project,
                )(version=self.__model__.version)
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
            os.path.exists(self.config.directory)
            and self.config.directory not in sys.path
        ):
            if self.is_root():
                sys.path.insert(0, self.config.directory)
            else:
                sys.path.append(self.config.directory)

    def name(self) -> str:
        return os.path.basename(self.config.directory)

    def path(self, *append: str) -> str:
        return os.path.join(self.config.directory, *append)

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
            "id": get_root_commit(self.config.directory),
            "project": get_commit(self.config.directory),
            "vendor": {
                vendor: get_commit(self.path("vendor", vendor))
                for vendor in self.get_vendors()
            },
        }

    def element(
        self,
        module: Union[str, Element],
        version: VersionType = None,
        base_class: Any = None,
        **constructor_kwargs,
    ) -> "Element":
        module, element_class = self.provider().on_resolve_element(module)

        module, version = extend(module, version)

        if not isinstance(module, str):
            # interactive session element
            element_class = module
            module = "__session__" + element_class.__name__
        else:
            # import from project
            if element_class is None:
                element_class = import_element(self.path(), module, base_class)

        element = instantiate(
            module,
            element_class,
            version,
            **constructor_kwargs,
        )

        return element

    def get_diff(self) -> Union[str, None]:
        return get_diff(self.path())

    def exists(self) -> bool:
        return os.path.exists(self.config.directory)

    def serialize(self) -> dict:
        return {
            "directory": self.config.directory,
        }

    @classmethod
    def unserialize(cls, serialized: dict) -> "Project":
        return cls(serialized)

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

    def resolve_remotes(self, module: str) -> Optional[Element]:
        remotes = self.on_resolve_remotes()

        if module not in remotes:
            return None

        remote = remotes[module]
        directory = self.path("_machinable/remotes")
        remote_module = module.replace(".", "_")
        filename = os.path.join(directory, remote_module + ".py")

        # obtain from remote if not existing
        if not os.path.exists(filename):
            os.makedirs(directory, exist_ok=True)

            if remote.startswith("url+"):
                # download
                with urllib.request.urlopen(remote[4:]) as response, open(
                    filename, "wb"
                ) as out_file:
                    data = response.read()
                    out_file.write(data)
            elif remote.startswith("link+"):
                # symlink
                try:
                    if os.path.islink(filename):
                        os.remove(filename)
                    os.symlink(remote[5:], filename)
                    print(remote[5:])
                except OSError:
                    pass
            elif remote.startswith("file+"):
                # copy
                shutil.copy(remote[5:], filename)
            else:
                raise ValueError(f"Unknown remote type {remote}")

        try:
            element_class = find_subclass_in_module(
                import_from_directory(remote_module, directory, or_fail=True),
                Element,
            )
            if element_class is None:
                raise ModuleNotFoundError(
                    "Could not find an element in remote module"
                )
            return element_class
        except ModuleNotFoundError as _ex:
            raise ValueError(
                f"Invalid remote import: {remote} for {module} at {filename}"
            ) from _ex

    def on_resolve_remotes(self) -> Dict[str, str]:
        """Event triggered during remote resolution

        Return a dictionary of module names and their remote source.
        """
        return {}

    def on_resolve_element(
        self, module: Union[str, Element]
    ) -> Tuple[Union[str, Element], Optional[Element]]:
        """Override element resolution

        Return altered module and/or resolved Element class to be used instead.
        """
        if isinstance(module, str):
            try:
                return self._cache["on_resolve_element"][module]
            except KeyError:
                self._cache.setdefault("on_resolve_element", {})
                v = module, self.resolve_remotes(module)
                self._cache["on_resolve_element"][module] = v
                return v

        return module, None

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

    def on_parse_cli(self):
        """Triggered when CLI is invoked.

        You may return a list of modified arguments or implement a fully custom CLI here by returning its exit code.
        """
        return sys.argv[1:]

    def __repr__(self) -> str:
        return f"Project({self.config.directory})"
