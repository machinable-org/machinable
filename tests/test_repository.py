import os

from machinable import Execution, Experiment, Project, Repository


def test_repository(tmpdir):
    Project("./tests/samples/project").connect()
    repository = Repository(
        "machinable.storage.filesystem_storage", {"directory": str(tmpdir)}
    )
    repository_b = Repository.filesystem(str(tmpdir))
    assert (
        repository.storage().config.directory
        == repository_b.storage().config.directory
    )

    # serialization
    restored = Repository.from_json(repository.as_json())
    assert restored.storage().config.directory == str(tmpdir)

    # deferred data
    experiment = Experiment("dummy")
    experiment.save_data("test.txt", "deferral")
    experiment.save_file("test.json", "deferral")
    assert len(experiment._deferred_data) == 2

    repository.commit(Execution().add(experiment))

    assert os.path.isfile(experiment.local_directory("data/test.txt"))
    assert os.path.isfile(experiment.local_directory("test.json"))
    assert len(experiment._deferred_data) == 0
