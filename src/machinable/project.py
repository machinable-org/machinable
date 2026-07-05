"""Projects: the directory a session binds to, and vendor/remote resolution."""

import getpass
import importlib
import os
import platform
import shutil
import socket
import subprocess
import sys
import urllib.request
from typing import Any, cast

from pydantic import BaseModel, field_validator

import machinable
from machinable import schema
from machinable.config import Field
from machinable.errors import ConfigurationError
from machinable.interface import (
    Interface,
    extend,
    get_inherits,
    instantiate,
)
from machinable.types import VersionType
from machinable.utils import (
    find_subclass_in_module,
    import_from_directory,
    is_directory_version,
)


def _symlink_or_copy(source: str, target: str) -> None:
    """Symlink ``source`` -> ``target``, or copy where symlinks are forbidden.

    Windows without admin/Developer Mode raises ``OSError`` on symlink.
    """
    try:
        os.symlink(source, target, target_is_directory=True)
    except OSError:
        if os.path.isdir(source):
            shutil.copytree(source, target, symlinks=True)
        else:
            shutil.copy2(source, target)


def fetch_link(source, target):
    """Vendor fetcher: symlink (or copy) ``source`` to ``target``."""
    _symlink_or_copy(source, target)
    return True


def fetch_directory(source, target):
    """Vendor fetcher: link a local directory."""
    if not os.path.isdir(source):
        raise ValueError(f"{source} is not a directory")

    # we use symlink rather than copy for performance and consistency
    fetch_link(source, target)

    return True


def fetch_git(source: str, target: str) -> bool:
    """Vendor fetcher: clone a git repository."""
    name, directory = os.path.split(target)
    command = ["git", "clone", source, name]
    process = subprocess.Popen(command, cwd=directory)
    process.communicate()

    if process.returncode != 0:
        return False

    return True


def fetch_vendor(source, target):
    """Fetch a vendor from its source spec (``git+``, ``link+``, or directory)."""
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
    """Fetch every declared vendor into the project."""
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
                            f"Could not fetch '+.{name}'."
                            f" Please place it into {top_level}"
                        )

            # symlink from top-level to local target if not identical
            if top_level != target:
                _symlink_or_copy(top_level, target)

            break

    return vendors


def import_interface(
    directory: str, module: str, base_class: Any = None
) -> type[Interface]:
    """Import ``module`` from ``directory`` and return its interface class."""
    if base_class is None:
        base_class = Interface

    # import project-relative, falling back to a global import
    resolved = import_from_directory(module, directory, or_fail=False)
    if resolved is None:
        try:
            resolved = importlib.import_module(module)
        except ModuleNotFoundError as _e:
            raise ModuleNotFoundError(
                f"Could not find module '{module}' in project {directory}"
            ) from _e

    interface_class = find_subclass_in_module(resolved, base_class)
    if interface_class is None:
        raise ConfigurationError(
            f"Could not find an interface inheriting from the"
            f" {base_class.__name__} base class. "
            f"Is it correctly defined in {resolved.__name__}?"
        )

    return interface_class


class Project(Interface):
    """The project directory a session binds to.

    Also the root entry every other record scopes under.
    """

    kind = "Project"
    _ambient = True

    class Config(BaseModel):
        # Non-identifying (design/format.md: identity lives in files, never
        # paths): the project's filesystem location must not enter its
        # identity key, or one project splits into a different root per
        # checkout location. The portable discriminator between projects is
        # the directory *name*, contributed via `on_compute_predicate`.
        """``directory`` is non-identifying: location never enters identity."""

        directory: str | None = Field(
            default_factory=lambda: os.getcwd(), identifying=False
        )

        @field_validator("directory")
        def normalize_directory(cls, v):
            """Normalize the directory to an absolute path."""
            return os.path.normpath(os.path.abspath(os.path.expanduser(v)))

    def __init__(
        self,
        version: VersionType = None,
        username: str | None = None,
    ):
        if is_directory_version(version):
            # interpret as shortcut for directory
            version = {"directory": version}
        super().__init__(version=version)
        self.__model__ = schema.Project(
            kind=self.kind,
            version=self.__model__.version,
            inherits=get_inherits(self),
        )
        self._parent: Project | None = None
        self._provider: str = "interface/project"
        self._resolved_provider: Project | None = None
        self._root_entry = None
        # creator attribution; a plain attribute (not Config) so it never enters
        # the project's identity_key and fragments per-project de-duplication.
        self._username = username

    @property
    def username(self) -> str:
        """The user attributed as creator of interfaces in this project.

        Defaults to the OS user.
        """
        return self._username or getpass.getuser()

    def __enter__(self):
        super().__enter__()
        self._root_entry = None
        return self

    @property
    def index(self):
        """The connected (or default) Index."""
        from machinable.index import Index

        return Index.get()

    @property
    def storage(self):
        """The connected (or default) Storage."""
        from machinable.storage import Storage

        return Storage.get()

    def reindex(self, storage=None, *, relations: bool = True) -> list[str]:
        """(Re)build this project's Index by scanning a Storage for.

        ``.machinable`` markers. Defaults to the project's connected Storage
        (a directory under ``./storage``). Returns the ingested uuids.
        """
        from machinable.index import Index

        return Index.get().reindex(storage, relations=relations)

    def ensure_project_root(self):
        """Lazily materialize this Project as its own first index entry.

        The Project is a first-class interface whose directory is the project
        directory itself; every interface in the project is scoped under this
        root entry. Idempotent, and resilient to a rebuilt/wiped index (the
        cached entry is re-validated and re-created if missing).
        """
        from machinable.index import Index

        index = Index.get()
        if self._root_entry is not None:
            if index.get_by_id(self._root_entry.record_id) is None:
                self._root_entry = None
        if self._root_entry is None:
            self._root_entry = index.materialize_from(self).entry
        return self._root_entry

    def provider(self, reload: str | bool = False) -> "Project":
        """Resolves and returns the provider instance."""
        if isinstance(reload, str):
            self._provider = reload
            self._resolved_provider = None
        if self._resolved_provider is None or reload:
            if isinstance(self._provider, str):
                # without an interface/project.py, fall back to the connected
                # class itself so a directly connected Project subclass keeps
                # its hook overrides
                self._resolved_provider = find_subclass_in_module(
                    module=import_from_directory(self._provider, self.config.directory),
                    base_class=Project,
                    default=type(self),
                )(version=self.__model__.version)
            else:
                self._resolved_provider = Project(version=self.__model__.version)

        return self._resolved_provider

    @property
    def module(self) -> str | None:
        """The provider's module path."""
        if self.provider().__module__ != "machinable.project":
            return self._provider.replace("/", ".")

        return self.provider().__module__

    def add_to_path(self) -> None:
        """Put the project directory on ``sys.path``."""
        if (
            os.path.exists(self.config.directory)
            and self.config.directory not in sys.path
        ):
            if self.is_root():
                sys.path.insert(0, self.config.directory)
            else:
                sys.path.append(self.config.directory)

    def name(self) -> str:
        """The project directory's name (its portable discriminator)."""
        return os.path.basename(self.config.directory)

    def on_compute_predicate(self) -> dict:
        # The portable discriminator between projects (identity excludes the
        # location, so something must distinguish two different projects in
        # one index): the directory *name*. Two checkouts of "my-study" on
        # different machines are the same project; by design, this is what
        # makes collaborator ingest land under the same root.
        """The directory name: the portable discriminator between projects."""
        return {"name": self.name()}

    def compute_predicate(self) -> dict:
        # Unlike work interfaces, the project root must NOT absorb ambient
        # Scope predicates: ensure_project_root() runs inside whatever context
        # happened to trigger the first materialization, and a scope-polluted
        # root predicate would mint a different root per scope (with the
        # deterministic record id below, a loud IndexCollision; before it, a
        # silent duplicate root).
        """The root predicate.

        The project's directory name only; the root never absorbs ambient
        scopes.
        """
        return self.on_compute_predicate()

    def compute_record_id(self) -> str:
        """Deterministic root record id, derived from the identity triple.

        Every index mints the *same* root uuid for the same project, so
        cross-peer ``id.json`` parent references resolve on ingest and the
        interface dedup triple (parent, identity, predicate) matches across
        machines, where random per-index root ids would orphan every shared
        record.
        """
        from machinable.utils import object_hash, sanitize_filename

        identity = sanitize_filename(self.catalog_identity_key(), max_len=128)
        return (
            "P"
            + object_hash({"identity": identity, "predicate": self.predicate_key})[:11]
        )

    def path(self, *append: str) -> str:
        """Absolute path inside the project directory."""
        return os.path.join(self.config.directory, *append)

    def is_root(self) -> bool:
        """True when this project has no parent project."""
        return self._parent is None

    def get_root(self) -> "Project":
        """The root project of a vendor chain."""
        if self.is_root():
            return self

        p = self._parent
        while p is not None and not p.is_root():
            p = p._parent

        assert p is not None
        return p

    def get_vendors(self) -> list[str]:
        """Names of vendored dependencies under ``vendor/``."""
        try:
            return [
                vendor
                for vendor in os.listdir(self.path("vendor"))
                if os.path.isdir(self.path("vendor", vendor))
                # todo: how to ignore vendors?
            ]
        except FileNotFoundError:
            return []

    def on_resolve_manifests(self) -> list[str]:
        """Code-provenance tools to capture for each run.

        Returns importable ``Manifest`` modules; the default is the built-in
        git manifest. Override in your project to add or replace tools (a
        dependency lock, a container digest); each is an ordinary
        :class:`~machinable.manifest.Manifest` subclass, resolved like any
        interface.
        """
        return ["machinable.manifest"]

    def interface(
        self,
        module: "str | Interface | type[Interface]",
        version: VersionType = None,
        base_class: Any = None,
        **constructor_kwargs,
    ) -> Interface:
        """Resolve and instantiate an interface module from this project."""
        module, interface_class = self.provider().on_resolve_interface(module)

        module, version = extend(cast("str | Interface", module), version)

        if not isinstance(module, str):
            # interactive session interface
            interface_class = module
            module = "__session__" + interface_class.__name__
        else:
            # import from project
            if interface_class is None:
                interface_class = import_interface(self.path(), module, base_class)

        interface = instantiate(
            cast(str, module),
            interface_class,
            version,
            **constructor_kwargs,
        )

        return interface

    def exists(self) -> bool:
        """True when the project directory exists."""
        return os.path.exists(self.config.directory)

    def serialize(self) -> dict:
        """The project as a plain dict."""
        return {
            "directory": self.config.directory,
        }

    @classmethod
    def unserialize(cls, serialized: dict) -> "Project":
        """Rebuild a project from ``serialize()`` output."""
        return cls(serialized)

    def get_host_info(self) -> dict:
        """Returned dictionary will be recorded as host information."""
        return {
            "network_name": platform.node(),
            "hostname": socket.gethostname(),
            "machine": platform.machine(),
            "python_version": platform.python_version(),
            "user": getpass.getuser(),
            "argv": sys.argv,
            "machinable_version": machinable.get_version(),
        }

    def fetch_remote(self, module: str) -> str | None:
        """Fetch a declared remote module into ``interface/remotes/``, no import.

        Recursively fetches declared dependencies and returns the local file
        path, or ``None`` when ``module`` is not a declared remote. Since
        remote modules execute on import, fetching first (``machinable
        fetch``) lets you inspect the code before anything runs.
        """
        remotes = self.on_resolve_remotes()

        if module not in remotes:
            return None

        remote = remotes[module]

        if isinstance(remote, list | tuple):
            remote, *dependencies = remote
            for dependency in dependencies:
                self.fetch_remote(dependency)

        directory = self.path("interface/remotes")
        remote_module = module.replace(".", "_")
        filename = os.path.join(directory, remote_module + ".py")

        # obtain from remote if not existing
        if not os.path.exists(filename):
            os.makedirs(directory, exist_ok=True)

            if remote.startswith("url+"):
                # download
                with (
                    urllib.request.urlopen(remote[4:]) as response,
                    open(filename, "wb") as out_file,
                ):
                    data = response.read()
                    out_file.write(data)
            elif remote.startswith("link+"):
                # symlink, falling back to a copy where symlinks are not permitted
                # (Windows without admin/Developer Mode) so the import still resolves
                if os.path.islink(filename):
                    os.remove(filename)
                try:
                    os.symlink(remote[5:], filename)
                except OSError:
                    shutil.copy(remote[5:], filename)
            elif remote.startswith("file+"):
                # copy
                shutil.copy(remote[5:], filename)
            else:
                raise ValueError(
                    f"Unknown remote type for {module}: {remote}"
                    f" (target file is {filename}"
                )

        return filename

    def resolve_remotes(self, module: str) -> Interface | None:
        """Fetch and import a remote module declared by ``on_resolve_remotes``."""
        remotes = self.on_resolve_remotes()

        if module not in remotes:
            return None

        remote = remotes[module]

        if isinstance(remote, list | tuple):
            remote, *dependencies = remote
            # dependencies must be imported (not just fetched) so the main
            # module's bare-name imports resolve through sys.modules
            for dependency in dependencies:
                self.resolve_remotes(dependency)

        filename = self.fetch_remote(module)
        directory = self.path("interface/remotes")
        remote_module = module.replace(".", "_")

        try:
            interface_class = find_subclass_in_module(
                import_from_directory(remote_module, directory, or_fail=True),
                Interface,
            )
            if interface_class is None:
                raise ModuleNotFoundError(
                    "Could not find an interface in remote module"
                )
            return interface_class
        except ModuleNotFoundError as _ex:
            raise ValueError(
                f"Invalid remote import: {remote} for {module} at {filename}"
            ) from _ex

    def on_resolve_remotes(self) -> "dict[str, str | list[str]]":
        """Event triggered during remote resolution.

        Return a dictionary of module names and their remote source (or a
        ``[source, *dependency_modules]`` list).
        """
        return {}

    def on_resolve_interface(
        self, module: "str | Interface | type[Interface]"
    ) -> "tuple[str | Interface | type[Interface], type[Interface] | None]":
        """Override interface resolution.

        Return altered module and/or resolved Interface class to be used instead.
        """
        if isinstance(module, str):
            try:
                return self._cache["on_resolve_interface"][module]
            except KeyError:
                self._cache.setdefault("on_resolve_interface", {})
                v = (
                    module,
                    cast("type[Interface] | None", self.resolve_remotes(module)),
                )
                self._cache["on_resolve_interface"][module] = v
                return v

        return module, None

    def on_resolve_vendor(
        self, name: str, source: str | None, target: str
    ) -> bool | None:
        """Event triggered when vendor is resolved.

        # Arguments
        name: The name of the vendor
        source: The source configuration
        target: The target directory (may or may not exists yet)

        Return False to prevent the default automatic resolution
        """

    def __repr__(self) -> str:
        return f"Project({self.config.directory})"
