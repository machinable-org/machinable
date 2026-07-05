"""A scheduler-handoff Execution: dispatch-time *submits* (here: writes a
marker file standing in for `sbatch`) and returns — the payload runs later
when the scheduler re-enters via ``machinable dispatch --foreground``."""

from machinable import Execution


class HandoffExecution(Execution):
    handoff = True

    def __call__(self) -> None:
        # submission stand-in: a real implementation would render dispatch
        # scripts (e.g. via dispatch_code / `machinable dispatch --foreground`)
        # and hand them to the scheduler here.
        self.save_file("submitted", "ok")
