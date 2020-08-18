import os

import pendulum

from ...filesystem import open_fs
from ...utils.identifiers import decode_experiment_id
from ...utils.utils import sentinel
from .model import StorageComponentModel, StorageExperimentModel


class StorageFileSystemModel:
    def file(self, filepath, default=sentinel, reload=False):
        if "_files" not in self._meta_data:
            self._meta_data["_files"] = {}
        if isinstance(reload, pendulum.DateTime):
            try:
                loaded_at = self._meta_data["_files"][filepath]["loaded_at"]
                reload = reload >= loaded_at
            except KeyError:
                reload = True

        if filepath not in self._data or reload:
            with open_fs(self.url) as filesystem:
                try:
                    self._data[filepath] = filesystem.load_file(filepath)
                    if filepath not in self._meta_data["_files"]:
                        self._meta_data["_files"][filepath] = {}
                    self._meta_data["_files"][filepath]["loaded_at"] = pendulum.now()
                except FileNotFoundError:
                    if default is not sentinel:
                        return default
                    raise

        return self._data[filepath]


class StorageExperimentFileSystemModel(StorageFileSystemModel, StorageExperimentModel):
    @property
    def unique_id(self):
        if "unique_id" not in self._data:
            if "execution.json" not in self._data:
                with open_fs(self.url) as filesystem:
                    self._data["execution.json"] = filesystem.load_file(
                        "execution.json"
                    )
            self._data["unique_id"] = (
                self.experiment_id + ":" + self._data["execution.json"]["components"][0]
            )
        return self._data["unique_id"]

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

    @property
    def experiment_model(self):
        return StorageExperimentFileSystemModel

    @property
    def component_model(self):
        return StorageComponentFileSystemModel


class StorageComponentFileSystemModel(StorageFileSystemModel, StorageComponentModel):
    @property
    def unique_id(self):
        if "unique_id" not in self._data:
            with open_fs(self.url.replace(self.component_id, "")) as filesystem:
                execution = filesystem.load_file("execution.json")
            self._data["unique_id"] = (
                self.experiment_id + ":" + execution["components"][0]
            )
        return self._data["unique_id"]

    @property
    def experiment_model(self):
        return StorageExperimentFileSystemModel

    @property
    def component_model(self):
        return StorageComponentFileSystemModel
