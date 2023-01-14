import os

import commandlib
import pytest
from machinable import Execution, Experiment, Project, Storage, errors, schema
from machinable.element import Element


def test_experiment(tmp_storage, tmp_path):
    p = Project("./tests/samples/project").__enter__()
    experiment = Experiment.make("dummy")
    assert experiment.module == "dummy"
    assert isinstance(str(experiment), str)
    assert isinstance(repr(experiment), str)
    assert experiment.config.a == 1

    # version
    assert experiment.version() == []
    assert experiment.version("test") == ["test"]
    assert experiment.version() == ["test"]
    assert experiment.version("replace", overwrite=True) == ["replace"]
    experiment.version({"a": -1}, overwrite=True)
    assert experiment.config.a == -1
    experiment.version({"a": 1})
    assert experiment.config.a == 1

    experiment = Experiment.from_model(Experiment.model(experiment))
    serialized = experiment.serialize()
    assert serialized["config"]["a"] == 1

    # storage
    storage = Storage.make(
        "machinable.storage.filesystem",
        {"directory": str(tmp_path)},
    )

    execution = schema.Execution()
    model = storage.create_experiment(
        experiment=schema.Experiment(config={"test": True}),
        group=schema.Group(pattern="", path=""),
        project=schema.Project(directory=".", name="test"),
        elements=[],
    )

    experiment = Experiment.from_model(model)

    assert experiment.config.test is True
    assert experiment.experiment_id == model.experiment_id
    assert experiment.local_directory().startswith(str(tmp_path))
    assert os.path.isdir(
        experiment.local_directory("non-existing/dir", create=True)
    )

    # records
    assert len(experiment.records()) == 0
    record = experiment.record("testing")
    record["test"] = 1
    record.save()
    assert len(experiment.records("testing")) == 1

    # output
    assert experiment.output() is None
    experiment.save_file("output.log", "test")
    assert experiment.output() == "test"

    assert experiment.output(incremental=True) == "test"
    experiment.save_file("output.log", "testt")
    assert experiment.output(incremental=True) == "t"
    assert experiment.output(incremental=True) == ""
    experiment.save_file("output.log", "testt more")
    assert experiment.output(incremental=True) == " more"

    experiment.mark_started()
    assert experiment.is_started()
    experiment.update_heartbeat()
    assert experiment.is_active()
    experiment.update_heartbeat(mark_finished=True)
    assert experiment.is_finished()
    with pytest.raises(errors.ConfigurationError):
        experiment._assert_editable()
    assert not experiment.is_incomplete()

    # write protection
    assert experiment.version() == []
    with pytest.raises(errors.ConfigurationError):
        experiment.version(["modify"])

    p.__exit__()


def test_experiment_launch(tmp_storage):
    experiment = Experiment()
    assert not experiment.is_mounted()
    experiment.launch()
    assert experiment.is_mounted()
    assert experiment.is_finished()

    # cache and context
    assert experiment.launch == experiment.launch

    a = Execution()
    b = Execution()
    with a:
        # ignores context, since already mounted
        assert experiment.launch != a

    experiment = Experiment()
    with a:
        assert experiment.launch == a
    with b:
        assert experiment.launch == b

    # no double execution
    experiment = Experiment()

    with Execution() as execution:
        experiment.launch()
        experiment.launch()
        experiment.launch()
    assert len(execution.experiments) == 1


def test_experiment_relations(tmp_storage):
    with Project("./tests/samples/project", name="test-project"):

        experiment = Experiment.instance("basic").group_as("test/group")
        execution = Execution().add(experiment)
        execution.dispatch()

        assert experiment.project.name() == "test-project"
        assert experiment.launch.timestamp == execution.timestamp
        assert experiment.executions[0].timestamp == execution.timestamp
        assert len(experiment.elements) == 0

        with pytest.raises(errors.ConfigurationError):
            experiment.version("attempt_overwrite")

        derived = Experiment(derived_from=experiment)
        assert derived.ancestor is experiment
        derived_execution = Execution().add(derived).dispatch()

        # invalidate cache and reconstruct
        experiment.__related__ = {}
        execution.__related__ = {}
        derived.__related__ = {}
        derived_execution.__related__ = {}

        assert derived.ancestor.experiment_id == experiment.experiment_id
        assert derived.ancestor.hello() == "there"
        assert experiment.derived[0].experiment_id == derived.experiment_id

        derived = Experiment(derived_from=experiment)
        Execution().add(derived).dispatch()
        assert len(experiment.derived) == 2

        assert experiment.derive().experiment_id != experiment.experiment_id
        derived = experiment.derive(version=experiment.config)
        Execution().add(derived).dispatch()


class DataElement(Element):
    class Config:
        dataset: str = "mnist"

    def hello(self):
        return "element"


def test_experiment_elements(tmp_storage):
    with Project("./tests/samples/project"):
        assert Experiment.singleton("dummy") is not None
        experiment = Experiment.instance("dummy")
        dataset = DataElement({"dataset": "cifar"})
        experiment.use(dataset)
        assert experiment.elements[0].config.dataset == "cifar"
        experiment.launch()
        experiment.__related__ = {}
        assert experiment.elements[0].config.dataset == "cifar"
        assert experiment.elements[0].hello() == "element"


def test_experiment_interface(tmp_path):
    with Project("tests/samples/project"):
        # test dispatch lifecycle
        experiment = Experiment.make("interfaces.events_check")

        experiment.__model__._storage_instance = Storage.make(
            "machinable.storage.filesystem",
            {"directory": str(tmp_path)},
        )
        experiment.__model__._storage_id = str(tmp_path)

        experiment.dispatch()
        assert len(experiment.load_data("events.json")) == 6


class ExportExperiment(Experiment):
    def on_execute(self):
        print("Hello world")
        self.save_data("test_run.json", {"success": True})


def test_experiment_export(tmp_storage):
    experiment = ExportExperiment()
    script = experiment.to_dispatch_code()

    with pytest.raises(AttributeError):
        exec(script)

    Execution().add(experiment).commit()
    assert not experiment.is_started()

    exec(script)

    assert experiment.is_finished()
    assert experiment.load_data("test_run.json")["success"]

    # inline
    experiment = ExportExperiment()
    Execution().add(experiment).commit()
    script = experiment.to_dispatch_code(inline=True)
    script_filepath = experiment.save_file("run.sh", script)

    print(commandlib.Command("bash")(script_filepath).output())
    assert experiment.is_finished()
    assert experiment.load_data("test_run.json")["success"]
