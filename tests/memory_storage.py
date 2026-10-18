"""A storage whose homes are ``mem://`` URIs, held in this process's memory."""

import itertools
import threading

from pydantic import BaseModel

from machinable import Storage

BUCKETS: dict[str, dict[str, tuple[bytes, str]]] = {}
_LOCK = threading.Lock()
_VERSIONS = itertools.count(1)


class MemoryStorage(Storage):
    catalog_log = True

    class Config(BaseModel):
        directory: str = "./storage"
        url: str = "mem://bucket"
        catalog_max_bytes: int = 1024 * 1024

    def __init__(self, version=None):
        super().__init__(version=version)
        self.reads: list[str] = []

    @property
    def id(self) -> str:
        return "memory"

    @property
    def objects(self) -> dict[str, tuple[bytes, str]]:
        return BUCKETS.setdefault(self.root_uri(), {})

    def root_uri(self) -> str:
        return self.config.url.rstrip("/")

    def owns(self, uri):
        root = self.root_uri()
        return uri is not None and (uri == root or uri.startswith(root + "/"))

    def _key(self, location: str, name: str = "") -> str:
        assert self.owns(location), location
        relative = location[len(self.root_uri()) :].strip("/")
        return "/".join(p for p in (relative, name) if p)

    # -- the file methods ------------------------------------------------------

    def list(self, location, recursive=True):
        prefix = self._key(location)
        prefix = prefix + "/" if prefix else ""
        listing = {}
        with _LOCK:
            items = list(self.objects.items())
        for key, (data, version) in items:
            if not key.startswith(prefix):
                continue
            name = key[len(prefix) :]
            if recursive or "/" not in name:
                listing[name] = (name, len(data), version)
            else:
                directory = name.split("/", 1)[0] + "/"
                listing[directory] = (directory, 0, None)
        return sorted(listing.values())

    def read(self, location, name):
        key = self._key(location, name)
        self.reads.append(key)
        with _LOCK:
            found = self.objects.get(key)
        return found[0] if found is not None else None

    def write(self, location, name, data):
        if not isinstance(data, bytes):
            data = data.read()
        with _LOCK:
            self.objects[self._key(location, name)] = (
                bytes(data),
                str(next(_VERSIONS)),
            )

    def remove(self, location, name):
        with _LOCK:
            self.objects.pop(self._key(location, name), None)

    # -- the two atomic operations ---------------------------------------------

    def read_versioned(self, location):
        with _LOCK:
            return self.objects.get(self._key(location))

    def create_if_absent(self, location, data):
        key = self._key(location)
        with _LOCK:
            if key in self.objects:
                return False
            self.objects[key] = (data, str(next(_VERSIONS)))
            return True

    def replace_if_unchanged(self, location, data, version):
        key = self._key(location)
        with _LOCK:
            current = self.objects.get(key)
            if current is None or current[1] != version:
                return False
            self.objects[key] = (data, str(next(_VERSIONS)))
            return True
