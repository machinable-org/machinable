from machinable.project import Project
from machinable.registration import Registration


def test_project_registration():
    test_project = Project("./test_project")

    assert test_project.has_registration()
    assert isinstance(test_project.registration, Registration)
