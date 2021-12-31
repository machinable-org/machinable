from typing import Optional

from machinable import Experiment
from machinable.types import VersionType


class TestView(Experiment):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._state = None

    def hello(self):
        return "there"

    def set_state(self, state):
        self._state = state

    def get_state(self):
        return self._state
