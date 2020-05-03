import os

from fs.errors import FSError

from machinable.config.mapping import config_map
from machinable.utils.formatting import msg

from .base import BaseView
from .records import Records as RecordsView
from .status import StatusTrait
from .task import Task as TaskView


class Observation(StatusTrait, BaseView):
    @property
    def id(self):
        """Returns the observation ID"""
        return self._model.path

    @property
    def storage(self):
        """Returns the write location of the observation"""
        return self._model.storage().url

    @property
    def task(self):
        """The experiment of this observation"""
        return TaskView(self._model.task)

    @property
    def execution_id(self):
        """Returns the execution ID"""
        return self.task.execution_id

    def store(self, name=None):
        """Retrieves element from the write

        This is the counterpart to the ``Observer.write`` method.

        # Arguments
        name: Key or filename of the object that is to be retrieved. If None, a list of available objects is returned
        """
        if name is None:
            store = self._model.load_file("store.json", meta=True)
            try:
                files = self._model.filesystem().listdir("store")
                if not isinstance(store, dict):
                    store = {}
                store["$files"] = files
            except FSError:
                pass
            return store

        if os.path.splitext(name)[1] == "":
            try:
                return self._model.load_file("store.json", meta=True)[name]
            except TypeError:
                return FileNotFoundError

        return self._model.load_file(name)

    @property
    def flags(self):
        """Return the observation flags"""
        return self.component.flags

    @property
    def components(self):
        return self._lazyload(
            "components",
            lambda m: config_map(m.load_file("components.json", meta=True, default={})),
        )

    @property
    def config(self):
        """Returns the observation config"""
        return self.component.config

    @property
    def component(self):
        """Returns the component"""
        return self._lazyload(
            "component", lambda m: config_map(m.load_file("component.json", meta=True)),
        )

    @property
    def host(self):
        """Returns information on the host that produced this observation"""
        return self._lazyload(
            "host", lambda m: config_map(m.load_file("host.json", meta=True))
        )

    @property
    def log(self):
        """Returns the content of the log file"""
        return self._lazyload("log", lambda m: m.load_file("log.txt", meta=True))

    @property
    def output(self):
        """Returns the content of the log file"""
        return self._lazyload("output", lambda m: m.load_file("output.log", meta=True))

    @property
    def records(self):
        """Returns the record interface"""
        return self.get_records_writer("default")

    def get_records_writer(self, scope=None):
        """Returns a record writer

        # Arguments
        scope: The name of the record writer
        """
        if scope is None:
            # return list of available scopes
            try:
                scopes = self._model.filesystem().listdir("records")
                return [s[:-2] for s in scopes if s.endswith(".json")]
            except FSError:
                return []
        return self._lazyload(f"{scope}.records", lambda m: RecordsView(m, scope=scope))

    def __getattr__(self, item):
        # resolve child alias
        aliases = self.flags.get("COMPONENTS_ALIAS", {})
        try:
            return self.children[aliases[item]]
        except (TypeError, KeyError, IndexError):
            raise AttributeError(f"Observation has no attribute '{item}'")

    def __str__(self):
        return f"{self.id}"

    def __repr__(self):
        try:
            return f"Observation <{self.id}> ({self.task.id})"
        except AttributeError:
            return f"Observation <{self.id}>"
