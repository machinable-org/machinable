from .index import Index

try:
    import dataset
except ImportError:
    raise ImportError(
        "Index requires the `dataset` package. Please install it via `pip install dataset`."
    )


class SqlIndex(Index):
    def __init__(self, database="sqlite:///:memory:"):
        self.database = database
        self._db = dataset.connect(database)

        Index.set_latest(self)

    def serialize(self):
        return {"type": "sql", "database": self.database}

    def _add(self, model):
        raise NotImplementedError

    def _find(self, experiment_id: str):
        raise NotImplementedError

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"SqlIndex"
