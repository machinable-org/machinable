from ...filesystem import parse_storage_url
from ...utils.importing import ModuleClass

_register = {
    "experiment": None,
    "component": None,
}


class StorageModel:
    def __init__(self, url: str):
        if not isinstance(url, str):
            raise ValueError(f"Invalid url: {url}")

        if "://" not in url:
            url = "osfs://" + url

        self.url = url
        parsed = parse_storage_url(url)
        self.experiment_id = parsed["experiment_id"]
        self.component_id = parsed["component_id"]

    @classmethod
    def clear(cls, types=None):
        if types is None:
            types = ["experiment", "component"]
        if isinstance(types, str):
            types = [types]
        for k in types:
            _register[k] = None

    @classmethod
    def component(cls, model=None):
        if isinstance(model, str):
            model = ModuleClass(model, baseclass=StorageComponentModel)
        _register["component"] = model

    @classmethod
    def experiment(cls, model=None):
        if isinstance(model, str):
            model = ModuleClass(model, baseclass=StorageExperimentModel)
        _register["component"] = model

    def submit(self, key, value):
        pass

    def prefetch(self):
        raise NotImplementedError

    def file(self, filepath):
        raise NotImplementedError

    def experiment_model(self, url):
        raise NotImplementedError

    def component_model(self, url):
        raise NotImplementedError


class StorageExperimentModel(StorageModel):
    def __init__(self, data):
        super().__init__(data)
        if self.component_id is not None:
            self.component_id = None

    @classmethod
    def create(cls, args):
        if isinstance(args, StorageExperimentModel):
            return args

        # find registered default
        if _register["experiment"] is not None:
            return _register["experiment"](args)

        # use global default
        from .filesystem import StorageExperimentFileSystemModel

        return StorageExperimentFileSystemModel(args)

    def exists(self):
        try:
            return self.file("execution.json")["experiment_id"] == self.experiment_id
        except (KeyError, FileNotFoundError):
            return False

    def prefetch(self):
        return {
            "url": self.url,
            "experiment_id": self.experiment_id,
            "code.json": self.file("code.json"),
            "execution.json": self.file("execution.json"),
            # not constant sized
            "schedule.json": self.file("schedule.json"),
            "host.json": self.file("host.json"),
            "code.diff": self.file("code.diff"),
        }

    def experiments(self):
        raise NotImplementedError


class StorageComponentModel(StorageModel):
    def __init__(self, data):
        super().__init__(data)
        if self.component_id is None:
            raise ValueError("The provided URL is not a valid component storage URL")

    @classmethod
    def create(cls, args):
        if isinstance(args, StorageComponentModel):
            return args

        # find registered default
        if _register["component"] is not None:
            return _register["component"](args)

        # use global default
        from .filesystem import StorageComponentFileSystemModel

        return StorageComponentFileSystemModel(args)

    def exists(self):
        try:
            return bool(self.file("status.json")["started_at"])
        except (FileNotFoundError, KeyError):
            return False

    def prefetch(self):
        return {
            "url": self.url,
            "experiment_id": self.experiment_id,
            "component_id": self.component_id,
            "component.json": self.file("component.json"),
            "components.json": self.file("components.json"),
            "state.json": self.file("state.json"),
            "status.json": self.file("status.json"),
            # not constant sized
            "output.log": self.file("output.log"),
            "log.txt": self.file("log.txt"),
            "store.json": self.file("store.json"),
            "host.json": self.file("host.json"),
        }
