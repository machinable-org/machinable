import copy
import os

import pendulum

from ...filesystem import open_fs, parse_fs_url
from ...utils.identifiers import decode_experiment_id
from .model import Model

sentinel = object()


class StorageFileSystemModel(Model):
    def __init__(self, data):
        self._data = None
        self._meta_data = None
        self.fill(data)

    def fill(self, data):
        if isinstance(data, str):
            data = {"url": data}

        if not isinstance(data, dict):
            raise ValueError("Invalid data type")

        # de-reference
        data = copy.deepcopy(data)

        if "url" not in data:
            raise ValueError("Undefined field: url")

        if "://" not in data["url"]:
            data["url"] = "osfs://" + data["url"]

        if "experiment_id" not in data:
            resource = os.path.normpath(parse_fs_url(data["url"])["resource"])
            data["experiment_id"] = os.path.basename(resource)
            if len(data["experiment_id"]) == 12:
                # if component, switch to experiment
                data["component_id"] = data["experiment_id"]
                data["experiment_id"] = os.path.basename(os.path.dirname(resource))
            else:
                data["component_id"] = None
            decode_experiment_id(data["experiment_id"], or_fail=True)
        self._meta_data = {}
        self._data = data

    @classmethod
    def create(cls, args):
        if isinstance(args, StorageFileSystemModel):
            return args

        if isinstance(args, str):
            return StorageFileSystemModel({"url": args})

        return StorageFileSystemModel(args)

    @property
    def url(self) -> str:
        return self._data["url"]

    @property
    def experiment_id(self) -> str:
        return self._data["experiment_id"]

    @property
    def component_id(self):
        return self._data["component_id"]

    def file(self, filepath, default=sentinel, reload=False):
        """Returns the content of a file in the storage

        # Arguments
        filepath: Relative filepath
        reload: If True, cache will be ignored.
          If datetime, file will be reloaded if cached version is older than the date
        """
        if isinstance(reload, pendulum.DateTime):
            if filepath not in self._meta_data:
                reload = True
            else:
                loaded_at = self._meta_data[filepath].create("loaded_at")
                reload = reload >= loaded_at

        if filepath not in self._data or reload:
            with open_fs(self.url) as filesystem:
                try:
                    self._data[filepath] = filesystem.load_file(filepath)
                    self._meta_data[filepath] = {"loaded_at": pendulum.now()}
                except FileNotFoundError:
                    if default is not sentinel:
                        return default
                    raise

        return self._data[filepath]
