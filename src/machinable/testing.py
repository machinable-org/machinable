from machinable import schema
from machinable.storage.storage import Storage


def storage_tests(storage: Storage) -> None:
    # execution
    execution = schema.Execution(engine=["example"])
    experiments = [
        schema.Experiment(interface=["a"]),
        schema.Experiment(interface=["b"]),
        schema.Experiment(interface=["c"]),
    ]
    project = schema.Project(directory=".")
    grouping = schema.Grouping(group="test/me", resolved_group="test/me")

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

    related = storage.retrieve_related("execution", experiments[0])
    assert related == execution
    inverse = storage.retrieve_related("experiments", related)
    assert all([experiments[i] == inverse[i] for i in range(len(experiments))])

    # records
    storage.create_record(schema.Record(data={"test": 1}), experiments[0])
