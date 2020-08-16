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
            decode_experiment_id(data["experiment_id"], or_fail=True)
        if "component_id" not in data:
            data["component_id"] = None
        self._meta_data = {}
        self._data = data

    @classmethod
    def create(cls, args):
        if isinstance(args, StorageFileSystemModel):
            return args

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

    @property
    def unique_id(self):
        if "unique_id" not in self._data:
            if self.component_id is not None:
                with open_fs(self.url.replace(self.component_id, "")) as filesystem:
                    execution = filesystem.load_file("execution.json")
            else:
                execution = self.file("execution.json")
            self._data["unique_id"] = (
                self.experiment_id + ":" + execution["components"][0]
            )
        return self._data["unique_id"]

    def is_valid(self):
        return (
            self.file("execution.json", default={}).get("id", "") == self.experiment_id
        )

    def file(self, filepath, default=sentinel, reload=False):
        """Returns the content of a file in the storage

        # Arguments
        filepath: Relative filepath
        reload: If True, cache will be ignored.
          If datetime, file will be reloaded if cached version is older than the date
        """
        if isinstance(reload, pendulum.DateTime):
            try:
                loaded_at = self._meta_data[filepath]["loaded_at"]
                reload = reload >= loaded_at
            except KeyError:
                reload = True

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

    def experiments(self):
        experiments = []
        try:
            with open_fs(os.path.join(self.url, "experiments")) as filesystem:
                for path, info in filesystem.walk.info(exclude_dirs=["experiments"]):
                    if not info.is_dir:
                        continue
                    directory, name = os.path.split(path)
                    if not decode_experiment_id(name, or_fail=False):
                        continue
                    experiments.append(filesystem.get_url(path))
        except FileNotFoundError:
            pass
        finally:
            return experiments

    def serialize(self):
        if self.component_id is None:
            # experiment
            return {
                "unique_id": self.unique_id,
                "url": self.url,
                "experiment_id": self.experiment_id,
                "code.json": self.file("code.json"),
                "execution.json": self.file("execution.json"),
                "schedule.json": self.file("schedule.json"),
                # excluded, since not constant sized
                # "host.json": self.file("host.json"),
                # "code.diff": self.file("code.diff")
            }
        else:
            # component
            return {
                "unique_id": self.unique_id,
                "url": self.url,
                "experiment_id": self.experiment_id,
                "component_id": self.component_id,
                "component.json": self.file("component.json"),
                "components.json": self.file("components.json"),
                "state.json": self.file("state.json"),
                "status.json": self.file("status.json"),
                # excluded, since not constant sized
                # "output.log": self.file("output.log"),
                # "log.txt": self.file("log.txt"),
                # "store.json": self.file("store.json"),
                # "host.json": self.file("host.json")
            }

    @classmethod
    def unserialize(cls, serialized):
        return cls(serialized)
