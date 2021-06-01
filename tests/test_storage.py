from machinable import Storage
from machinable.testing import storage_tests


def test_filesystem_storage(tmpdir):
    storage = Storage.make(
        "machinable.storage.filesystem_storage",
        {"directory": str(tmpdir / "storage")},
    )
    storage_tests(storage)
