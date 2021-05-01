import os

from machinable import Project


def test_project():
    project = Project()
    assert project._directory == os.getcwd()
    project = Project("tests/project")
