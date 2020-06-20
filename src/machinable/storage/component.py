import os

import pendulum

from ..config.mapping import config_map
from ..filesystem import open_fs, parse_fs_url
from .collections import RecordCollection

sentinel = object()


class ComponentStorage:
    def __init__(self, url: str, experiment=None):
        if "://" not in url:
            url = "osfs://" + url
        self.url = url
        resource = os.path.normpath(parse_fs_url(self.url)["resource"])
        self._path = os.path.basename(resource)
        if len(self._path) != 12:
            raise ValueError(
                "The provided URL is not a valid component storage directory"
            )
        self._experiment = experiment
        self._cache = dict()

    @property
    def id(self):
        """Returns the component storage ID"""
        return self._path

    @property
    def experiment(self):
        """The experiment of this observation"""
        from .experiment import ExperimentStorage

        if not isinstance(self._experiment, ExperimentStorage):
            self._experiment = ExperimentStorage(self.url)
        return self._experiment

    def file(self, filepath, default=sentinel, reload=False):
        """Returns the content of a file in the component storage

        # Arguments
        filepath: Relative filepath
        reload: If True, cache will be ignored
        """
        if filepath not in self._cache or reload:
            try:
                with open_fs(self.url) as filesystem:
                    self._cache[filepath] = filesystem.load_file(filepath)
            except FileNotFoundError:
                if default is not sentinel:
                    return default
                raise

        return self._cache[filepath]

    def store(self, name=None):
        """Retrieves element from the write

        This is the counterpart to the ``store.write`` method.

        # Arguments
        name: Key or filename of the object that is to be retrieved. If None, a list of available objects is returned
        """
        if name is None:
            store = self.file("store.json", reload=self.is_alive())
            try:
                with open_fs(self.url) as filesystem:
                    files = filesystem.listdir("store")
                    if not isinstance(store, dict):
                        store = {}
                    store["$files"] = files
            except:
                pass
            return store

        if os.path.splitext(name)[1] == "":
            try:
                return self.file("store.json", reload=self.is_alive())[name]
            except (FileNotFoundError, TypeError, KeyError) as ex:
                return ex

        with open_fs(self.url) as filesystem:
            return filesystem.load_file(
                os.path.join("store", name), default=FileNotFoundError
            )

    @property
    def config(self):
        """Returns the component config"""
        return config_map(self.file("component.json")["config"])

    @property
    def flags(self):
        """Returns the component flags"""
        return config_map(self.file("component.json")["flags"])

    @property
    def tuning(self):
        """True if experiment is a tuning experiment"""
        return self.flags.TUNING

    @property
    def components(self):
        return [config_map(component) for component in self.file("components.json")]

    @property
    def host(self):
        """Returns information of the host"""
        return config_map(self.file("host.json"))

    @property
    def state(self):
        """Returns information of component state"""
        return config_map(self.file("state.json", reload=self.is_alive()))

    @property
    def log(self):
        """Returns the content of the log file"""
        return self.file("log.txt", reload=self.is_alive())

    @property
    def output(self):
        """Returns the content of the log file"""
        return self.file("output.log", reload=self.is_alive())

    @property
    def records(self):
        """Returns the record interface"""
        return self.get_records_writer("default")

    def has_records(self, scope="default"):
        """Returns True if records of given scope exist"""
        return bool(self.file(f"records/{scope}.p", default=False))

    def get_records_writer(self, scope=None):
        """Returns a record writer

        # Arguments
        scope: The name of the record writer
        """
        if scope is None:
            # return list of available scopes
            try:
                with open_fs(self.url) as filesystem:
                    scopes = filesystem.listdir("records")
                    return [s[:-5] for s in scopes if s.endswith(".json")]
            except:
                return []
        return RecordCollection(self.file(f"records/{scope}.p", reload=self.is_alive()))

    @property
    def started_at(self):
        """Returns the starting time"""
        return pendulum.parse(self.status["started_at"])

    @property
    def heartbeat_at(self):
        """Returns the last heartbeat time"""
        if not isinstance(self.status["heartbeat_at"], str):
            return False
        return pendulum.parse(self.status["heartbeat_at"])

    @property
    def finished_at(self):
        """Returns the finishing time"""
        if not isinstance(self.status["finished_at"], str):
            return False
        return pendulum.parse(self.status["finished_at"])

    @property
    def status(self):
        return config_map(self.file("status.json", reload=True))

    def is_finished(self):
        """True if finishing time has been written"""
        status = self.file("status.json", default={"finished_at": False}, reload=True)
        return bool(status["finished_at"])

    def is_started(self):
        status = self.file("status.json", default={"started_at": False}, reload=True)
        return bool(status["started_at"])

    def is_alive(self):
        """True if not finished and last heartbeat occurred less than 30 seconds ago"""
        status = self.file("status.json", default={"heartbeat_at": None}, reload=True)
        if not status["heartbeat_at"]:
            return False

        return (not self.is_finished()) and pendulum.parse(status["heartbeat_at"]).diff(
            pendulum.now()
        ).in_seconds() < 30

    @property
    def schedule(self):
        """Returns the component's schedule"""
        try:
            index = [
                i
                for i, c in enumerate(
                    self.experiment.file("execution.json")["components"]
                )
                if c == self.id
            ][0]
            return config_map(self.experiment.schedule[index])
        except (AttributeError, IndexError, TypeError):
            return None

    def __getattr__(self, item):
        # resolve sub-component alias
        aliases = self.flags.get("COMPONENTS_ALIAS", {})
        try:
            return self.components[aliases[item]]
        except (TypeError, KeyError, IndexError):
            raise AttributeError(f"Component storage has no attribute '{item}'")

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"Storage: Component <{self.id}>"
