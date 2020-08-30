import copy
import os

from ..utils.dicts import update_dict
from ..utils.importing import resolve_instance
from .experiment import StorageExperiment

_latest = [None]


class Storage:
    def __init__(self, config=None):
        if config is None:
            config = "mem://"

        if isinstance(config, dict):
            config = copy.deepcopy(config)

        if isinstance(config, str):
            config = {"url": config}

        # default settings
        self.config = update_dict(
            {
                "url": "mem://",
                "log": {},
                "records": {},
                "directory": "",
                "experiment": "",
                "output_redirection": "SYS_AND_FILE",  # DISABLED, FILE_ONLY, SYS_AND_FILE, DISCARD
            },
            config,
            copy=True,
        )

        if "://" not in self.config["url"]:
            self.config["url"] = "osfs://" + self.config["url"]

        Storage.set_latest(self)

    @classmethod
    def latest(cls):
        return _latest[0]

    @classmethod
    def set_latest(cls, latest):
        _latest[0] = latest

    @classmethod
    def create(cls, args):
        if isinstance(args, Storage):
            return args

        resolved = resolve_instance(args, Storage, "storages")
        if resolved is not None:
            return resolved

        if isinstance(args, dict):
            args = copy.deepcopy(args)

        return cls(args)

    def get_url(self):
        return os.path.join(
            self.config["url"], self.config["directory"], self.config["experiment"]
        )

    def get_experiment(self):
        return StorageExperiment(self.get_url())

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"Storage <{self.get_url()}>"
