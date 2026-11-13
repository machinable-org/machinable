import os
import time

from machinable import Interface


def _wait_for(path, timeout=5.0):
    deadline = time.monotonic() + timeout
    while not os.path.exists(path):
        if time.monotonic() > deadline:
            return False
        time.sleep(0.01)
    return True


class Pusher(Interface):
    """Emits events with binary buffers and streams that wait on marker files."""

    def blocks(self, n=3):
        for i in range(n):
            self.emit(
                {"block": i},
                buffers=[bytes([i]) * 4, bytearray(b"b%d" % i), memoryview(b"m%d" % i)],
            )
        return "done"

    def array_block(self):
        import numpy as np

        samples = np.arange(12, dtype=np.float32).reshape(3, 4)
        # a strided view: sent as its C-order bytes
        self.emit({"shape": [4, 3]}, buffers=[samples.T, samples])
        return "done"

    def gated_stream(self, started, release):
        # blocks inside a step until the test creates `release`
        with open(started, "w") as f:
            f.write("1")
        yield "released" if _wait_for(release) else "timeout"
        yield "after"

    def endless(self, closed):
        try:
            while True:
                time.sleep(0.01)
                yield "tick"
        finally:
            with open(closed, "w") as f:
                f.write("1")

    def quick(self):
        return "quick"
