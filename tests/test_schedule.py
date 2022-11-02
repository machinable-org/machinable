from machinable import Execution, Experiment, Project, Schedule


def test_schedule():
    with Project("./tests/samples/project"):
        schedule = Schedule.instance("scheduled")
        assert schedule.test()

        # run conventionally
        Experiment().execute()
        assert len(schedule.executions) == 0

        dummy = Experiment.make("dummy")
        with schedule:
            Experiment().execute()
            Execution().use(Experiment()).dispatch()
            dummy.execute()

        assert not dummy.is_mounted()  # did not execute

        assert len(schedule.executions) == 3
        schedule.dispatch()
        schedule.reset()
        assert len(schedule.executions) == 0
