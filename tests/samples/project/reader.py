import os

from machinable import Interface
from machinable.errors import NotFound


class Reader(Interface):
    """Streams bytes back from a file under its directory via the read() hook."""

    def read(self, params):
        path = params.get("path")
        if not path:
            raise NotFound("no path given")
        full = os.path.join(self.local_directory(), path)
        if not os.path.exists(full):
            raise NotFound(f"missing: {path}")
        size = int(params.get("chunk_size", 2))
        with open(full, "rb") as handle:
            while True:
                block = handle.read(size)
                if not block:
                    break
                yield block
