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
