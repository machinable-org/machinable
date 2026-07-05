import os
from machinable import Index, Project, Storage, get


def test_dmosopt_component(tmp_path):
    with (
        Storage(str(tmp_path)),
        Index({"database": str(tmp_path / "index.sqlite")}),
    ):
        with Project(os.path.dirname(__file__)):
            try:
                get("dmosopt").launch()
            except ModuleNotFoundError:
                pass
