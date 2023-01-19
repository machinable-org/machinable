import arrow
from machinable import schema
from machinable.storage.storage import Storage
from machinable.utils import random_str


def storage_tests(storage: Storage) -> None:
    # serialization should not affect any of the tests
    storage = storage.clone()

    # commit
    pre_execution = schema.Execution()
    experiments = [
        schema.Experiment(
            module="test.catch_me", predicate={"if": {"you": "can"}}
        ),
        schema.Experiment(
            module="test.catch_me", predicate={"if": {"you": "cannot"}}
        ),
        schema.Experiment(module="another"),
    ]
    project = schema.Project(directory=".", name="test")
    group = schema.Group(pattern="test/me", path="test/me")
    elements = [schema.Experiment(module="test.catch_me"), schema.Execution()]

    for experiment in experiments:
        storage.create_experiment(experiment, group, project, elements)

    storage.create_execution(execution=pre_execution, experiments=experiments)

    execution = schema.Execution()
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
        storage.retrieve_related("test/me", "group.experiments")[0].timestamp
        == experiments[0].timestamp
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
    assert (
        storage.retrieve_related(
            experiments[0]._storage_id, "experiment.project"
        ).name
        == project.name
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
    # search by predicate
    assert len(storage.find_experiment_by_predicate("non-existing")) == 0
    assert (
        len(storage.find_experiment_by_predicate(module="test.catch_me")) == 2
    )
    assert (
        storage.find_experiment_by_predicate(
            module="test.catch_me", predicate={"if": {"you": "can"}}
        )[0]
        == experiments[0]._storage_id
    )
    assert (
        storage.find_experiment_by_predicate(
            module="test.catch_me", predicate={"if": "can"}
        )
        == []
    )

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
