import json
import os
import pickle

from fs import open_fs
from fs.opener.parse import parse_fs_url


class Directory:
    def __init__(self, url):
        if "://" not in url:
            url = "osfs://" + url
        self._url = url
        resource = os.path.normpath(parse_fs_url(self._url).resource)
        self._path = os.path.basename(resource)
        self._uid = None
        if len(self._path) == 12:
            # switch to parent
            self._uid = self._path
            self._path = os.path.basename(os.path.dirname(resource))
            self._url = self._url.replace("/" + self._uid, "")
        if len(self._path) != 6:
            raise ValueError("The provided path is not a valid storage directory")

        self.filesystem = open_fs(self._url, create=False)
        # todo: implement automatic caching layer

    def set_default_uid(self, uid):
        self._uid = uid

    def load_file(self, filename, uid=None, default=None):
        if uid is None:
            uid = self._uid or ""

        if not isinstance(uid, str):
            raise ValueError(f"Invalid UID: {uid}")

        name, ext = os.path.splitext(filename)

        filepath = os.path.join(uid, filename)

        if not self.filesystem.exists(filepath):
            return FileNotFoundError if default is None else default

        if ext == ".p":
            with self.filesystem.open(filepath, "rb") as f:
                data = pickle.load(f)
        elif ext == ".json":
            with self.filesystem.open(filepath, "r") as f:
                data = json.load(f)
        elif ext == ".npy":
            import numpy as np

            with self.filesystem.open(filepath, "rb") as f:
                data = np.load(f, allow_pickle=True)
        elif ext in [".txt", ".log"]:
            with self.filesystem.open(filepath, "r") as f:
                data = f.read()
        else:
            raise ValueError(f"Invalid file format: {ext}")

        return data
