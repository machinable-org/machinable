import os

from machinable import Project


def test_project():
    project = Project()
    assert project.__model__.directory == os.getcwd()
    project = Project("tests/project")
