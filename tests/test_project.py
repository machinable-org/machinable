import os

import pytest
from machinable import Project, errors


def test_project():
    project = Project()
    assert project.__model__.directory == os.getcwd()
    project = Project("tests/samples/project")
    project.connect()
