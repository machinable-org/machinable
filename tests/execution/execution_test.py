import os

from machinable import Component, Execution, Experiment, execute
from machinable.settings import get_settings


def test_execution_from_storage(tmp_path):
    e = Execution.from_storage(tmp_path / "storage/tttttt")
    e.filter(lambda i, component, _: component == "4NrOUdnAs6A5")
    e.submit()


def test_execution_setters(tmp_path):
    e = Execution.from_storage(tmp_path / "storage/tttttt")
    e.set_version("{ 'a': 1 }")
    e.set_checkpoint("/test")


def test_execution_continuation(tmp_path):
    experiment = Experiment().component("nodes.continuation")
    execution = Execution(
        experiment=experiment,
        storage=tmp_path / "storage/tttttt",
        project="./test_project",
    )
    execution.submit()
    assert execution.schedule._result[0] is None  # no exception occurred
    assert os.path.isdir(
        tmp_path / f"storage/tttttt/submissions/{execution.submission_id}"
    )
