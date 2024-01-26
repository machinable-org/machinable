import json
import os

import pytest
from machinable import Component, Storage

try:
    import globus_sdk
except ImportError:
    globus_sdk = None


@pytest.mark.skipif(
    globus_sdk is None or "MACHINABLE_GLOBUS_TEST_CONFIG" not in os.environ,
    reason="Test requires globus environment",
)
def test_globus_storage():
    storage = Storage.make(
        "globus",
        json.loads(os.environ.get("MACHINABLE_GLOBUS_TEST_CONFIG", "{}")),
    ).__enter__()
    try:
        c = Component()
        c.save_file(".test", "test")
        c.local_directory("test", create=True)
        c.save_file("test/tada", "test")
        c.save_file("test/.tada", "test")
        c.launch()

        storage.tasks_wait()

        assert storage.contains(c.uuid)

        fetched = os.path.abspath("./storage/fetched")
        os.makedirs(fetched, exist_ok=True)
        storage.retrieve(c.uuid, fetched)

        cf = Component.from_directory(fetched)
        assert cf.load_file(".test") == "test"
        assert cf.load_file("test/tada") == "test"
        assert cf.load_file("test/.tada") == "test"
        assert cf.execution.is_finished()
    finally:
        storage.__exit__()
