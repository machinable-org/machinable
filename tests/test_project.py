import os

from machinable import Project


def test_project():
    project = Project()
    assert project.__model__.directory == os.getcwd()
    project = Project("tests/samples/project", name="test")
    assert project.name() == "test"
    assert project.path().endswith("samples/project")
    project.connect()
    assert Project.get().name() == "test"
    project.close()
