import copy
import json
import os
import pickle

from fs import errors, open_fs
from machinable.repository.repository import Repository
from machinable.utils.dicts import serialize
from machinable.utils.utils import sentinel


class FileSystem:
    def __init__(self, url: str, create: bool = False):
        if "://" not in url:
            url = "osfs://" + url
        self._url = url
        self._create = create
        self._fs = None

    def __enter__(self):
        try:
            self._fs = open_fs(self._url, create=self._create)
        except (errors.ResourceNotFound, errors.CreateFailed) as e:
            raise FileNotFoundError(
                f"Directory {self.url} does not exist"
            ) from e
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._fs.close()

    def repository(self, repository, create=None):
        repository = Repository.make(repository)
        # hack
        path = repository.name
        if create is not False:
            self._fs.makedirs(path, recreate=create is True)

    def get_url(self, append=""):
        return self.url.rstrip("/") + "/" + append.lstrip("/")

    def load_file(self, filepath, default=sentinel):
        name, ext = os.path.splitext(filepath)
        try:
            with self as filesystem:
                if ext == ".p":
                    with filesystem.open(filepath, "rb") as f:
                        data = pickle.load(f)
                elif ext == ".json":
                    with filesystem.open(filepath, "r") as f:
                        data = json.load(f)
                elif ext == ".npy":
                    import numpy as np

                    with filesystem.open(filepath, "rb") as f:
                        data = np.load(f, allow_pickle=True)
                elif ext in [".txt", ".log", ".diff"]:
                    with filesystem.open(filepath, "r") as f:
                        data = f.read()
                else:
                    raise ValueError(f"Invalid file format: {ext}")
                return data
        except errors.FSError as ex:
            if default is not sentinel:
                return default
            raise FileNotFoundError(str(ex))

    def save_file(self, name, data, overwrite=True):
        """Stores a data object

        # Arguments
        name: String, name identifier.
            You can provide an extension to instruct machinable to write the data in its own file and not as part
            of a dictionary with other stored values.
            Supported formats are .json (JSON), .npy (numpy), .p (pickle), .txt (txt)
        data: The data object
        overwrite: Boolean, if True existing values will be overwritten
        """
        mode = "w" if overwrite else "a"
        path = os.path.dirname(name)
        name = os.path.basename(name)
        _, ext = os.path.splitext(name)
        filepath = os.path.join(path, name)

        try:
            with self as filesystem:
                # make sure directory exists
                filesystem.makedirs(path, recreate=True)
                if ext == ".json":
                    # json
                    with filesystem.open(filepath, mode) as f:
                        f.write(
                            json.dumps(
                                data, ensure_ascii=False, default=serialize
                            )
                        )
                elif ext == ".npy":
                    import numpy as np

                    if "b" not in mode:
                        mode += "b"
                    # numpy
                    with filesystem.open(filepath, mode) as f:
                        np.save(f, data)
                elif ext == ".p":
                    if "b" not in mode:
                        mode += "b"
                    with filesystem.open(filepath, mode) as f:
                        pickle.dump(data, f)
                elif ext in [".txt", ".log", ".diff"]:
                    with filesystem.open(filepath, mode) as f:
                        f.write(data)
                else:
                    raise ValueError(
                        f"Invalid format: '{ext}'. "
                        f"Supported formats are .json (JSON), .npy (numpy), .p (pickle), .txt (txt)"
                    )
        except errors.FSError as ex:
            raise OSError(str(ex))

    # forward function calls to underlying fs

    def __getattr__(self, item):
        if self._fs is None:
            self._fs = open_fs(self._url, create=self._create)
        return getattr(self._fs, item)
