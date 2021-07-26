import arrow
from machinable import schema
from machinable.storage.storage import Storage
from machinable.utils import random_str


def storage_tests(storage: Storage) -> None:
    pre_execution = schema.Execution(engine=["example"])
    experiments = [
        schema.Experiment(interface=["a"]),
        schema.Experiment(interface=["b"]),
        schema.Experiment(interface=["c"]),
    ]
    project = schema.Project(directory=".")
    group = schema.Group(pattern="test/me", path="test/me")

    for experiment in experiments:
        storage.create_experiment(experiment, group, project)

    storage.create_execution(execution=pre_execution, experiments=experiments)

    execution = schema.Execution(engine=["example"])
    storage.create_execution(execution=execution, experiments=experiments)

    execution_ = storage.retrieve_execution(execution._storage_id)
    assert int(execution_.timestamp) == int(execution.timestamp)

    for experiment in experiments:
        experiment_ = storage.retrieve_experiment(experiment._storage_id)
        assert experiment_.experiment_id == experiment.experiment_id

    # relationships
    related = storage.retrieve_related(
        experiments[0]._storage_id, "experiment.execution"
    )
    assert int(related.timestamp) == int(execution.timestamp)
    inverse = storage.retrieve_related(
        related._storage_id, "execution.experiments"
    )
    assert all(
        [
            experiments[i].experiment_id == inverse[i].experiment_id
            for i in range(len(experiments))
        ]
    )
    assert (
        storage.retrieve_related(
            experiment._storage_id, "experiment.group"
        ).path
        == "test/me"
    )
    assert (
        storage.retrieve_related("test/me", "group.experiments")[0].nickname
        == experiments[0].nickname
    )
    assert (
        storage.retrieve_related(
            experiments[0]._storage_id, "experiment.derived"
        )
        == []
    )
    assert (
        storage.retrieve_related(
            experiments[0]._storage_id, "experiment.ancestor"
        )
        is None
    )

    # search
    assert (
        storage.find_experiment(experiments[0].experiment_id)
        == experiments[0]._storage_id
    )
    assert (
        storage.find_experiment(
            experiments[0].experiment_id, experiments[0].timestamp
        )
        == experiments[0]._storage_id
    )
    assert storage.find_experiment("not-existing") is None

    # status managment
    now = arrow.now()
    assert storage.retrieve_status(experiments[0], "started") is None
    storage.mark_started(experiments[0], now)
    assert storage.retrieve_status(experiments[0], "started") == now
    # starting event can occur multiple times
    old_now = now
    now = arrow.now()
    storage.mark_started(experiments[0], now)
    now = arrow.now()
    storage.mark_started(experiments[0], now)
    assert storage.retrieve_status(experiments[0], "started") != old_now
    assert storage.retrieve_status(experiments[0], "started") == now

    assert storage.retrieve_status(experiments[0], "heartbeat") is None
    storage.update_heartbeat(experiments[0], now)
    assert storage.retrieve_status(experiments[0], "heartbeat") == now

    assert storage.retrieve_status(experiments[0], "finished") is None
    storage.update_heartbeat(experiments[0], now, mark_finished=True)
    assert storage.retrieve_status(experiments[0], "finished") == now

    # local directory
    assert storage.local_directory(experiments[0]).startswith("/")

    # output
    assert storage.retrieve_output(experiments[0]) is None

    # files
    assert storage.retrieve_file(experiments[0], "non-existing") is None
    storage.create_file(experiments[0], "payload.json", {"test": True})
    assert storage.retrieve_file(experiments[0], "payload.json") == {
        "test": True
    }

    # records
    storage.create_record(experiments[0], {"test": 1}, timestamp=now)
    storage.create_record(experiments[0], {"test": 2})
    records = storage.retrieve_records(experiments[0])
    assert len(records) == 2
    assert records[0]["test"] == 1
    assert records[0]["__timestamp"] == str(now)
    assert records[1]["test"] == 2
