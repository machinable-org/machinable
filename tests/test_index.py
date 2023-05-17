import os
import sqlite3

from machinable import index, schema


def _is_migrated(db):
    return db.cursor().execute("PRAGMA user_version;").fetchone()[0] == 1


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
    i.create_relation(v1.kind, v1.uuid, v2.uuid, "test_one", "has_one")
    i.create_relation(
        v1.kind, v1.uuid, [v3.uuid, v4.uuid], "test_many", "has_many"
    )
    i.create_relation(v2.kind, v2.uuid, v1.uuid, "reverse_one", "belongs_to")
    i.create_relation(v3.kind, v3.uuid, v1.uuid, "reverse_many", "belongs_to")
    i.create_relation(v4.kind, v4.uuid, v1.uuid, "reverse_many", "belongs_to")

    if setup:
        return i, v1, v2, v3, v4

    assert (
        len(i.db.cursor().execute("SELECT * FROM 'relations';").fetchall()) == 6
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

    q = i.find_related(v1.kind, v1.uuid, "test_one", "has_one")
    assert len(q) == 1
    assert q[0] == v2

    q = i.find_related(v1.kind, v1.uuid, "test_many", "has_many")
    assert len(q) == 2
    assert set([q[0].uuid, q[1].uuid]) == set([v3.uuid, v4.uuid])

    q = i.find_related(v2.kind, v2.uuid, "reverse_one", "belongs_to")
    assert len(q) == 1
    assert q[0] == v1

    q = i.find_related(v3.kind, v3.uuid, "reverse_many", "belongs_to")
    assert len(q) == 1
    assert q[0] == v1

    q = i.find_related(v4.kind, v4.uuid, "reverse_many", "belongs_to")
    assert len(q) == 1
    assert q[0] == v1

    i.db.close()
