import os
import pytest

from machinable import Index, Interface, Project, Storage, get


def test_require_execution(tmp_path):
    with (
        Storage(str(tmp_path)),
        Index({"database": str(tmp_path / "index.sqlite")}),
    ):
        with Project(os.path.dirname(__file__)):
            not_ready = Interface().materialize()
            with pytest.raises(RuntimeError):
                with get("require"):
                    not_ready.launch()

            ready = not_ready.launch()
            with get("require"):
                ready.launch()
