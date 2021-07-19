from machinable import Repository


def test_repository(tmpdir):
    repository = Repository(
        "machinable.storage.filesystem_storage", {"directory": str(tmpdir)}
    )
    repository_b = Repository.filesystem(str(tmpdir))
    assert (
        repository.storage().config.directory
        == repository_b.storage().config.directory
    )
