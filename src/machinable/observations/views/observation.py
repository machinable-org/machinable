import os
from fs.errors import FSError
from ...config.mapping import config_map
from .status import StatusTrait
from .task import Task as TaskView
from .base import BaseView
from .records import Records as RecordsView
from ...utils.formatting import msg


class Observation(StatusTrait, BaseView):

    @property
    def id(self):
        """Returns the observation ID"""
        return self._model.path

    @property
    def storage(self):
        """Returns the storage location of the observation"""
        return self._model.storage().url

    @property
    def task(self):
        """The task of this observation"""
        return TaskView(self._model.task)

    @property
    def execution_id(self):
        """Returns the execution ID"""
        return self.task.execution_id

    def store(self, name=None):
        """Retrieves element from the storage

        This is the counterpart to the ``Observer.store`` method.

        # Arguments
        name: Key or filename of the object that is to be retrieved. If None, a list of available objects is returned
        """
        if name is None:
            store = self._model.load_file('storage.json', meta=True)
            try:
                files = self._model.filesystem().listdir('storage')
                if not isinstance(store, dict):
                    store = {}
                store['$files'] = files
            except FSError:
                pass
            return store

        if os.path.splitext(name)[1] == '':
            try:
                return self._model.load_file('storage.json', meta=True)[name]
            except TypeError:
                return FileNotFoundError

        return self._model.load_file(name)

    @property
    def children(self):
        """Provides access the child component data of this observation (if existing)"""
        def get_children(m):
            if m.children == '':
                return []

            name = m.children.split(',')
            config = m.load_file('children.json', meta=True)
            flags = m.load_file('flags.json', meta=True, default={}).get('children')
            return [config_map({
                'component': name[i],
                'config': config[i],
                'flags': flags[i]
            }) for i in range(len(name))]

        return self._lazyload('children', get_children)

    @property
    def flags(self):
        """Return the observation flags"""
        return self._lazyload('flags', lambda m: config_map(m.load_file('flags.json', meta=True, default={}).get('node')))

    @property
    def config(self):
        """Returns the observation config"""
        return self._lazyload('config', lambda m: config_map(m.load_file('node.json', meta=True)))

    @property
    def host(self):
        """Returns information on the host that produced this observation"""
        return self._lazyload('host', lambda m: config_map(m.load_file('host.json', meta=True)))

    @property
    def log(self):
        """Returns the content of the log file"""
        return self._lazyload('log', lambda m: m.load_file('log.txt', meta=True))

    @property
    def records(self):
        """Returns the record interface"""
        return self.get_records_writer('default')

    def get_records_writer(self, scope=None):
        """Returns a record writer

        # Arguments
        scope: The name of the record writer
        """
        if scope is None:
            # return list of available scopes
            try:
                scopes = self._model.filesystem().listdir('records')
                return [s[:-2] for s in scopes if s.endswith('.p')]
            except FSError:
                return []
        return self._lazyload(f'{scope}.records', lambda m: RecordsView(m, scope=scope))

    def __getattr__(self, item):
        # resolve child alias
        aliases = self.flags.get('CHILD_ALIAS', {})
        try:
            return self.children[aliases[item]]
        except (TypeError, KeyError, IndexError):
            raise AttributeError(f"Observation has no attribute '{item}'")

    def __str__(self):
        return f'{self.id}'

    def __repr__(self):
        try:
            return f'Observation <{self.id}> ({self.task.id})'
        except AttributeError:
            return f'Observation <{self.id}>'
