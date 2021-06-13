import arrow
from machinable import schema
from machinable.storage.storage import Storage


def storage_tests(storage: Storage) -> None:
    execution = schema.Execution(engine=["example"])
    experiments = [
        schema.Experiment(interface=["a"]),
        schema.Experiment(interface=["b"]),
        schema.Experiment(interface=["c"]),
    ]
    project = schema.Project(directory=".")
    grouping = schema.Grouping(group="test/me", resolved_group="test/me")

    # create execution and experiments
    storage.create_execution(
        project=project,
        execution=execution,
        experiments=experiments,
        grouping=grouping,
    )

    execution_ = storage.retrieve_execution(execution._storage_id)
    assert execution_ == execution

    for experiment in experiments:
        experiment_ = storage.retrieve_experiment(experiment._storage_id)
        assert experiment_ == experiment

    # relationships
    related = storage.retrieve_related(
        experiments[0]._storage_id, "experiment.execution"
    )
    assert related == execution
    inverse = storage.retrieve_related(
        related._storage_id, "execution.experiments"
    )
    assert all([experiments[i] == inverse[i] for i in range(len(experiments))])

    # status managment
    now = arrow.now()
    assert storage.retrieve_status(experiments[0], "started") is None
    storage.mark_started(experiments[0], now)
    assert storage.retrieve_status(experiments[0], "started") == now
    assert storage.retrieve_status(experiments[0], "heartbeat") is None
    storage.update_heartbeat(experiments[0], now)
    assert storage.retrieve_status(experiments[0], "heartbeat") == now
    assert storage.retrieve_status(experiments[0], "finished") is None
    storage.update_heartbeat(experiments[0], now, mark_finished=True)
    assert storage.retrieve_status(experiments[0], "finished") == now

    # local directory
    assert storage.local_directory(experiments[0]).startswith("/")

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
