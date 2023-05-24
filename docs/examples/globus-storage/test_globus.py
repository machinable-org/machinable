import json
import os

import pytest
from machinable import Storage

try:
    import globus_sdk
except ImportError:
    globus_sdk = None


@pytest.mark.skipif(
    globus_sdk is None or "MACHINABLE_GLOBUS_TEST_CONFIG" not in os.environ,
    reason="Test requires globus environment",
)
def test_globus_storage(tmp_path):
    storage = Storage.instance(
        "globus",
        [
            {
                "directory": str(tmp_path),
                "index": [
                    "machinable.index",
                    {"database": str(tmp_path / "index.sqlite")},
                ],
            },
            json.loads(os.environ.get("MACHINABLE_GLOBUS_TEST_CONFIG", "{}")),
        ],
    ).__enter__()

    storage.contains()

    storage.__exit__()
