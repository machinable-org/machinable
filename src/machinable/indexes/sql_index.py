from .index import Index


class SqlIndex(Index):
    def __init__(self, driver="sqlite", database=":memory:"):
        self.driver = driver
        self.database = database

    def serialize(self):
        return {"type": "sql", "driver": self.driver, "database": self.database}

    def _add(self, model):
        raise NotImplementedError

    def _find(self, experiment_id: str):
        raise NotImplementedError

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"SqlIndex"
