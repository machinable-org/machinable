import os

import pytest
from machinable import Storage
from machinable.testing import storage_tests


def test_storage(tmpdir):
    assert Storage.filesystem(str(tmpdir)).config.directory == str(tmpdir)


def test_filesystem_storage(tmpdir):
    storage = Storage.make(
        "machinable.storage.filesystem_storage",
        {"directory": str(tmpdir / "storage")},
    )
    storage_tests(storage)


def test_multiple_storage(tmpdir):
    storage_a = Storage.make(
        "machinable.storage.filesystem_storage",
        {"directory": str(tmpdir / "a")},
    )
    storage_b = Storage.make(
        "machinable.storage.filesystem_storage",
        {"directory": str(tmpdir / "b")},
    )
    storage = Storage.multiple(storage_a, storage_b)
    storage_tests(storage)
