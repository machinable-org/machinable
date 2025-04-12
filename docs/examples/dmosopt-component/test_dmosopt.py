import pytest
from machinable import get


def test_dmosopt_component(tmp_path):
    p = get("machinable.project", "docs/examples/dmosopt-component").__enter__()

    with get("machinable.index", str(tmp_path)):
        try:
            get("dmosopt").launch()
        except ModuleNotFoundError:
            pass

    p.__exit__()
