import os

from machinable import Experiment, Project


def test_project():
    project = Project()
    assert project.__model__.directory == os.getcwd()
    project = Project("tests/samples/project", name="test")
    assert project.name() == "test"
    assert project.path().endswith("samples/project")
    project.connect()
    assert Project.get().name() == "test"
    assert Project.get().module == "_machinable.project"
    project.close()
    assert Project.get().module == "machinable.project"


def test_project_events(tmp_storage):
    project = Project("tests/samples/project").connect()
    # global config
    assert Experiment.instance("dummy", {"a": "global_conf(2)"}).config.a == 2
    assert Experiment.instance("dummy", "~global_ver({'a': 3})").config.a == 3

    # module redirection
    assert Experiment.instance("@test").module == "basic"
    assert (
        Experiment.instance("@test").hello()
        == Experiment.singleton("@test").hello()
    )

    experiment = Experiment.instance("dummy")
    experiment.execute()
    info = experiment.load_execution_data("host.json")
    assert info["dummy"] == "data"

    project.close()
