from machinable import Component, Project, Storage, errors


def test_end_to_end_execution(tmp_storage):
    with Project("./tests/samples/project"):
        component = Component.make("interface.interrupted_lifecycle").group_as(
            "a/b/c"
        )
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
