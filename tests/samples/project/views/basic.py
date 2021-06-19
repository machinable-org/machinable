from typing import Optional

from machinable import Experiment
from machinable.types import VersionType


class TestView(Experiment):
    def __init__(
        self,
        interface: Optional[str] = None,
        version: VersionType = None,
        derive_from: Optional["Experiment"] = None,
    ):
        super().__init__(
            interface=interface, version=version, derive_from=derive_from
        )
        self._state = None

    def hello(self):
        return "there"

    def set_state(self, state):
        self._state = state

    def get_state(self):
        return self._state
