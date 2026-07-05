import os

from machinable import Interface


class Ingest(Interface):
    def byte_length(self, path: str) -> int:
        full = os.path.join(self.local_directory(), path)
        with open(full, "rb") as handle:
            return len(handle.read())
