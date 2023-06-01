import os

from machinable import Component, Project


def test_project():
    project = Project()
    assert project.config.directory == os.getcwd()
    project = Project("tests/samples/project")
    assert project.name() == "project"
    assert project.path().endswith("samples/project")
    project.__enter__()
    assert Project.get().name() == "project"
    assert Project.get().module == "_machinable.project"
    project.__exit__()
    # note that this may fail if other tests have errors
    # and failed to clean up the project
    assert Project.get().module == "machinable.project"


def test_project_events(tmp_storage):
    project = Project("tests/samples/project").__enter__()
    # global config
    assert Component.instance("dummy", {"a": "global_conf(2)"}).config.a == 2
    assert Component.instance("dummy", "~global_ver({'a': 3})").config.a == 3

    # module redirection
    assert Component.instance("@test").module == "basic"
    assert (
        Component.instance("@test").hello()
        == Component.singleton("@test").hello()
    )

    component = Component.instance("dummy")
    component.launch()
    assert component.host_info["dummy"] == "data"

    project.__exit__()
