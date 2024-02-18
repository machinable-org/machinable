import os
import shutil
import sqlite3

import pytest
from machinable import Component, index, schema


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


def test_index_commit(tmp_path):
    i = index.Index({"database": str(tmp_path / "index.sqlite")})
    v = schema.Interface()
    e = (
        v.uuid,
        "Interface",
        None,
        *(("{}",) * 3),
        "[]",
        "null",
        "[]",
        v.timestamp,
        "{}",
    )
    assert i.commit(v) is True
    with index.db(i.config.database) as db:
        assert db.cursor().execute("SELECT * FROM 'index';").fetchall() == [e]
        assert i.commit(v) is False
        assert db.cursor().execute("SELECT * FROM 'index';").fetchall() == [e]
        assert i.commit(schema.Interface()) is True
        assert (
            len(db.cursor().execute("SELECT * FROM 'index';").fetchall()) == 2
        )


def test_index_create_relation(tmp_path, setup=False):
    i = index.Index({"database": str(tmp_path / "index.sqlite")})
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

    with index.db(i.config.database) as db:
        assert (
            len(db.cursor().execute("SELECT * FROM 'relations';").fetchall())
            == 8
        )


def test_index_find(tmp_path):
    i = index.Index({"database": str(tmp_path / "index.sqlite")})
    v = schema.Interface()
    assert i.commit(v) is True
    assert i.find_by_id(v.uuid) == v
    assert i.find_by_id("non-existing") is None


def test_index_find_by_context(tmp_path):
    i = index.Index({"database": str(tmp_path / "index.sqlite")})
    v = schema.Interface(module="machinable", predicate={"a": 0, "b": 0})
    i.commit(v)
    assert len(i.find_by_context(dict(module="machinable"))) == 1
    assert (
        len(i.find_by_context(dict(module="machinable", predicate={"a": 1})))
        == 0
    )
    assert (
        len(i.find_by_context(dict(module="machinable", predicate={"a": 0})))
        == 1
    )
    assert (
        len(
            i.find_by_context(
                dict(module="machinable", predicate={"a": 0, "b": 1})
            )
        )
        == 0
    )
    assert (
        len(
            i.find_by_context(
                dict(module="machinable", predicate={"a": 0, "b": 0})
            )
        )
        == 1
    )


def test_index_find_by_hash(tmp_path):
    i = index.Index({"database": str(tmp_path / "index.sqlite")})
    v = schema.Interface(module="machinable", predicate={"a": 0, "b": 0})
    i.commit(v)
    assert i.find_by_hash(v.hash) == [v]

    v2 = schema.Interface(module="machinable")
    v2.uuid = v.uuid[:24] + v2.uuid[:12]
    i.commit(v2)
    assert i.find_by_hash(v2.hash) == [v2]

    v3 = schema.Interface(module="machinable", predicate={"a": 1})
    i.commit(v3)

    assert i.find_by_hash("0" * 12) == [v, v3]


def test_index_find_related(tmp_path):
    i, v1, v2, v3, v4 = test_index_create_relation(tmp_path, setup=True)

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


def test_index_find(tmp_path):
    i = index.Index({"database": str(tmp_path / "index.sqlite")})
    v = schema.Interface(module="machinable", predicate={"a": 0, "b": 0})
    i.commit(v)
    assert i.find_by_hash(v.hash) == i.find(v, by="hash")
    assert i.find_by_id(v.uuid) == i.find(v, by="uuid")[0]
    assert i.find_by_id(v.id) == i.find(v, by="id")[0]

    with pytest.raises(ValueError):
        i.find(v.hash, by="invalid")


def test_index_import_directory(tmp_path):
    local_index = index.Index(str(tmp_path / "local"))
    remote_index = index.Index(str(tmp_path / "remote"))

    with remote_index:
        a = Component().launch()
        b = Component({"a": 1}, uses=a).launch()
        a_source_dir = a.local_directory()
        b_source_dir = b.local_directory()
        assert b.uses[0] == a

    assert local_index.find_by_id(a.uuid) is None
    local_index.import_directory(a_source_dir, relations=False)
    local_index.import_directory(b_source_dir, file_importer=shutil.move)
    assert local_index.find_by_id(a.uuid) is not None
    assert local_index.find_by_id(b.uuid) is not None
    assert os.path.exists(local_index.local_directory(a.uuid))
    assert os.path.exists(local_index.local_directory(b.uuid))

    assert os.path.exists(a_source_dir)
    assert not os.path.exists(b_source_dir)

    assert local_index.find_related("Interface.Interface.using", b.uuid)

    with local_index:
        c = Component.find_by_id(b.uuid)
        r = c.uses
        assert r[0] == a
