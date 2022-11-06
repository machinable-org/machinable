import pytest
from machinable.storage import Storage


@pytest.fixture()
def tmp_storage(tmp_path):
    with Storage.filesystem(str(tmp_path)) as storage:
        yield storage
