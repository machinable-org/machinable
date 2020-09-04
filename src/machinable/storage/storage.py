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

        # shorthand directory notation {"path/example"} -> {"directory": "path/example"}
        if isinstance(config, set):
            if len(config) != 1 or not isinstance(next(iter(config)), str):
                raise ValueError(f"Invalid storage config: {config}")
            config = {"directory": config.pop()}

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

    def set_directory(self, directory: str):
        """Set the directory of the storage

        Relative path that gets appended to the storage directory of this experiment

        # Arguments
        directory: String, defines the directory name as string which may contain the following variables:
            - &EXPERIMENT will be replaced by the experiment name
            - &PROJECT will be replaced by project name
            - %x expressions will be replaced by strftime
            The variables are expanded following GNU bash's variable expansion rules, e.g.
             `&{EXPERIMENT:-default_value}` or `&{PROJECT:?}` can be used.
        """
        if not isinstance(directory, str):
            raise ValueError("Name must be a string")
        if directory[0] == "/":
            raise ValueError("Directory must be relative")
        self.config["directory"] = directory

        return self

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
