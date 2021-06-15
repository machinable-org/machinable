import os

import pytest
from machinable import Storage
from machinable.testing import storage_tests


def test_filesystem_storage(tmpdir):
    storage = Storage.make(
        "machinable.storage.filesystem_storage",
        {"directory": str(tmpdir / "storage")},
    )
    storage_tests(storage)


@pytest.mark.skipif(
    "DIRECTUS_STORAGE_URL" not in os.environ,
    reason="No directus test instance available",
)
def test_directus_storage(tmpdir):
    storage = Storage.make(
        "machinable.storage.directus_storage",
        {
            "url": os.environ.get("DIRECTUS_STORAGE_URL"),
            "token": os.environ.get("DIRECTUS_STORAGE_TOKEN"),
            "local_directory": str(tmpdir),
        },
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
