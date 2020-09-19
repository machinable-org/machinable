import machinable as ml
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
    node, components, resources = list(parse_experiment(t))[0]
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
    node, components, resources = list(parse_experiment(t))[0]
    conf = ConfigInterface(config, t.specification["version"])
    node_config = conf.get(node)["args"]
    assert node_config["version"] == 0
    worker_component_config = conf.get(components[0])["args"]
    assert worker_component_config["version"] == 1


def test_computable_resources():
    test_project = Project("./test_project")
    t = ml.Experiment().component(
        "thenode",
        resources=lambda engine, component, components: {
            "test": component.config["alpha"]
        },
    )
    # only compute resources for engines that support a resource specification
    e = ml.Execution(t, project=test_project, engine="native").set_schedule()
    assert e.schedule._elements[0][3] is None
    e = e.set_engine("slurm").set_schedule()
    assert e.schedule._elements[0][3]["--test"] == 0
    # default resources
    t = ml.Experiment().component("nodes.observations")
    e = ml.Execution(t, project=test_project, engine="slurm").set_schedule()
    assert e.schedule._elements[0][3]["used_engine"] == "Slurm"


def test_default_component():
    test_project = Project("./test_project")
    t = ml.Experiment().component("uses_default_module")
    ml.execute(t, project=test_project)
