from ...filesystem import parse_storage_url


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
    def create(cls, args, template=None):
        if isinstance(args, StorageModel):
            return args

        if template is not None:
            return template(args)

        return cls(args)

    def submit(self, key, value):
        pass

    def prefetch(self):
        raise NotImplementedError

    def file(self, filepath):
        raise NotImplementedError

    def experiment_model(self, data):
        raise NotImplementedError

    def component_model(self, data):
        raise NotImplementedError


class StorageExperimentModel(StorageModel):
    def __init__(self, data):
        super().__init__(data)
        if self.component_id is not None:
            raise ValueError("The provided URL is not a valid experiment storage URL/")

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
