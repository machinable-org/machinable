import pytest

from machinable import Engine, execute
from machinable.engine.detached_engine import DetachedEngine as Detached
from machinable.utils.importing import resolve_instance


def test_execution_resolve():
    with pytest.raises(ValueError):
        resolve_instance("@", Engine, default_path="test_project")
    assert isinstance(
        resolve_instance("@", Engine, default_path="test_project/_machinable/engines"),
        Engine,
    )
    assert isinstance(
        resolve_instance(
            "@named", Engine, default_path="test_project/_machinable/engines"
        ),
        Detached,
    )


def test_execution_resolvers():
    execution = execute(
        "@/test_project/_machinable/experiments",
        engine="@/test_project/_machinable/engines",
        project="./test_project",
    )
    assert (
        execution.experiment.specification["name"]
        == "test_project._machinable.experiments"
    )
