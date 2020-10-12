from machinable import Experiment, execute


def test_records_timing():
    assert (
        execute(Experiment().components("timings"), project="./test_project").failures
        == 0
    )
