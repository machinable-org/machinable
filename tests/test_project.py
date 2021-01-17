import os

from machinable import Project


def test_project():
    project = Project()
    assert project.directory == os.getcwd()
    project = Project("tests/project")
