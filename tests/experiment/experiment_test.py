import os

import machinable as ml
from machinable import Engine
from machinable.config.interface import ConfigInterface
from machinable.experiment.parser import parse_experiment
from machinable.project import Project


def test_experiment_serialization():
    t = (
        ml.Experiment()
        .components(
            "test",
            [
                ("test", [{"a": i} for i in range(3)]),
                ("test", [{"a": i} for i in range(3)]),
            ],
        )
        .repeat(2)
    )
    json = t.to_json()
    t_ = ml.Experiment.from_json(json)
    assert str(t.specification) == str(t_.specification)


def test_experiment_config():
    test_project = Project("./test_project")
    config = test_project.parse_config()

    t = ml.Experiment().components(
        ("nodes.observations", {"attr": "node"}), ("workers.interactive", {"id": 2})
    )
    node, components, resources = list(parse_experiment(t.specification))[0]
    conf = ConfigInterface(config, t.specification["version"])
    node_config = conf.get(node)["args"]
    worker_component_config = conf.get(components[0])["args"]

    assert node_config["attr"] == "node"
    assert worker_component_config["attr"] == "worker"

    t = (
        ml.Experiment()
        .components(
            ("nodes.observations", {"attr": "node"}), ("workers.interactive", {"id": 2})
        )
        .version("~test")
    )
    node, components, resources = list(parse_experiment(t.specification))[0]
    conf = ConfigInterface(config, t.specification["version"])
    node_config = conf.get(node)["args"]
    assert node_config["version"] == 0
    worker_component_config = conf.get(components[0])["args"]
    assert worker_component_config["version"] == 1


def test_experiment_directory():
    e = ml.Execution(
        "@/test_project/experiments/auto_directory", project="./test_project",
    )
    e.set_schedule()
    assert e.storage["directory"] == "test_project"
