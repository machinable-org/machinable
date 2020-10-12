from machinable import execute, Experiment


def test_records_timing():
    assert (
        execute(Experiment().components("timings"), project="./test_project").failures
        == 0
    )
