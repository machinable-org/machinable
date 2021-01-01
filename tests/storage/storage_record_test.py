from machinable import Execution, Experiment


def test_records_timing():
    assert (
        Execution(Experiment().components("timings"), project="./test_project")
        .submit()
        .failures
        == 0
    )
