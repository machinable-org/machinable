import datetime

from orator import DatabaseManager, Schema

from ..orm.query_builder import QueryBuilder
from ..collections import RecordsCollection
from ...utils.formatting import prettydict


class Records(RecordsCollection):

    def __init__(self, models, scope='default'):
        self._models = models
        self._scope = scope
        self._db = self._items = None
        self.indexed_columns = {}
        self.refresh()

    def refresh(self, disable_sql=False):
        """Reloads records from the storage

        # Arguments
        disable_sql: Boolean to disable the indexing of records into the in-memory SQL database used by self.query
        """
        self._items = self._models.load_file(f'records/{self._scope}.p', meta=True)

        if isinstance(self._items, FileNotFoundError) or self._items is FileNotFoundError:
            if self._scope != 'default':
                raise FileNotFoundError(f"Records for scope '{self._scope}' could not be found")
            self._items = []
            return

        # create in-memory sql database
        database = ':memory:'

        config = {'records': {'driver': 'sqlite', 'database': database}}
        self._db = DatabaseManager(config)
        schema = Schema(self._db).connection('records')
        self.indexed_columns = {}
        # schema
        with schema.create('records') as table:
            table.integer('id').unique()
            try:
                if not disable_sql:
                    # use the first row to guess datatype and add supported types to schema
                    for column, value in self._items[0].items():
                        try:
                            # convert numpy scalars into python equivalents
                            import numpy as np
                            if isinstance(value, (np.float, np.float16, np.float32, np.float64,
                                                  np.int, np.int16, np.int32, np.int64,
                                                  np.float, np.float16, np.float32, np.float64)):
                                value = value.item()
                        except (ImportError, AttributeError):
                            pass

                        if isinstance(value, datetime.datetime):
                            table.timestamp(column).nullable()
                            self.indexed_columns[column] = datetime.datetime
                        elif isinstance(value, int):
                            table.integer(column).nullable()
                            self.indexed_columns[column] = int
                        elif isinstance(value, bool):
                            table.boolean(column).nullable()
                            self.indexed_columns[column] = bool
                        elif isinstance(value, float):
                            table.float(column).nullable()
                            self.indexed_columns[column] = float
                        elif isinstance(value, str):
                            table.text(column).nullable()
                            self.indexed_columns[column] = str
            except (TypeError, KeyError):
                pass

        def cast(k, v):
            return self.indexed_columns[k](v) if not isinstance(v, (datetime.datetime, datetime.date)) else v

        # insert data
        if isinstance(self._items, list):
            for r, row in enumerate(self._items):
                data = {k: cast(k, v) for k, v in row.items() if k in self.indexed_columns}
                data.update({'id': r})
                self._db.table('records').insert(data)

    def info(self, echo=False):
        """Returns information about the records as dictionary

        columns: List of columns
        indexed_columns: List of columns that have been indexed and are available in a [query builder](#query)

        # Arguments
        echo: If True, information will be printed
        """
        try:
            columns = [col for col in self.find(0).keys()]
        except TypeError:
            columns = None

        info = {
            'columns': columns,
            'indexed_columns': self.indexed_columns
        }

        if echo:
            print(prettydict(info))

        return info

    @property
    def query(self):
        """Returns a [query builder](#recordsquerybuilder) to build customized queries"""
        return RecordsQueryBuilder(self._db, self._items)

    def find_all(self):
        """Returns all records as a collection"""
        return self.query.get()

    def find(self, record_id=None):
        """Returns a record by ID

        # Arguments
        record_id: Int or list of Int with record IDs. If None, all records are returned

        Returns None or empty collection if record is not found
        """
        if record_id is None:
            return self.query.get()

        if isinstance(record_id, list):
            return self.find_many(record_id)

        try:
            return self._items[record_id]
        except IndexError:
            return None

    def find_many(self, records):
        """Returns a collections of records with a given list of IDs

        # Arguments
        records: List of Record IDs
        """
        return self.query.where_in('id', records).get()

    def __repr__(self):
        return f'Records ({len(self)})'

    def __str__(self):
        return f'Records ({len(self)})'


class RecordsQueryBuilder(QueryBuilder):

    def __init__(self, db, data):
        self._db = db
        self._data = data
        self._query = db.table('records')

    def first(self):
        """Returns the first query result"""
        model = self._query.first()
        return self._data[model.id]

    def _collection(self, models):
        return RecordsCollection(models.transform(lambda model: self._data[model.id]))

    def get(self):
        """Returns the query result"""
        models = self._query.get()
        return self._collection(models)
