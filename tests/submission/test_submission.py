import math
import os

from machinable import Submission

STORAGE_DIRECTORY = "./_test_data/storage"


def get_path(path=""):
    return os.path.join(STORAGE_DIRECTORY, path)


def test_submission():
    o = Submission.find(get_path("tttttt/"))
    assert o.submission_id == "tttttt"
    assert o.experiment_name is None
    assert o.project_name == "test_project"
    assert o.url == "osfs://" + get_path("tttttt/")
    assert o.components.first().config.test
    assert o.host.test_info == "test_info"
    assert o.host.test_info_static == "static_test_info"
    assert o.host.custom_info is True
    assert o.host.host_info_return == "test"
    assert len(o.host) == 12
    assert len(o.components) == 4
    assert o.engine.type == "native"

    submissions = o.submissions
    assert len(submissions) >= 2
    assert len(submissions.filter(lambda x: x.submission_id == "SUBEXP")) == 1
    assert all(submissions.transform(lambda x: x.ancestor.submission_id == "tttttt"))
    assert o.ancestor is None


def test_submission_component():
    comp = Submission.find(get_path("tttttt"), 0)
    assert comp.submission.submission_id == "tttttt"
    assert comp.submission.code_version.project.path.endswith("machinable.git")
    assert comp.flags.NAME == "nodes.observations"
    assert comp.config.to_test == "observations"
    assert len(comp.components) == 0
    assert comp.data("data.json")["observation_id"] > 0
    assert len(comp.host) == 12
    assert len(comp.get_records()) == 2
    records = comp.records
    custom = comp.get_records("validation")
    assert custom.sum("iteration") == 15
    assert records.as_dataframe().size > 0
    assert len(comp.file("output.log")) > 0
    assert len(comp.file("log.txt")) > 0

    comp = Submission.find(get_path("subdirectory/TTTTTT"))
    assert comp.components.first().submission.submission_id == "TTTTTT"


def test_submission_component_records():
    records = Submission.find(get_path("tttttt"), 0).records
    record = records.first()

    assert isinstance(record["_timestamp"], (float, int))
    assert isinstance(record["number"], int)
    assert record["constant"] == 42
    assert isinstance(record["float"], float)
    assert isinstance(record["string"], str)
    assert record["none"] is None
    assert math.isnan(record["nan"])
    assert isinstance(record["custom"], dict)
    assert isinstance(record["date"], str)
