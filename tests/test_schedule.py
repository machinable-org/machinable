import pytest
from machinable import Execution, Experiment, Project, Schedule, errors


class Supported(Execution):
    def on_verify_schedule(self):
        return self.schedule.module == "scheduled"


def test_schedule(tmp_storage):
    with Project("./tests/samples/project"):
        schedule = Schedule.instance("scheduled")
        assert schedule.test()

        # execution does not support schedule
        with pytest.raises(errors.ExecutionFailed):
            with Execution(schedule=schedule) as execution:
                Experiment().launch()

        # execution supports schedule
        with Supported(schedule=["scheduled"]) as execution:
            experiment = Experiment().launch()
            assert not experiment.is_finished()
        assert experiment.is_finished()
        assert execution.schedule.test()
