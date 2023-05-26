import pytest
from machinable.index import Index


@pytest.fixture()
def tmp_storage(tmp_path):
    with Index(
        {
            "directory": str(tmp_path),
            "database": str(tmp_path / "index.sqlite"),
        }
    ) as index:
        yield index
