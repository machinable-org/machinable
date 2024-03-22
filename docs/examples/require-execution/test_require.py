import pytest
from machinable import get


def test_require_execution(tmp_path):
    p = get("machinable.project", "docs/examples/require-execution").__enter__()

    with get("machinable.index", str(tmp_path)):
        not_ready = get("machinable.component").commit()
        with pytest.raises(RuntimeError):
            with get("require"):
                not_ready.launch()

        ready = not_ready.launch()
        with get("require"):
            ready.launch()

    p.__exit__()
