import json
import os

import pytest
from machinable import Index, Storage

try:
    import globus_sdk
except ImportError:
    globus_sdk = None


@pytest.mark.skipif(
    globus_sdk is None or "MACHINABLE_GLOBUS_TEST_CONFIG" not in os.environ,
    reason="Test requires globus environment",
)
def test_globus_storage(tmp_path):
    Index(
        {"directory": str(tmp_path), "database": str(tmp_path / "test.sqlite")}
    ).__enter__()
    storage = Storage.make(
        "globus",
        json.loads(os.environ.get("MACHINABLE_GLOBUS_TEST_CONFIG", "{}")),
    ).__enter__()

    assert storage.contains("test") is False

    storage.__exit__()
