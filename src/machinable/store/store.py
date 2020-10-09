import json
import os

import pendulum

from ..filesystem import open_fs
from ..utils.dicts import serialize
from ..utils.utils import sentinel
from .log import Log
from .record import Record

try:
    import cPickle as pickle
except ImportError:
    import pickle


class Store:
    """Store interface

    ::: tip
    Becomes available as ``self.storage``
    :::

    # Arguments
    component: Component instance
    config: dict, configuration options
    """

    def __init__(self, component, config):
        self.component = component
        self.config = config

        # todo: migrate to FileSystem abstraction
        from fs import open_fs as openfs_legacy

        self.filesystem = openfs_legacy(self.config["url"], create=True)
        self.filesystem.makedirs(
            self.get_path(), recreate=self.config.get("allow_overwrites", False)
        )

        self._record_writers = {}
        self._log = None
        self.created_at = pendulum.now().timestamp()

    def get_record_writer(self, scope=None):
        """Creates or returns an instance of a record writer

        # Arguments
        scope: Name of the record writer. If None, a dict of all registered writers will be returned
        """
        if scope is None:
            return self._record_writers

        if scope not in self._record_writers:
            self._record_writers[scope] = Record(
                store=self, config=self.config["records"], scope=scope
            )

        return self._record_writers[scope]

    @property
    def record(self):
        """Record interface
        """
        return self.get_record_writer("default")

    @property
    def log(self):
        """Log interface
        """
        if self._log is None:
            self._log = Log(store=self, config=self.config["log"])

        return self._log

    def has_records(self, scope="default"):
        """Determines whether record writer exists

        # Arguments
        scope: String, name of the record writer. Defaults to 'default'

        # Returns
        True if records have been written
        """
        return scope in self._record_writers

    def has_log(self):
        """Determines whether log writer exists

        # Returns
        True if log writer exists
        """
        return self._log is not None

    def has_file(self, name):
        with open_fs(self.config["url"]) as filesystem:
            return filesystem.exists(name)

    def write(self, name, data, overwrite=True, _meta=False):
        # deprecated alias
        return self.save_data(name, data, overwrite, _meta)

    def save_file(self, filepath, data):
        return self.save_data(filepath, data, overwrite=True, _meta=True)

    def save_data(self, name, data, overwrite=True, _meta=False):
        """Stores a data object

        # Arguments
        name: String, name identifier. Supported formats are .json (JSON), .npy (numpy), .p (pickle), .txt (txt)
        data: The data object
        overwrite: Boolean, if False existing values won't be overwritten if existing
        """
        mode = "w" if overwrite else "a"
        path = os.path.dirname(name)
        name = os.path.basename(name)
        _, ext = os.path.splitext(name)

        if not _meta:
            path = "data/" + path
        self.filesystem.makedir(self.get_path(path), recreate=True)
        filepath = os.path.join(path, name)

        # todo: check overwrite for files

        if ext == ".json":
            # json
            with self.get_stream(filepath, mode) as f:
                f.write(json.dumps(data, ensure_ascii=False, default=serialize))
        elif ext == ".npy":
            import numpy as np

            if "b" not in mode:
                mode += "b"
            # numpy
            with self.get_stream(filepath, mode) as f:
                np.save(f, data)

        elif ext == ".p":
            if "b" not in mode:
                mode += "b"
            with self.get_stream(filepath, mode) as f:
                pickle.dump(data, f)

        elif ext == ".txt":
            with self.get_stream(filepath, mode) as f:
                f.write(data)
        else:
            raise ValueError(
                f"Invalid format: '{ext}'. "
                f"Supported formats are .json (JSON), .npy (numpy), .p (pickle), .txt (txt)"
            )

        if hasattr(self.component, "events"):
            self.component.events.trigger(
                "storage.on_change", "storage.save", {"name": name, "data": data}
            )

    def get_url(self, append=""):
        """Returns the storage URL of the component"""
        return os.path.join(
            self.config["url"],
            os.path.join(
                self.config.get("directory", ""),
                self.config["experiment"],
                self.config.get("component", ""),
                append,
            ),
        )

    def local_directory(self, append=""):
        """Returns the local storage filesystem path, or False if non-local

        # Returns
        Local filesystem path, or False if non-local
        """
        if not self.config["url"].startswith("osfs://"):
            return False

        return os.path.join(self.get_url().split("osfs://")[-1], append)

    def get_stream(self, path, mode="r", *args, **kwargs):
        """Returns a file stream on the storage

        # Arguments
        path: Relative file path
        mode: Python file mode
        *args, **kwargs: Optional arguments passed into stream open()
        """
        return self.filesystem.open(self.get_path(path), mode, *args, **kwargs)

    def get_path(self, append="", create=False):
        """Returns the write path

        # Arguments
        append: String, optional postfix that is appended to the path
        create: Boolean, if True path is being created if not existing
        """
        path = os.path.join(
            self.config.get("directory", ""),
            self.config["experiment"],
            self.config.get("component", ""),
            append,
        )

        if create:
            self.filesystem.makedirs(path, recreate=True)

        return path
