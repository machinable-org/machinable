from typing import Any, Optional

from machinable import Component, errors


class EventsCheck(Component):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.events = ["on_init"]

    def on_before_dispatch(self):
        self.events.append("on_dispatch")

    def on_seeding(self):
        self.events.append("on_seeding")
        return False

    def on_success(self):
        assert self.execution.is_started()
        self.events.append("on_success")

    def __call__(self) -> None:
        assert self.execution.is_active()
        self.events.append("on_call")

    def on_after_dispatch(self, success):
        self.events.append("on_after_dispatch")
        self.save_file("events.json", self.events)
        assert self.execution.is_finished()

    def on_failure(self, exception: errors.MachinableError):
        assert False
