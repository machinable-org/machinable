from machinable import Index
from machinable.index.native_index import NativeIndex
from machinable.index.sql_index import SqlIndex


def test_index_instantiation():
    assert isinstance(Index(), SqlIndex)
    assert isinstance(NativeIndex(), NativeIndex)
    assert isinstance(SqlIndex(), SqlIndex)
