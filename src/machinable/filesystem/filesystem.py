import copy
import json
import os
import pickle

from fs import errors, open_fs

sentinel = object()


class FileSystem:
    def __init__(self, config):
        if isinstance(config, dict):
            config = copy.deepcopy(config)
        elif isinstance(config, str):
            config = {"url": config}
        else:
            raise ValueError("Invalid configuration")

        try:
            if "://" not in config["url"]:
                config["url"] = "osfs://" + config["url"]
        except KeyError:
            raise ValueError("Configuration must provide a filesystem URL")

        self.config = config
        self._fs = None

    def __enter__(self):
        try:
            self._fs = open_fs(self.config["url"])
        except errors.CreateFailed:
            raise FileNotFoundError(f"Directory {self.config['url']} does not exist")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._fs.close()

    def get_url(self, *append):
        return os.path.join(self.config["url"], *append)

    def load_file(self, filepath, default=sentinel):
        name, ext = os.path.splitext(filepath)

        with self as filesystem:
            if not filesystem.exists(filepath):
                if default is not sentinel:
                    return default

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
            elif ext in [".txt", ".log"]:
                with filesystem.open(filepath, "r") as f:
                    data = f.read()
            else:
                raise ValueError(f"Invalid file format: {ext}")

            return data

    # forward function calls to fs

    def __getattr__(self, item):
        def forward(*args, **kwargs):
            method = getattr(self._fs, item)
            return method(*args, **kwargs)

        return forward
