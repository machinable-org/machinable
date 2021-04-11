from machinable.schema import ExecutionType, ExperimentType
from machinable.storage.filesystem_storage import FilesystemStorage


def test_filesystem_storage(tmpdir):
    storage = FilesystemStorage(str(tmpdir / "storage"))

    execution = ExecutionType()

    experiments = [ExperimentType(), ExperimentType(), ExperimentType()]
    storage.create_execution(
        execution,
        experiments=experiments,
    )

    recovered = storage.retrieve_experiment(experiments[0]._storage_id)
    assert recovered == experiments[0]

    related = storage.retrieve_related(experiments[0], "execution")
    assert related == execution

    inverse = storage.retrieve_related(related, "experiments")
    assert all([experiments[i] == inverse[i] for i in range(len(experiments))])
