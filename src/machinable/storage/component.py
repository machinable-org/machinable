import os
from typing import Union

import pendulum

from ..config.mapping import config_map
from ..filesystem import open_fs, parse_storage_url
from ..storage.models import StorageComponentModel
from ..utils.utils import sentinel
from .collections import RecordCollection
from .models.filesystem import StorageComponentFileSystemModel


class StorageComponent:
    def __init__(
        self, url: Union[str, dict, StorageComponentModel], experiment=None, cache=None
    ):
        self._model = StorageComponentModel.create(
            url, template=StorageComponentFileSystemModel
        )
        self._cache = cache or {}
        self._cache["experiment"] = experiment

    def file(self, filepath, default=sentinel, reload=None):
        """Returns the content of a file in the storage

        # Arguments
        filepath: Relative filepath
        reload: If True, cache will be ignored. If datetime, file will be reloaded if cached version is older than the date
        """
        if reload is None:
            finished_at = self.finished_at
            if finished_at is False:
                reload = True
            else:
                reload = finished_at

        if "_files" not in self._cache:
            self._cache["_files"] = {}

        if isinstance(reload, pendulum.DateTime):
            try:
                loaded_at = self._cache["_files"][filepath]["loaded_at"]
                # buffer reloading by 1 second
                reload = reload >= loaded_at.add(seconds=1)
            except KeyError:
                reload = True

        if filepath not in self._cache or reload:
            with open_fs(self.url) as filesystem:
                try:
                    self._cache[filepath] = filesystem.load_file(filepath)
                    if filepath not in self._cache["_files"]:
                        self._cache["_files"][filepath] = {}
                    self._cache["_files"][filepath]["loaded_at"] = pendulum.now()
                except FileNotFoundError:
                    if default is not sentinel:
                        return default
                    raise

        return self._cache[filepath]

    @property
    def unique_id(self):
        if "unique_id" not in self._cache:
            self._cache["unique_id"] = (
                self.experiment.experiment_id + "_" + self.component_id
            )
        return self._cache["unique_id"]

    @property
    def url(self):
        """Returns the component storage URL"""
        return self._model.url

    @property
    def component_id(self):
        """Returns the component storage ID"""
        return self._model.component_id

    @property
    def experiment(self):
        """The experiment of this component"""
        if self._cache["experiment"] is None:
            from .experiment import StorageExperiment

            parsed = parse_storage_url(self.url)
            url = self.url.replace("/" + parsed["component_id"], "")

            self._cache["experiment"] = StorageExperiment(
                self._model.experiment_model(url)
            )

        return self._cache["experiment"]

    def store(self, name=None):
        """Retrieves element from the store

        This is the counterpart to the ``store.write`` method.

        # Arguments
        name: Key or filename of the object that is to be retrieved. If None, a list of available objects is returned
        """
        if isinstance(name, str) and os.path.splitext(name)[1] != "":
            return self._model.file(os.path.join("store", name))

        if "store" in self._cache:
            store = self._cache["store"]
        else:
            try:
                store = self._model.file("store.json")
            except FileNotFoundError:
                store = {}

            with open_fs(self.url) as filesystem:
                store["__files"] = filesystem.listdir("store")

            if self.is_finished():
                self._cache["store"] = store

        if name is None:
            return store

        return store[name]

    @property
    def config(self):
        """Returns the component config"""
        if "config" not in self._cache:
            self._cache["config"] = config_map(self.file("component.json")["config"])
        return self._cache["config"]

    @property
    def flags(self):
        """Returns the component flags"""
        if "flags" not in self._cache:
            self._cache["flags"] = config_map(self.file("component.json")["flags"])
        return self._cache["flags"]

    @property
    def tuning(self):
        """True if experiment is a tuning experiment"""
        return self.flags.TUNING

    @property
    def components(self):
        if "components" not in self._cache:
            self._cache["components"] = [
                config_map(component) for component in self.file("components.json")
            ]

        return self._cache["components"]

    @property
    def host(self):
        """Returns information of the host"""
        if "host" not in self._cache:
            self._cache["host"] = config_map(self.file("host.json"))
        return self._cache["host"]

    @property
    def state(self):
        """Returns information of component state"""
        if "state" in self._cache:
            return self._cache["state"]

        state = config_map(self.file("state.json"))
        if self.is_finished():
            self._cache["state"] = state

        return state

    def log(self):
        """Returns the content of the log file"""
        if "log" in self._cache:
            return self._cache["log"]

        log = self.file("log.txt")

        if self.is_finished():
            self._cache["log"] = log

        return log

    def output(self):
        """Returns the content of the log file"""
        if "output" in self._cache:
            return self._cache["output"]

        output = self.file("output.log")

        if self.is_finished():
            self._cache["output"] = output

        return output

    @property
    def records(self):
        """Returns the record interface"""
        return self.get_records("default")

    def has_records(self, scope="default"):
        """Returns True if records of given scope exist"""
        with open_fs(self.url) as filesystem:
            return filesystem.exists(f"records/{scope}.json")

    def get_records(self, scope=None):
        """Returns a record collection

        # Arguments
        scope: The name of the record scope.
          If None, list of all available scopes will be returned
        """
        if scope is None:
            # return list of available scopes
            try:
                with open_fs(self.url) as filesystem:
                    scopes = filesystem.listdir("records")
                    return [s[:-5] for s in scopes if s.endswith(".json")]
            except FileNotFoundError:
                return []

        if "records." + scope in self._cache:
            return self._cache["records." + scope]

        records = RecordCollection(self.file(f"records/{scope}.p"))

        if self.is_finished():
            self._cache["records." + scope] = records

        return records

    @property
    def status(self):
        if "status" in self._cache:
            return self._cache["status"]

        try:
            status = config_map(
                {
                    k: pendulum.parse(v) if isinstance(v, str) else False
                    for k, v in self._model.file("status.json").items()
                }
            )
        except FileNotFoundError:
            status = {"started_at": False, "finished_at": False, "heartbeat_at": False}

        if status["finished_at"] is not False:
            self._cache["status"] = status

        return status

    @property
    def started_at(self):
        """Returns the starting time"""
        return self.status["started_at"]

    @property
    def heartbeat_at(self):
        """Returns the last heartbeat time"""
        return self.status["heartbeat_at"]

    @property
    def finished_at(self):
        """Returns the finishing time"""
        return self.status["finished_at"]

    def is_finished(self):
        """True if finishing time has been written"""
        return bool(self.status["finished_at"])

    def is_started(self):
        """True if starting time has been written"""
        return bool(self.status["started_at"])

    def is_active(self):
        """True if not finished and last heartbeat occurred less than 30 seconds ago"""
        if not self.status["heartbeat_at"]:
            return False

        return (not self.is_finished()) and self.status["heartbeat_at"].diff(
            pendulum.now()
        ).in_seconds() < 30

    def is_incomplete(self):
        """Shorthand for is_started() and not (is_active() or is_finished())"""
        return self.is_started() and not (self.is_active() or self.is_finished())

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"Storage: Component <{self.component_id}>"
