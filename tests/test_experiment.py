import pytest
from machinable import Experiment, Project, Storage, schema


def test_experiment():
    Project("./tests/samples/project").connect()
    experiment = Experiment("dummy")
    assert isinstance(str(experiment), str)
    assert isinstance(repr(experiment), str)
    assert experiment.config.a == 1

    # uses
    experiment.use("test", "dummy")
    experiment.use(test="dummy")


def test_experiment_storage(tmp_path):
    return
    from machinable.storage.filesystem_storage import FilesystemStorage

    storage: FilesystemStorage = Storage.make(
        "machinable.storage.filesystem_storage",
        {"directory": str(tmp_path / "storage")},
    )

    model = storage.create_experiment(
        experiment=schema.Experiment(interface=["t"], config={"test": True}),
        execution=schema.Execution(engine=["t"]),
        grouping=schema.Grouping(group="", resolved_group=""),
    )

    experiment = Experiment.from_model(model)

    assert experiment.config.test is True
    assert experiment.experiment_id == model.experiment_id
