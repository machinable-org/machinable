from typing import Any, Optional

from machinable import Interface, errors


class EventsCheck(Interface):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.events = ["on_init"]

    def on_dispatch(self):
        self.events.append("on_dispatch")

    def on_seeding(self):
        self.events.append("on_seeding")
        return False

    def set_seed(self, seed: Optional[int] = None) -> bool:
        # never called when on_seeding returns False
        assert False

    def on_create(self):
        assert self.is_started()
        self.events.append("on_create")

    def on_execute(self) -> Any:
        assert self.is_active()
        self.events.append("on_execute")

        return "result"

    def on_destroy(self):
        self.events.append("on_destroy")
        self.save_data("events.json", self.events)

    def on_failure(self, exception: errors.MachinableError):
        assert False

    def on_after_destroy(self):
        assert self.is_finished()
