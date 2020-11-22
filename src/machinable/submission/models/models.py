from ...filesystem import parse_storage_url
from ...utils.importing import ModuleClass

_register = {
    "submission": None,
    "component": None,
}


class Models:
    @classmethod
    def clear(cls, types=None):
        if types is None:
            types = ["experiment", "component"]
        if isinstance(types, str):
            types = [types]
        for k in types:
            _register[k] = None

    @classmethod
    def submission(cls, model=None):
        if isinstance(model, str):
            model = ModuleClass(model, baseclass=SubmissionModel)
        _register["submission"] = model

    @classmethod
    def component(cls, model=None):
        if isinstance(model, str):
            model = ModuleClass(model, baseclass=SubmissionComponentModel)
        _register["component"] = model


class BaseModel:
    def __init__(self, url: str):
        if not isinstance(url, str):
            raise ValueError(f"Invalid url: {url}")

        if "://" not in url:
            url = "osfs://" + url

        self.url = url
        parsed = parse_storage_url(url)
        self.submission_id = parsed["submission_id"]
        self.component_id = parsed["component_id"]

    def submit(self, key, value):
        pass

    def prefetch(self):
        raise NotImplementedError

    def file(self, filepath):
        raise NotImplementedError

    def submission_model(self, url):
        raise NotImplementedError

    def submission_component_model(self, url):
        raise NotImplementedError


class SubmissionModel(BaseModel):
    def __init__(self, url):
        super().__init__(url)
        if self.component_id is not None:
            self.component_id = None

    @classmethod
    def create(cls, args):
        if isinstance(args, SubmissionModel):
            return args

        return SubmissionModel.get()(args)

    @classmethod
    def get(cls):
        # find registered default
        if _register["submission"] is not None:
            return _register["submission"]

        # use global default
        from .filesystem import FileSystemSubmissionModel

        return FileSystemSubmissionModel

    def exists(self):
        try:
            return self.file("execution.json")["submission_id"] == self.submission_id
        except (KeyError, FileNotFoundError):
            return False

    def prefetch(self):
        return {
            "url": self.url,
            "submission_id": self.submission_id,
            "code.json": self.file("code.json"),
            "execution.json": self.file("execution.json"),
            # not constant sized
            "schedule.json": self.file("schedule.json"),
            "host.json": self.file("host.json"),
            "code.diff": self.file("code.diff"),
        }

    def submissions(self):
        raise NotImplementedError


class SubmissionComponentModel(BaseModel):
    def __init__(self, url):
        super().__init__(url)
        if self.component_id is None:
            raise ValueError("The provided URL is not a valid submission component URL")

    @classmethod
    def create(cls, args):
        if isinstance(args, SubmissionComponentModel):
            return args

        return SubmissionComponentModel.get()(args)

    @classmethod
    def get(cls):
        # find registered default
        if _register["component"] is not None:
            return _register["component"]

        # use global default
        from .filesystem import FileSystemSubmissionComponentModel

        return FileSystemSubmissionComponentModel

    def exists(self):
        try:
            return bool(self.file("status.json")["started_at"])
        except (FileNotFoundError, KeyError):
            return False

    def prefetch(self):
        return {
            "url": self.url,
            "submission_id": self.submission_id,
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
