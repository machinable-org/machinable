import pytest
from machinable.storage import Storage


@pytest.fixture()
def tmp_storage(tmp_path):
    with Storage(
        {
            "directory": str(tmp_path),
            "index": [
                "machinable.index",
                {"database": str(tmp_path / "index.sqlite")},
            ],
        }
    ) as storage:
        yield storage
