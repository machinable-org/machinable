import pytest

from machinable import C, Experiment
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


def test_config_mixins():
    test_project = Project("./test_project")

    t = Experiment().component("mixexp", ("~test", dict(_mixins_=["version_mixin"])))
    e, m = to_config(test_project, t)
    assert "elephant" not in e
    assert e["mixed_in"] is True
    assert e["foo"] == 1

    t = Experiment().component(
        "mixexp", ("~test", dict(_mixins_=["^", "version_mixin"]))
    )
    e, m = to_config(test_project, t)
    assert "elephant" in e
    assert e["mixed_in"] is True
    assert e["foo"] == 1

    t = Experiment().component("thenode", ("~test", dict(_mixins_=["version_mixin"])))
    e, m = to_config(test_project, t)
    assert e["mixed_in"] is True
    assert e["foo"] == 1

    t = Experiment().component(
        "thenode", ("~test:nest", dict(_mixins_=["^", "version_mixin"]))
    )
    e, m = to_config(test_project, t)
    assert e["mixed_in"] is None
    assert e["foo"] == 1
    assert e["ba"] == 2

    t = Experiment().component(
        "thenode", ("~three:nested", dict(_mixins_=["version_mixin", "^"]))
    )
    e, m = to_config(test_project, t)
    assert e["alpha"] == 4
    assert e["added"] == "blocker"
    assert e["unaffected"] == "value"
    assert e["beta"] == "override"

    # override mixins in version
    t = Experiment().component(
        "thenode", ({"_mixins_": ["trait", "version_mixin"]}, "~three:nested")
    )
    e, m = to_config(test_project, t)
    assert e["alpha"] == 4
    assert e["added"] == "blocker"
    assert e["unaffected"] == "value"
    assert e["beta"] == "override"

    t = Experiment().component(
        "thenode",
        ({"_mixins_": [{"name": "version_mixin", "overrides": True}]}, "~three:nested"),
    )
    e, m = to_config(test_project, t)
    assert e["alpha"] == 4
    assert e["added"] == "blocker"
    assert e["unaffected"] == "value"
    assert e["beta"] == "override"

    t = Experiment().component(
        "thenode",
        (
            {
                "_mixins_": [
                    {"name": "trait", "overrides": False},
                    {"name": "mixin_module", "overrides": False},
                    "version_mixin",
                    "^",
                ]
            },
            "~three:nested",
        ),
    )
    e, m = to_config(test_project, t)
    assert e["key"]["very"] is None
    assert e["hello"] == "there"


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
    t = Experiment().components(("thenode", "~three:nested"))
    e, m = to_config(test_project, t)
    assert e["unaffected"] == "value"
    assert e["nested"] is None
    assert e["alpha"] == 4
    assert e["beta"] == "nested"
    assert "should_not_be" not in e

    t = Experiment().components(("thenode", ("~two", "~nested")))
    e, m = to_config(test_project, t)
    assert e["alpha"] == 2
    assert e["nested"] is True

    t = Experiment().components(("thenode", ("~three:nested:nestednested")))
    e, m = to_config(test_project, t)
    assert e["unaffected"] == "value"
    assert e["works"] is False
    assert e["alpha"] == 5
    assert e["beta"] == "overwritten"
    assert e["added"] == "value"

    # mixins
    t = Experiment().components(("thenode", "_trait_"), ("thechildren", "_extended_"))
    e, m = to_config(test_project, t)
    assert e["alpha"] == 0
    assert e["key"]["very"] == "powerful"
    assert m["alpha"] == 0
    assert m["key"]["mixing"] == "is"

    # ingores None
    t = Experiment().components(("thenode", (None, {"alpha": -1}, None)))
    e, m = to_config(test_project, t)
    assert e["alpha"] == -1


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
