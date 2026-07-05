"""examples://execution: a custom Execution (the mechanism that runs interfaces).

An Execution is to interfaces what Slurm/MPI are: its Config is the *resources/
mechanism*, never the interfaces it runs (those arrive via `Execution().add(x)`).
Iterate `self.interfaces` to dispatch each one.
"""

from pydantic import BaseModel

from machinable import Execution


class Local(Execution):
    class Config(BaseModel):
        processes: int = 1  # the mechanism's knobs, not the work

    def __call__(self):
        # run each added interface in-process (a real backend would submit/scatter)
        for interface in self.interfaces:
            interface.dispatch()

    def canonicalize_resources(self, resources):
        return resources


# usage:
#   with Local({"processes": 4}):
#       get("train", ["~adam"]).launch()      # the Execution runs it
