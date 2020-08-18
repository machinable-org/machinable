import copy
import os

from ...filesystem import parse_fs_url
from ...utils.identifiers import decode_experiment_id
from ...utils.traits import Jsonable
from ...utils.utils import sentinel


class StorageModel(Jsonable):
    def __init__(self, data, meta_data=None):
        self._data = None
        self._meta_data = None
        self.fill(data, meta_data)

    def fill(self, data, meta_data=None):
        if isinstance(data, str):
            data = {"url": data}

        if not isinstance(data, dict):
            raise ValueError("Invalid data type")

        # de-reference
        data = copy.deepcopy(data)
        meta_data = copy.deepcopy(meta_data)

        if "url" not in data:
            raise ValueError("Undefined field: url")

        if "://" not in data["url"]:
            data["url"] = "osfs://" + data["url"]

        if "experiment_id" not in data:
            resource = os.path.normpath(parse_fs_url(data["url"])["resource"])
            data["experiment_id"] = os.path.basename(resource)
            if len(data["experiment_id"]) == 12:
                # if component, switch to experiment
                data["component_id"] = data["experiment_id"]
                data["experiment_id"] = os.path.basename(os.path.dirname(resource))
            decode_experiment_id(data["experiment_id"], or_fail=True)
        if "component_id" not in data:
            data["component_id"] = None
        self._meta_data = meta_data if isinstance(meta_data, dict) else {}
        self._data = data

    @classmethod
    def create(cls, args, template=None):
        if isinstance(args, StorageModel):
            return args

        if template is not None:
            return template(args)

        return cls(args)

    def serialize(self):
        return {"data": self._data, "meta_data": self._meta_data}

    @classmethod
    def unserialize(cls, serialized):
        return cls(**serialized)

    @property
    def url(self) -> str:
        return self._data["url"]

    @property
    def experiment_id(self) -> str:
        return self._data["experiment_id"]

    @property
    def component_id(self):
        return self._data["component_id"]

    def prefetch(self):
        raise NotImplementedError

    @property
    def unique_id(self):
        raise NotImplementedError

    def file(self, filepath, default=sentinel, reload=False):
        """Returns the content of a file in the storage

        # Arguments
        filepath: Relative filepath
        reload: If True, cache will be ignored.
          If datetime, file will be reloaded if cached version is older than the date
        """
        raise NotImplementedError

    @property
    def experiment_model(self):
        raise NotImplementedError

    @property
    def component_model(self):
        raise NotImplementedError


class StorageExperimentModel(StorageModel):
    def __init__(self, data, meta_data=None):
        super().__init__(data, meta_data)
        if self.component_id is not None:
            raise ValueError("The provided URL is not a valid experiment storage URL/")

    def exists(self):
        return (
            self.file("execution.json", default={}).get("id", "") == self.experiment_id
        )

    def prefetch(self):
        return {
            "unique_id": self.unique_id,
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
    def __init__(self, data, meta_data=None):
        super().__init__(data, meta_data)
        if self.component_id is None:
            raise ValueError("The provided URL is not a valid component storage URL")

    def exists(self):
        return self.file("status.json", default=None) is not None

    def prefetch(self):
        return {
            "unique_id": self.unique_id,
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
