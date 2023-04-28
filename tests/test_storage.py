import os

import pytest
from machinable import Component, Execution, Project, Storage, errors
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
        component = Component()
        component.save_data("test.txt", "deferral")
        component.save_file("test.json", "deferral")
        assert len(component._deferred_data) == 2
        execution = Execution().add(component)
        repository.commit(component, execution)

        assert os.path.isfile(component.local_directory("data/test.txt"))
        assert os.path.isfile(component.local_directory("test.json"))
        assert len(component._deferred_data) == 0


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
    storage = Storage.make(
        "machinable.storage.multiple",
        {
            "primary": [
                "machinable.storage.filesystem",
                {"directory": str(tmpdir / "0")},
            ],
            "secondary": [],
        },
    )
    storage = storage_tests(storage)

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
    storage = Storage.make(
        "machinable.storage.multiple",
        {
            "primary": [
                "machinable.storage.filesystem",
                {"directory": str(tmpdir / "c")},
            ],
            "secondary": [
                [
                    "machinable.storage.filesystem",
                    {"directory": str(tmpdir / "d")},
                ]
            ],
        },
    )
    storage_tests(Storage.from_json(storage.as_json()))
