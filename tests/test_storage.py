from machinable.storage.filesystem_storage import FilesystemStorage
from machinable.testing import storage_tests


def test_filesystem_storage(tmpdir):
    storage = FilesystemStorage(str(tmpdir / "storage"))
    storage_tests(storage)
