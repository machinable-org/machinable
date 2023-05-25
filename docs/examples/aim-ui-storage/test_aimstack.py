import pytest
from machinable import Index, Storage

try:
    import aim
except ImportError:
    aim = None


@pytest.mark.skipif(
    aim is None,
    reason="Test requires aim environment",
)
def test_aimstack_storage(tmp_path):
    from pathlib import Path

    tmp_path = Path("../aim-test-storage")

    index = Index(
        {"directory": str(tmp_path), "database": str(tmp_path / "test.sqlite")}
    ).__enter__()
    storage = Storage.instance(
        "aimstack", {"repo": index.config.directory}
    ).__enter__()

    print(storage.repo)

    storage.__exit__()
