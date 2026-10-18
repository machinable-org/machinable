import os
import shutil

import pytest

from machinable import Execution, Interface, Project
from machinable.interface import reset_connections


def test_project():
    project = Project()
    assert project.config.directory == os.getcwd()
    project = Project("tests/samples/project")
    assert project.name() == "project"
    assert project.path().replace(os.sep, "/").endswith("samples/project")
    project.__enter__()
    assert Project.get().name() == "project"
    assert Project.get().module == "interface.project"
    project.__exit__()
    reset_connections()
    # note that this may fail if other tests have errors
    # and failed to clean up the project
    assert Project.get().module == "machinable.project"


def test_project_events(tmp_storage):
    project = Project("tests/samples/project").__enter__()
    # global config
    assert Execution.instance("dummy", {"a": "global_conf(2)"}).config.a == 2
    assert Execution.instance("dummy", "~global_ver({'a': 3})").config.a == 3

    # module redirection
    assert Interface.instance("@test").module == "basic"
    assert Interface.instance("@test").hello() == Interface.singleton("@test").hello()

    component = Execution.instance("dummy")
    component.launch()

    # remotes
    shutil.rmtree("tests/samples/project/interface/remotes", ignore_errors=True)
    Execution.instance("!hello")()
    Execution.instance("!hello-link")()
    assert os.path.exists("tests/samples/project/interface/remotes")
    with pytest.raises(ValueError):
        Execution.instance("!invalid")
    shutil.rmtree("tests/samples/project/interface/remotes", ignore_errors=True)
    Execution.instance("!multi")()
    assert os.path.isfile("tests/samples/project/interface/remotes/!multi.py")
    assert os.path.isfile("tests/samples/project/interface/remotes/!hello-link.py")
    shutil.rmtree("tests/samples/project/interface/remotes", ignore_errors=True)
    Execution.instance("!multichain")()
    assert os.path.isfile("tests/samples/project/interface/remotes/!multi.py")
    assert os.path.isfile("tests/samples/project/interface/remotes/!hello-link.py")
    with pytest.raises(ValueError):
        Execution.instance("!multi-invalid")

    # extension
    assert Execution.instance("dummy_version_extend").config.a == 100

    project.__exit__()


def test_fetch_remote_without_import(tmp_storage):
    import sys

    from machinable.cli import main

    remotes_dir = "tests/samples/project/interface/remotes"
    shutil.rmtree(remotes_dir, ignore_errors=True)
    project = Project("./tests/samples/project").__enter__()
    provider = project.provider()

    # fetch-only: files land on disk (dependencies included), nothing imports
    before = set(sys.modules)
    filename = provider.fetch_remote("!multi")
    assert filename is not None and os.path.isfile(filename)
    assert os.path.isfile(os.path.join(remotes_dir, "!hello-link.py"))
    assert set(sys.modules) == before
    assert provider.fetch_remote("nonexistent") is None

    project.__exit__()
    shutil.rmtree(remotes_dir, ignore_errors=True)

    # the CLI wrapper: fetch all declared remotes without importing
    assert main(["fetch", "!hello", "--project", "tests/samples/project"]) == 0
    assert os.path.isfile(os.path.join(remotes_dir, "!hello.py"))
    assert main(["fetch", "nonexistent", "--project", "tests/samples/project"]) == 1
    shutil.rmtree(remotes_dir, ignore_errors=True)


_TARGET = (
    "from pydantic import BaseModel\n"
    "\n"
    "from machinable import Interface\n"
    "\n"
    "\n"
    "class Target(Interface):\n"
    "    class Config(BaseModel):\n"
    "        a: int = 1\n"
)

_PROVIDER = (
    "from pydantic import BaseModel\n"
    "\n"
    "from machinable import Project\n"
    "\n"
    "\n"
    "class Provider(Project):\n"
    "    class Config(BaseModel):\n"
    "        directory: str | None = None\n"
    "        cluster: str = 'the-lab'\n"
    "\n"
    "    def on_resolve_remotes(self):\n"
    "        return {'tool': 'file+/dev/null'}\n"
)


def _study(base, provider: bool):
    """A project named my-study under ``base``, with or without a provider."""
    directory = base / "my-study"
    (directory / "interface").mkdir(parents=True)
    (directory / "target.py").write_text(_TARGET)
    if provider:
        (directory / "interface" / "project.py").write_text(_PROVIDER)
    return directory


def _record_path(tmp_path, directory, project_cls=Project):
    from machinable import Index, Storage, get

    storage = tmp_path / f"storage-{directory.parent.name}"
    with (
        project_cls(str(directory)) as project,
        Storage(str(storage)),
        Index({"database": str(tmp_path / f"{directory.parent.name}.sqlite")}),
    ):
        target = get("target", {"a": 2}).materialize()
        root = project.ensure_project_root()
        local = os.path.relpath(target.local_directory(), storage)
        remotes = project.provider().on_resolve_remotes()
        return root.record_id, root.identity_key, local.replace(os.sep, "/"), remotes


def test_root_identity_ignores_the_provider(tmp_path):
    """Adding a provider (or connecting a subclass) never moves a record."""

    class Custom(Project):
        class Config(Project.Config):
            cluster: str = "elsewhere"

        def on_resolve_remotes(self):
            return {"custom": "file+/dev/null"}

    without = _record_path(tmp_path, _study(tmp_path / "without", False))
    with_provider = _record_path(tmp_path, _study(tmp_path / "with", True))
    subclass = _record_path(tmp_path, _study(tmp_path / "subclass", False), Custom)

    # the provider still provides: only identity ignores it
    assert without[3] == {}
    assert with_provider[3] == {"tool": "file+/dev/null"}
    assert subclass[3] == {"custom": "file+/dev/null"}
    # one root id, one root identity, one record path for all three
    assert without[:3] == with_provider[:3] == subclass[:3]
    root_id, identity_key, local = without[:3]
    assert local.split("/")[0] == identity_key
    assert root_id == Project(str(tmp_path / "with" / "my-study")).compute_record_id()


def test_root_identity_is_the_base_project(tmp_path):
    from machinable.config import canonical_identity_key

    directory = _study(tmp_path, True)
    project = Project(str(directory))
    assert project.module == "interface.project"
    assert project.catalog_identity_key() == canonical_identity_key(
        "machinable.project", {}, {}
    )
