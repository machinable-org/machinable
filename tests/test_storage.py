import os

import pytest
from machinable import Execution, Experiment, Project, Storage, errors
from machinable.testing import storage_tests


def test_storage_interface(tmpdir):
    with Project("./tests/samples/project"):
        repository = Storage.make(
            "machinable.storage.filesystem", {"directory": str(tmpdir)}
        )
        repository_b = Storage.make(
            "machinable.storage.filesystem", {"directory": str(tmpdir)}
        )
        assert repository.config.directory == repository_b.config.directory

        # serialization
        restored = Storage.from_json(repository.as_json())
        assert restored.__module__ == repository.__module__
        assert restored.config.directory == str(tmpdir)

        # deferred data
        experiment = Experiment()
        experiment.save_data("test.txt", "deferral")
        experiment.save_file("test.json", "deferral")
        assert len(experiment._deferred_data) == 2
        execution = Execution().add(experiment)
        repository.commit(experiment, execution)

        assert os.path.isfile(experiment.local_directory("data/test.txt"))
        assert os.path.isfile(experiment.local_directory("test.json"))
        assert len(experiment._deferred_data) == 0


def test_storage(tmpdir):
    assert Storage.make(
        "machinable.storage.filesystem", {"directory": str(tmpdir)}
    ).config.directory == str(tmpdir)


def test_filesystem_storage(tmpdir):
    storage = Storage.make(
        "machinable.storage.filesystem",
        {"directory": str(tmpdir / "storage")},
    )
    storage_tests(storage)


def test_multiple_storage(tmpdir):
    # validation
    with pytest.raises(errors.ConfigurationError):
        Storage.make(
            "machinable.storage.multiple", {"primary": [], "secondary": []}
        ).config

    # tests
    storage = Storage.make(
        "machinable.storage.multiple",
        {
            "primary": [
                "machinable.storage.filesystem",
                {"directory": str(tmpdir / "a")},
            ],
            "secondary": [
                [
                    "machinable.storage.filesystem",
                    {"directory": str(tmpdir / "b")},
                ]
            ],
        },
    )

    storage_tests(storage)

    # serialization
    storage_tests(Storage.from_json(storage.as_json()))
