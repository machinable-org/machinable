from machinable import Index
from machinable.indexes.native_index import NativeIndex
from machinable.indexes.sql_index import SqlIndex


def test_index_instantiation():
    assert isinstance(Index(), NativeIndex)
    assert isinstance(Index("sql"), SqlIndex)
    assert Index("sql", database="test").database == "test"
