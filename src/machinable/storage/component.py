import os

import pendulum

from ..config.mapping import config_map
from ..filesystem import open_fs
from ..storage.models.filesystem import StorageFileSystemModel
from .collections import RecordCollection

sentinel = object()


def _reload_time(component):
    finished_at = component.is_finished()
    if finished_at is False:
        return True
    else:
        return finished_at


class ComponentStorage:
    def __init__(self, url: str, experiment=None):
        self._model = StorageFileSystemModel.create(url)
        if self._model.component_id is None:
            raise ValueError(
                "The provided URL is not a valid component storage directory"
            )
        self._experiment = experiment

    @property
    def id(self):
        """Returns the component storage ID"""
        return self._model.component_id

    @property
    def url(self):
        return self._model.url

    @property
    def experiment(self):
        """The experiment of this component"""
        from .experiment import ExperimentStorage

        if not isinstance(self._experiment, ExperimentStorage):
            self._experiment = ExperimentStorage(self.url)
        return self._experiment

    def store(self, name=None):
        """Retrieves element from the write

        This is the counterpart to the ``store.write`` method.

        # Arguments
        name: Key or filename of the object that is to be retrieved. If None, a list of available objects is returned
        """
        if name is None:
            store = self._model.file(
                "store.json", default={}, reload=_reload_time(self)
            )
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
                return self._model.file("store.json", reload=_reload_time(self))[name]
            except (FileNotFoundError, TypeError, KeyError) as ex:
                return ex

        with open_fs(self.url) as filesystem:
            return filesystem.load_file(
                os.path.join("store", name), default=FileNotFoundError
            )

    @property
    def config(self):
        """Returns the component config"""
        return config_map(self._model.file("component.json")["config"])

    @property
    def flags(self):
        """Returns the component flags"""
        return config_map(self._model.file("component.json")["flags"])

    @property
    def tuning(self):
        """True if experiment is a tuning experiment"""
        return self.flags.TUNING

    @property
    def components(self):
        return [
            config_map(component) for component in self._model.file("components.json")
        ]

    @property
    def host(self):
        """Returns information of the host"""
        return config_map(self._model.file("host.json"))

    @property
    def state(self):
        """Returns information of component state"""
        return config_map(self._model.file("state.json", reload=_reload_time(self)))

    @property
    def log(self):
        """Returns the content of the log file"""
        return self._model.file("log.txt", reload=_reload_time(self))

    @property
    def output(self):
        """Returns the content of the log file"""
        return self._model.file("output.log", reload=_reload_time(self))

    @property
    def records(self):
        """Returns the record interface"""
        return self.get_records("default")

    def has_records(self, scope="default"):
        """Returns True if records of given scope exist"""
        return bool(self._model.file(f"records/{scope}.p", default=False))

    def get_records(self, scope=None):
        """Returns a record collection

        # Arguments
        scope: The name of the record scope
        """
        if scope is None:
            # return list of available scopes
            try:
                with open_fs(self.url) as filesystem:
                    scopes = filesystem.listdir("records")
                    return [s[:-5] for s in scopes if s.endswith(".json")]
            except:
                return []
        return RecordCollection(
            self._model.file(
                f"records/{scope}.p", default=[], reload=_reload_time(self)
            )
        )

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
        return config_map(self._model.file("status.json", reload=True))

    def is_finished(self):
        """True if finishing time has been written"""
        status = self._model.file(
            "status.json", default={"finished_at": False}, reload=True
        )
        return bool(status["finished_at"])

    def is_started(self):
        status = self._model.file(
            "status.json", default={"started_at": False}, reload=True
        )
        return bool(status["started_at"])

    def is_alive(self):
        """True if not finished and last heartbeat occurred less than 30 seconds ago"""
        status = self._model.file(
            "status.json", default={"heartbeat_at": None}, reload=True
        )
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
                    self.experiment._model.file("execution.json")["components"]
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
