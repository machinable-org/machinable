import os
import sqlite3

from machinable import index, schema


def _is_migrated(db):
    return db.cursor().execute("PRAGMA user_version;").fetchone()[0] == 1


def _matches(q, v):
    return {v.uuid for v in q} == {v.uuid for v in v}


def test_index_migrate():
    db = sqlite3.connect(":memory:")
    index.migrate(db)
    assert _is_migrated(db)
    db.close()


def test_index_load(tmp_path):
    db = index.load(str(tmp_path / "index.sqlite"), create=True)
    assert os.path.exists(str(tmp_path / "index.sqlite"))
    assert _is_migrated(db)
    db.close()
    db = index.load(
        str(tmp_path / "non-existing" / "subdir" / "index.sqlite"), create=True
    )
    assert os.path.exists(
        str(tmp_path / "non-existing" / "subdir" / "index.sqlite")
    )
    assert _is_migrated(db)
    db.close()


def test_index_commit():
    i = index.Index({"database": ":memory:"})
    v = schema.Interface()
    e = (v.uuid, "Interface", None, "null", "[]", "null", "[]")
    assert i.commit(v) is True
    assert i.db.cursor().execute("SELECT * FROM 'index';").fetchall() == [e]
    assert i.commit(v) is False
    assert i.db.cursor().execute("SELECT * FROM 'index';").fetchall() == [e]
    assert i.commit(schema.Interface()) is True
    assert len(i.db.cursor().execute("SELECT * FROM 'index';").fetchall()) == 2
    i.db.close()


def test_index_create_relation(setup=False):
    i = index.Index({"database": ":memory:"})
    v1, v2, v3, v4 = (
        schema.Interface(),
        schema.Interface(),
        schema.Interface(),
        schema.Interface(),
    )
    assert all([i.commit(v) for v in [v1, v2, v3, v4]])
    i.create_relation("test_one", v1.uuid, v2.uuid)
    i.create_relation("test_one", v1.uuid, v2.uuid)  # duplicate
    i.create_relation("test_many", v1.uuid, [v2.uuid, v3.uuid, v4.uuid])
    i.create_relation("test_many_to_many", v1.uuid, [v2.uuid, v3.uuid])
    i.create_relation("test_many_to_many", v2.uuid, [v3.uuid, v4.uuid])

    if setup:
        return i, v1, v2, v3, v4

    assert (
        len(i.db.cursor().execute("SELECT * FROM 'relations';").fetchall()) == 8
    )

    i.db.close()


def test_index_find():
    i = index.Index({"database": ":memory:"})
    v = schema.Interface()
    assert i.commit(v) is True
    assert i.find(v.uuid) == v
    assert i.find("non-existing") is None
    i.db.close()


def test_index_find_by_predicate():
    i = index.Index({"database": ":memory:"})
    v = schema.Interface(module="machinable", predicate={"a": 0, "b": 0})
    i.commit(v)
    assert len(i.find_by_predicate(module="machinable")) == 1
    assert (
        len(i.find_by_predicate(module="machinable", predicate={"a": 1})) == 0
    )
    assert (
        len(i.find_by_predicate(module="machinable", predicate={"a": 0})) == 1
    )
    assert (
        len(
            i.find_by_predicate(module="machinable", predicate={"a": 0, "b": 1})
        )
        == 0
    )
    assert (
        len(
            i.find_by_predicate(module="machinable", predicate={"a": 0, "b": 0})
        )
        == 1
    )
    i.db.close()


def test_index_find_related():
    i, v1, v2, v3, v4 = test_index_create_relation(setup=True)

    q = i.find_related("test_one", v1.uuid)
    assert len(q) == 1
    assert q[0] == v2
    q = i.find_related("test_one", v2.uuid, inverse=True)
    assert len(q) == 1
    assert q[0] == v1

    q = i.find_related("test_many", v1.uuid)
    assert len(q) == 3
    assert _matches(q, [v2, v3, v4])

    q = i.find_related("test_many", v2.uuid, inverse=True)
    assert len(q) == 1
    assert q[0] == v1

    q = i.find_related("test_many_to_many", v1.uuid)
    assert len(q) == 2
    assert _matches(q, [v2, v3])

    q = i.find_related("test_many_to_many", v3.uuid, inverse=True)
    assert len(q) == 2
    assert _matches(q, [v1, v2])

    i.db.close()
