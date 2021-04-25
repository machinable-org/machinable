from machinable.schema import ExecutionType, ExperimentType, RecordType
from machinable.storage.storage import Storage


def storage_tests(storage: Storage) -> None:
    # execution
    execution = ExecutionType()
    experiments = [ExperimentType(), ExperimentType(), ExperimentType()]

    storage.create_execution(
        execution,
        experiments=experiments,
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
    storage.create_record(RecordType(data={"test": 1}), experiments[0])
