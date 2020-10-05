import os

from ...filesystem import open_fs
from ...utils.identifiers import decode_experiment_id
from .models import StorageComponentModel, StorageExperimentModel


class StorageFileSystemModel:
    def file(self, filepath):
        with open_fs(self.url) as filesystem:
            return filesystem.load_file(filepath)

    def experiment_model(self, url):
        return StorageExperimentFileSystemModel(url)

    def component_model(self, url):
        return StorageComponentFileSystemModel(url)


class StorageExperimentFileSystemModel(StorageFileSystemModel, StorageExperimentModel):
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


class StorageComponentFileSystemModel(StorageFileSystemModel, StorageComponentModel):
    pass
