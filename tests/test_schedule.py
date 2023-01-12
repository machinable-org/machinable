from machinable import Execution, Experiment, Project, Schedule


def test_schedule(tmp_storage):
    with Project("./tests/samples/project"):
        schedule = Schedule.instance("scheduled")
        assert schedule.test()

        dummy = Experiment.make("dummy")
        with Execution(schedule=schedule) as execution:
            deferred = Experiment()
            deferred.launch()
            assert not deferred.is_mounted()  # did not yet execute

            Experiment().launch()
        assert not deferred.is_started()
        execution.dispatch()
        assert deferred.is_finished()
