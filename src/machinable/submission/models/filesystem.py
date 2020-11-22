import os

from ...filesystem import open_fs
from ...utils.identifiers import decode_submission_id
from .models import SubmissionComponentModel, SubmissionModel


class FileSystemBaseModel:
    def file(self, filepath):
        with open_fs(self.url) as filesystem:
            return filesystem.load_file(filepath)

    def submission_model(self, url):
        return FileSystemSubmissionModel(url)

    def submission_component_model(self, url):
        return FileSystemSubmissionComponentModel(url)


class FileSystemSubmissionModel(FileSystemBaseModel, SubmissionModel):
    def submissions(self):
        experiments = []
        try:
            with open_fs(os.path.join(self.url, "submissions")) as filesystem:
                for path, info in filesystem.walk.info(exclude_dirs=["submissions"]):
                    if not info.is_dir:
                        continue
                    directory, name = os.path.split(path)
                    if not decode_submission_id(name, or_fail=False):
                        continue
                    experiments.append(filesystem.get_url(path))
        except FileNotFoundError:
            pass
        finally:
            return experiments


class FileSystemSubmissionComponentModel(FileSystemBaseModel, SubmissionComponentModel):
    pass
