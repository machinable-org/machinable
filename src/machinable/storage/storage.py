import copy

from ..utils.dicts import update_dict
from ..utils.importing import resolve_instance


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

    @classmethod
    def create(cls, args):
        if isinstance(args, Storage):
            return args

        resolved = resolve_instance(args, Storage, "storages")
        if resolved is not None:
            return resolved

        if isinstance(args, dict):
            args = copy.deepcopy(args)

        return Storage(args)

    @classmethod
    def get_component(cls, url):
        """Returns a [ComponentStorage](#) for the given URL

        # Arguments
        url: String, filesystem URL
        """
        from .component import ComponentStorage

        return ComponentStorage(url)

    @classmethod
    def get_experiment(cls, url):
        """Returns a [ExperimentStorage](#) for the given URL

        # Arguments
        url: String, filesystem URL
        """
        from .experiment import ExperimentStorage

        return ExperimentStorage(url)

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"Storage <{self.config['url']}>"
