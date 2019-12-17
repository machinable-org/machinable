import os
import datetime

import pendulum
from orator import Model
from orator import DatabaseManager
from fs.errors import CreateFailed as CreateFailedException

from ..engine.settings import get_settings
from ..engine.history import get_history
from ..observations.orm.query_builder import QueryBuilder
from ..observations.orm.migrations import run as migrate_database
from ..observations.orm.models import StorageModel, ObservationModel, TaskModel
from .collections import ObservationCollection, Collection
from .views import ObservationView, TaskView


class Observations:
    """Interface to manage machinable observations

    The interface is read-only. machinable will never modify any of the collected observations.

    # Examples

    ```python
    import machinable as ml
    mlo = ml.Observations('~/observations')
    mlo.find()
    ```

    # Arguments
    storage: String, URL of storage location.
    database: String, optional path to SQLite database used for indexing.
        Defaults to non-persistent in-memory database.
    """

    def __init__(self, storage=None, database=None):
        self._cache = {}
        self._registry = set()
        self.database = None
        self._init(database or get_settings()['observations'].get('database', ':memory:'))
        # check storage locations in database
        for s in StorageModel.all():
            if not s.available():
                s.delete()
                continue

            # push unindexed storage locations to lazy load registry
            if not s.indexed:
                self._registry.add(s.url)

        if storage is not None:
            self.add(storage)

    def _init(self, database=':memory:'):
        database = os.path.expanduser(database)

        self.database = DatabaseManager({
            'observations': {'driver': 'sqlite', 'database': database}
        })
        Model.set_connection_resolver(self.database)

        if os.path.isfile(database):
            # do not re-initialise if file based database
            return

        # create and migrate database
        if database != ':memory:':
            os.makedirs(os.path.dirname(database), exist_ok=True)
            open(database, 'w').close()

        migrate_database(self.database)

        return True

    @property
    def storages(self):
        self._lazy_index()
        return list(StorageModel.all(['url']).map(lambda storage: storage.url))

    @property
    def available_storages(self):
        return [e for e in get_history().available() if e not in self.storages]

    def reset(self, database=':memory:'):
        """Resets the interface and deletes the database index

        # Arguments
        database: String, optional location of the SQLite database
        """
        if self.database is not None:
            self.database.disconnect()
            self.database = None

        self._registry = set()
        self._cache = {}

        if os.path.isfile(database):
            os.remove(database)

        return self._init(database)

    def refresh(self, storage=None, or_add=True):
        """Reloads all observations

        # Arguments
        storage: String, optional URL of storage that should be reloaded. If None, all registered storages
            will be reloaded
        or_add: If True, non-existing storage location will be added otherwise ignored.
        """
        if isinstance(storage, str):
            model = StorageModel.whereUrl(storage).first()
            if model is None:
                if or_add:
                    return self.add(storage)
                else:
                    return False
            model.index()
        else:
            # remove database and repopulate as probably faster
            storages = StorageModel.all()
            self.reset()
            for storage in storages:
                self.add(storage.url)

        self._cache = {}
        return True

    def add(self, storage, lazy=False):
        """Load a storage location

        # Arguments
        storage: String, URL to index
        lazy: Boolean, whether location should only be loaded on demand. Defaults to False.
        """
        if isinstance(storage, (list, tuple)):
            return [self.add(s) for s in storage]

        if lazy:
            # push lazy load registry
            self._registry.add(storage)

        model = StorageModel.whereUrl(storage).first()

        if model:
            return

        model = StorageModel.create(url=StorageModel.get_url(storage))
        if not lazy:
            try:
                model.index()
            except CreateFailedException:
                raise FileNotFoundError(f'{storage} does not exists or is not readable')

        return model.url

    def remove(self, storage):
        """Unloads a storage location.

        Note that this does NOT remove any data, the location can be reloaded at any time.
        """
        model = StorageModel.whereUrl(storage).first()

        if not model:
            return

        model.delete()
        return True

    def _lazy_index(self):
        while self._registry:
            self.add(self._registry.pop(), lazy=False)

    # query builder

    @property
    def query(self):
        """Returns a [query builder](#observationsquerybuilder) to build customized queries"""
        self._lazy_index()
        return ObservationsQueryBuilder(self._cache)

    # standard queries

    def find(self, observation_id=None, rerun=False):
        """Finds an observation

        # Arguments
        observation_id: String, observation ID. If None, all available observations will be returned.
            Alternatively, a 6-digit task ID or a 9-digit execution ID can be used to retrieve observations.
        rerun: Integer, optional number of rerun if observation has been reproduced multiple times

        # Returns
        Instance or collection of machinable.Observation
        """
        if rerun is False:
            if observation_id is None:
                return self.query.get()

            if isinstance(observation_id, str):
                if len(observation_id) == 6:
                    return self.find_by_task(observation_id)

                if len(observation_id) == 9:
                    return self.find_by_execution(observation_id)

        if isinstance(observation_id, (list, tuple)):
            return self.find_many(observation_id, rerun)
        return self.query.where('path', observation_id)\
                         .where_has('task', lambda q: q.where('rerun', int(rerun)))\
                         .first()

    def find_all(self):
        """Returns a collection of all available observations

        # Returns
        Instance or collection of machinable.Observation
        """
        return self.query.get()

    def find_many(self, observations, rerun=False):
        """Finds many observations

        # Arguments
        observations: List of observation ID strings.
        rerun: Integer, optional number of rerun if observations have been reproduced multiple times

        # Returns
        Instance or collection of machinable.Observation
        """
        return self.query.where_in('path', observations)\
                         .where_has('task', lambda q: q.where('rerun', int(rerun)))\
                         .get()

    def find_by_task(self, task_id):
        """Finds all observations of a task

        # Arguments
        task_id: String, task ID. Alternatively, a list of task ID can be used.

        # Returns
        Instance or collection of machinable.Observation
        """
        if isinstance(task_id, (list, tuple)):
            return self.query.where_task_in('task_id', task_id).get()

        return self.query.latest().where_task(task_id).get()

    def find_by_most_recent_task(self, criterion='started'):
        """Finds all observations of the most recent task

        # Arguments
        criterion: String, the field by which the tasks should be ordered in descending order.

        # Returns
        Instance or collection of machinable.Observation or None if no tasks are available
        """
        task = TaskModel.order_by(criterion, 'desc').first()
        if task is None:
            return None
        return self.find_by_task(task.task_id)

    def find_by_execution(self, execution_id):
        """Finds observations of a given execution

        # Arguments
        execution_id: String|Task|Observation that specifies the execution

        # Returns
        Instance or collection of machinable.Observation
        """
        def _to_id(execution):
            if isinstance(execution, Collection):
                execution = execution.first()

            if isinstance(execution, (TaskView, ObservationView)):
                execution = execution.execution_id

            if not isinstance(execution, str):
                raise ValueError(f"'{execution}' is not a valid execution ID.")

            return execution

        if isinstance(execution_id, (list, tuple)):
            execution_id = list(map(_to_id, execution_id))
            return self.query.where_task_in('execution_id', execution_id).get()

        return self.query.latest().where_task('execution_id', '=', _to_id(execution_id)).get()

    def find_by_task_name(self, name):
        """Finds observations of tasks with a given name

        # Arguments
        name: String, the search name

        # Returns
        Instance or collection of machinable.Observation
        """
        return self.query.latest().where_task('name', '=', name).get()

    def find_by_node_component(self, node):
        """Finds observations that were produced by a given node component

        # Arguments
        node: String, the search name

        # Returns
        Instance or collection of machinable.Observation
        """
        return self.query.latest().where('node', '=', node).get()

    def find_by_child_component(self, child):
        """Finds observations that were produced by a given child component

        # Arguments
        child: String, the search name

        # Returns
        Instance or collection of machinable.Observation
        """
        return self.query.latest().where(f"FIND_IN_SET('{child}')", '<>', child).get()

    def find_by_storage(self, storage):
        """Finds observations of a given storage

        # Arguments
        storage: String, the search name

        # Returns
        Instance or collection of machinable.Observation
        """
        if isinstance(storage, (list, tuple)):
            return self.query.where_storage_in(storage).get()

        return self.query.latest().where_storage(storage).get()


class ObservationsQueryBuilder(QueryBuilder):

    def __init__(self, cache=None):
        self._cache = cache
        self._query = ObservationModel.with_('task.storage')

    def _field_mapping(self, field):
        if field == 'id':
            field = 'path'

        return field

    def _collection(self, models):
        return ObservationCollection(models.transform(lambda model: ObservationView(model, self._cache)))

    # query operations

    def first(self):
        """Returns the first observation of the specified query
        """
        model = self._query.first()
        if model is None:
            return None
        return ObservationView(model, self._cache)

    def get(self):
        """Returns the observations of the specified query
        """
        models = self._query.get()
        return self._collection(models)

    # aggregated

    def finished(self, time=None, operator='<'):
        """"""
        if time is None:
            time = datetime.datetime.now()
        self._query.where_not_null('finished').where('finished', operator, time)
        return self

    def not_finished(self):
        """"""
        self._query.where_is_null('finished')
        return self

    def alive(self):
        """"""
        self._query.where('heartbeat', '>', pendulum.now().subtract(seconds=30))
        return self

    def tuning(self):
        """"""
        return self.where_task('tuning', '=', 1)

    def not_tuning(self):
        """"""
        return self.where_task('tuning', '=', 0)

    def has_code_backup(self):
        """"""
        return self.where_task('code_backup', '=', True)

    def has_no_code_backup(self):
        """"""
        return self.where_task('code_backup', '=', False)

    def rerun(self, number):
        """"""
        return self.where_task('rerun', '=', number)

    # query mutators

    def latest(self, field='started'):
        """"""
        return self.order_by(field, 'asc')

    def oldest(self, field='started'):
        """"""
        return self.order_by(field, 'desc')

    # where_storage

    def where_storage(self, url, boolean='and'):
        """"""
        self._query = self._query.where_has('storage', lambda q: q.where('url', '=', url, boolean))

        return self

    def or_where_storage(self, url):
        """"""
        return self.where_storage(url, 'or')

    def where_storage_in(self, values, boolean='and', negate=False):
        """"""
        self._query = self._query.where_has('storage', lambda q: q.where_in('url', values, boolean, negate))

        return self

    def or_where_storage_in(self, values):
        """"""
        return self.where_storage_in(values, 'or')

    def where_not_storage_in(self, values, boolean='and'):
        """"""
        return self.where_storage_in(values, boolean, True)

    def or_where_storage_not_in(self, values):
        """"""
        return self.where_storage_in(values, 'or')

    # where_task

    def where_task(self, field, operator='=', value=None, boolean='and'):
        """"""
        if field == 'id':
            field = 'task_id'

        if value is None:
            value = field
            field = 'task_id'

        self._query = self._query.where_has('task', lambda q: q.where(field, operator, value, boolean))

        return self

    def or_where_task(self, field, operator='=', value=None):
        """"""
        return self.where_task(field, operator, value, 'or')

    def where_task_between(self, field, values, boolean='and', negate=False):
        """"""
        if field == 'id':
            field = 'task_id'

        self._query = self._query.where_has('task', lambda q: q.where_between(field, values, boolean, negate))

        return self

    def or_where_task_between(self, field, values):
        """"""
        return self.where_task_between(field, values, 'or')

    def where_not_task_between(self, field, values, boolean='and'):
        """"""
        return self.where_task_between(field, values, boolean, True)

    def or_where_not_task_between(self, field, values):
        """"""
        return self.where_not_task_between(field, values, 'or')

    def where_task_in(self, field, values, boolean='and', negate=False):
        """"""
        if field == 'id':
            field = 'task_id'

        self._query = self._query.where_has('task', lambda q: q.where_in(field, values, boolean, negate))

        return self

    def or_where_task_in(self, field, values):
        """"""
        return self.where_task_in(field, values, 'or')

    def where_not_task_in(self, field, values, boolean='and'):
        """"""
        return self.where_task_in(field, values, boolean, True)

    def or_where_task_not_in(self, field, values):
        """"""
        return self.where_not_task_in(field, values, 'or')
