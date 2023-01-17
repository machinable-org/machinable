from machinable import Project, errors, get


def test_end_to_end_execution(tmp_path):
    with get("machinable.storage.filesystem", {"directory": str(tmp_path)}):
        with Project("./tests/samples/project"):

            experiment = get("interfaces.interrupted_lifecycle").group_as(
                "a/b/c"
            )
            try:
                experiment.launch()
            except errors.ExecutionFailed:
                pass

            assert experiment.is_started()
            assert not experiment.is_finished()
            assert len(experiment.records()) == 3

            # resume
            try:
                experiment.launch.dispatch()
            except errors.ExecutionFailed:
                pass
            assert len(experiment.records()) == 7

            experiment.launch.dispatch()
            assert len(experiment.records()) == 10
            assert experiment.is_finished()

            assert [r["step"] for r in experiment.records()] == list(range(10))
