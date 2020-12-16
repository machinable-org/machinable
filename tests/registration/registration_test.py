import os

from machinable import Component, Execution, Experiment
from machinable.project import Project
from machinable.registration import Registration


def test_project_registration():
    test_project = Project("./test_project")

    assert test_project.has_registration()
    assert isinstance(test_project.registration, Registration)


def test_registration_on_before_component_construction():
    class TestRegistration(Registration):
        def on_before_component_construction(self, component, flags):
            if component["name"] == "dryrun":
                os.environ["TEST3"] = flags.get("test", False)

    @Execution
    class TestComponent(Component):
        def on_create(self):
            assert os.environ["TEST1"] == "1"
            assert os.environ["TEST2"] == "world"
            assert os.environ["TEST3"] == "me"

    assert (
        TestComponent(
            Experiment().component(
                "dryrun",
                flags=dict(ENVIRON={"TEST1": "1", "TEST2": "world"}, test="me"),
            ),
            engine="native:None",
            project="./test_project",
        )
        .set_registration(TestRegistration())
        .submit()
        .failures
        == 0
    )
