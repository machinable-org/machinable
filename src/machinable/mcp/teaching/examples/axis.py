"""examples://axis: fanning one interface out over many inputs.

An `axis_<name>` **staticmethod** returns the elements of a sweep and is invoked as
`~~name`, so the fan-out is nameable everywhere a version is (`machinable get
spike_sort ~~sessions --launch`, the API, the MCP) instead of hiding in a second
module. Each element becomes one ordinary run: a member launched through an axis is
the *same record* as that configuration launched directly, so sweeps are incremental
and dedup'd.

An axis has no `self` — it is a pure function of its arguments, which is what keeps it a
set of points rather than a procedure. When the sweep needs its own config, an order, or
prior results to decide what runs next, write an aggregate instead (examples://aggregate).
"""

from glob import glob

from pydantic import BaseModel

from machinable import Interface, get


class SpikeSort(Interface):
    class Config(BaseModel):
        path: str = "?"
        threshold: float = 5.0

    def __call__(self):
        # ... sort self.config.path, then persist
        self.save_file("result.json", {"units": 42})

    @staticmethod
    def axis_sessions(root="data"):  # ~~sessions
        # elements are config patches; sort them, since a group is identified by
        # the set it expands into
        return [{"path": p} for p in sorted(glob(f"{root}/*.nwb"))]

    @staticmethod
    def axis_seeds(n=10):  # ~~seeds
        # an element may also be a scope, to sweep something that is not config
        return [get("machinable.scope", {"seed": s}) for s in range(n)]

    def version_strict(self):  # ~strict
        return {"threshold": 9.0}

    # a <quantity>() an inference can map across the members
    def units(self):
        return self.load_file("result.json")["units"]


# get('spike_sort', ['~~sessions']).launch()             every session
# get('spike_sort', ['~~sessions', '~strict'])           ... at the strict threshold
# get('spike_sort', ['~~sessions', '~~seeds'])           the product of both axes
# get('spike_sort', ['~~sessions']).interfaces           collect without running
