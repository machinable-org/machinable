import machinable as ml
from machinable import errors


def test_end_to_end_execution(tmp_path):
    with ml.Storage.make(
        "machinable.storage.filesystem", {"directory": str(tmp_path)}
    ):
        with ml.Project("./tests/samples/project"):
            component = ml.Component.make(
                "interfaces.interrupted_lifecycle"
            ).group_as("a/b/c")
            try:
                component.launch()
            except errors.ExecutionFailed:
                pass

            assert component.is_started()
            assert not component.is_finished()

            # resume
            try:
                component.launch()
            except errors.ExecutionFailed:
                pass

            component.launch()
            assert component.is_finished()
