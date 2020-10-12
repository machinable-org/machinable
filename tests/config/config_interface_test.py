import pytest

from machinable import Experiment
from machinable.config.interface import ConfigInterface
from machinable.experiment.parser import parse_experiment
from machinable.project import Project


def test_config_mixin_handler():
    test_project = Project("test_project")

    config = ConfigInterface(test_project.parse_config())

    t = config.get_component("mixexp", version=None, flags=None)["args"]

    # preserved the config
    assert t["hello"] == "there"

    # extended key update
    assert t["key"]["extension"] == "enabled"

    # mixin
    assert t["key"]["overwritten"] == "cool"

    # mixin inheritance
    assert t["key"]["mixing"] == "is"

    # mixin import
    assert t["imported"] == "hello"


def to_config(project, schedule):
    config = ConfigInterface(project.parse_config(), schedule.specification["version"])
    execution_plan = list(parse_experiment(schedule))
    for job_id, (node, components, resources) in enumerate(execution_plan):
        node_config = config.get(node)
        components_config = config.get(components[0])

        if components_config is None:
            return node_config["args"], None

        return node_config["args"], components_config["args"]


def test_config_versioning():
    test_project = Project("./test_project")

    t = Experiment().components(("thenode", {"alpha": -1}))
    e, m = to_config(test_project, t)
    assert e["alpha"] == -1

    t = Experiment().components(("thenode", ({"a": 1}, {"a": 2, "b": 3})))
    e, m = to_config(test_project, t)
    assert e["a"] == 2
    assert e["b"] == 3

    with pytest.raises(KeyError):
        t = Experiment().components(("thenode", "~non-existent"))
        e, m = to_config(test_project, t)

    t = Experiment().components(("thenode", "~one"), ("thechildren", "~two"))
    e, m = to_config(test_project, t)
    assert e["alpha"] == 1
    assert m["alpha"] == 2

    t = Experiment().components(("thenode", ("~three", "~one", "~two")))
    e, m = to_config(test_project, t)
    assert e["alpha"] == 2
    assert e["beta"]["test"]

    # nested
    t = Experiment().components(("thenode", ("~three", "~nested")))
    e, m = to_config(test_project, t)
    assert e["works"]
    assert e["nested"]
    assert e["alpha"] == 4
    assert e["beta"] == "nested"

    t = Experiment().components(("thenode", ("~two", "~nested")))
    e, m = to_config(test_project, t)
    assert e["alpha"] == 2
    assert e["nested"]

    t = Experiment().components(("thenode", ("~three", "~nested", "~nestednested")))
    e, m = to_config(test_project, t)
    assert e["works"]
    assert e["alpha"] == 5
    assert e["q"] == -1
    assert e["beta"] == "overwritten"
    assert e["added"] == "value"

    # mixins
    t = Experiment().components(("thenode", "_trait_"), ("thechildren", "_extended_"))
    e, m = to_config(test_project, t)
    assert e["alpha"] == 0
    assert e["key"]["very"] == "powerful"
    assert m["alpha"] == 0
    assert m["key"]["mixing"] == "is"

    t = Experiment().components(("thenode", "./test_project/version_override.json"))
    e, m = to_config(test_project, t)
    assert e["alpha"] == 10


def test_computed_versioning():
    test_project = Project("./test_project")

    t = Experiment().components(
        ("thenode", {"alpha": lambda: 3.14, "b": lambda config: config.alpha})
    )
    e, m = to_config(test_project, t)
    assert e["alpha"] == 3.14
    assert e["b"] == 0


def test_unflatten_arguments():
    test_project = Project("./test_project")

    # machinable.yaml
    t = Experiment().component("flattened_notation")
    c, _ = to_config(test_project, t)
    assert "flat" in c
    assert c["flat"]["nested"] is True
    assert c["inherited"]["flat"] == "value"
    assert c["flat"]["can"]["be"]["useful"]
    assert c["flat"]["can_also_save_space"] == " "

    # experiment
    t = Experiment().component(
        "flattened_notation",
        {
            "flat.merge": "merged",
            "more.nested.values": "here",
            "flat.can_also_save_space": "overwritten",
        },
    )
    c, _ = to_config(test_project, t)
    assert "flat" in c
    assert c["flat"]["can"]["be"]["useful"]
    assert c["flat"]["can_also_save_space"] == "overwritten"
    assert c["flat"]["merge"] == "merged"
    assert c["more"]["nested"]["values"] == "here"

    # versions
    t = Experiment().component("flattened_notation", "~flat_version")
    c, _ = to_config(test_project, t)
    assert "flat" in c
    assert c["flat"]["can"]["be"]["useful"]
    assert c["flat"]["nested"] is False
    assert c["flat"]["version"] == 2
