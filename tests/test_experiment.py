from os import error

import pytest
from machinable import Experiment, Project, Storage, errors, schema


def test_experiment(tmp_path):
    Project("./tests/samples/project").connect()
    experiment = Experiment("dummy")
    assert isinstance(str(experiment), str)
    assert isinstance(repr(experiment), str)
    assert experiment.config.a == 1

    # uses
    experiment.use("test", "dummy")
    experiment.use(test="dummy")
    assert len(experiment.components()) == 1

    experiment = Experiment.from_model(Experiment.model(experiment))
    serialized = experiment.serialize()
    assert serialized["config"]["a"] == 1

    with pytest.raises(errors.StorageError):
        experiment._assert_mounted()

    # storage
    storage = Storage.make(
        "machinable.storage.filesystem_storage",
        {"directory": str(tmp_path)},
    )

    model = storage.create_experiment(
        experiment=schema.Experiment(interface=["t"], config={"test": True}),
        execution=schema.Execution(engine=["t"]),
        grouping=schema.Grouping(group="", resolved_group=""),
        project=schema.Project(directory="."),
    )

    experiment = Experiment.from_model(model)

    experiment._assert_writable()

    assert experiment.config.test is True
    assert experiment.experiment_id == model.experiment_id
    assert experiment.local_directory().startswith(str(tmp_path))
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

    assert experiment.output() is None
    experiment.save_file("output.log", "test")
    assert experiment.output() == "test"

    experiment.mark_started()
    assert experiment.is_started()
    experiment.update_heartbeat()
    assert experiment.is_active()
    experiment.update_heartbeat(mark_finished=True)
    assert experiment.is_finished()
    with pytest.raises(errors.StorageError):
        experiment._assert_writable()
    assert not experiment.is_incomplete()
