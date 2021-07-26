import os

import pytest
from machinable import (
    Execution,
    Experiment,
    Project,
    Repository,
    Storage,
    errors,
    schema,
)


def test_experiment(tmp_path):
    Project("./tests/samples/project").connect()
    experiment = Experiment("dummy")
    assert isinstance(str(experiment), str)
    assert isinstance(repr(experiment), str)
    assert experiment.config.a == 1

    # uses
    experiment.use("test", "dummy")
    assert len(experiment.__model__.uses) == 1
    assert experiment.version() == []
    assert experiment.version("test") == ["test"]
    assert experiment.version() == ["test"]
    assert experiment.version("replace", overwrite=True) == ["replace"]

    experiment = Experiment.from_model(Experiment.model(experiment))
    serialized = experiment.serialize()
    assert serialized["config"]["a"] == 1

    # storage
    storage = Storage.make(
        "machinable.storage.filesystem_storage",
        {"directory": str(tmp_path)},
    )

    execution = schema.Execution(engine=["t"])
    model = storage.create_experiment(
        experiment=schema.Experiment(interface=["t"], config={"test": True}),
        group=schema.Group(pattern="", path=""),
        project=schema.Project(directory="."),
    )

    experiment = Experiment.from_model(model)

    assert experiment.config.test is True
    assert experiment.experiment_id == model.experiment_id
    assert experiment.local_directory().startswith(str(tmp_path))
    assert os.path.isdir(
        experiment.local_directory("non-existing/dir", create=True)
    )
    assert len(experiment.uses) == 0
    # records
    assert len(experiment.records()) == 0
    record = experiment.record("testing")
    record["test"] = 1
    record.save()
    assert len(experiment.records("testing")) == 1

    experiment.save_file("test.txt", "hello")
    assert experiment.load_file("test.txt") == "hello"
    experiment.save_data("floaty", 1.0)
    assert experiment.load_data("floaty") == "1.0"

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


def test_experiment_relations(tmp_path):
    Repository(
        "machinable.storage.filesystem_storage", {"directory": str(tmp_path)}
    ).connect()
    Project("./tests/samples/project").connect()

    experiment = Experiment("basic", group="test/group")
    execution = Execution().add(experiment)
    execution.dispatch()

    with pytest.raises(errors.ConfigurationError):
        experiment.version("attempt_overwrite")

    derived = Experiment("basic", derived_from=experiment)
    assert derived.ancestor is experiment
    derived_execution = Execution().add(derived).dispatch()

    # invalidate cache and reconstruct
    experiment.__related__ = {}
    execution.__related__ = {}
    derived.__related__ = {}
    derived_execution.__related__ = {}

    assert derived.ancestor.experiment_id == experiment.experiment_id
    assert experiment.derived[0].experiment_id == derived.experiment_id

    derived = Experiment("basic", derived_from=experiment)
    Execution().add(derived).dispatch()
    assert len(experiment.derived) == 2

    assert experiment.derive().experiment_id != experiment.experiment_id
    assert experiment.derive("other").__model__.interface == ["other"]

    derived = experiment.derive(version=experiment.config)
    Execution().add(derived).dispatch()
