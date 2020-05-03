from machinable.project import Project
from machinable.project.manager import fetch_imports


def test_fetch_imports():
    project = Project("./test_project")
    assert fetch_imports(project) == ["fooba"]
