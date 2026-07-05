import time

from machinable import Interface


class Slow(Interface):
    """A long-running interface (~4s of Python-level sleeps) used to test cancellation.

    The sleeps are short so an injected ExecutionInterrupted raises promptly at the loop
    boundary."""

    def __call__(self):
        for _ in range(80):
            time.sleep(0.05)
        self.save_file("done", data="1")
