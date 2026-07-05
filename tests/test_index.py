import os
import shutil
import sqlite3

import pytest

from machinable import Execution, Storage, index, schema
from machinable.api.models import FindRequest
from machinable.index import materialize_model


def _is_migrated(db):
    return (
        db.cursor().execute("PRAGMA user_version;").fetchone()[0]
        == index.SCHEMA_VERSION
    )


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
    assert os.path.exists(str(tmp_path / "non-existing" / "subdir" / "index.sqlite"))
    assert _is_migrated(db)
    db.close()


def test_index_materialize(tmp_path):
    i = index.Index({"database": str(tmp_path / "index.sqlite")})
    v = schema.Interface(module="test-a")
    assert materialize_model(i, v) is True
    with index.db(i.config.database) as db:
        rows = db.cursor().execute("SELECT * FROM 'index';").fetchall()
        assert len(rows) == 1
        assert rows[0][0] == v.uuid
        assert materialize_model(i, v) is False
        assert len(db.cursor().execute("SELECT * FROM 'index';").fetchall()) == 1
        assert materialize_model(i, schema.Interface(module="test-b")) is True
        assert len(db.cursor().execute("SELECT * FROM 'index';").fetchall()) == 2


def test_index_create_relation(tmp_path, setup=False):
    i = index.Index({"database": str(tmp_path / "index.sqlite")})
    v1, v2, v3, v4 = (
        schema.Interface(module="rel-1"),
        schema.Interface(module="rel-2"),
        schema.Interface(module="rel-3"),
        schema.Interface(module="rel-4"),
    )
    assert all([materialize_model(i, v) for v in [v1, v2, v3, v4]])
    i.create_relation("test_one", v1.uuid, v2.uuid)
    i.create_relation("test_one", v1.uuid, v2.uuid)  # duplicate
    i.create_relation("test_many", v1.uuid, [v2.uuid, v3.uuid, v4.uuid])
    i.create_relation("test_many_to_many", v1.uuid, [v2.uuid, v3.uuid])
    i.create_relation("test_many_to_many", v2.uuid, [v3.uuid, v4.uuid])

    if setup:
        return i, v1, v2, v3, v4

    with index.db(i.config.database) as db:
        assert len(db.cursor().execute("SELECT * FROM 'relations';").fetchall()) == 8


def test_index_get_by_id(tmp_path):
    i = index.Index({"database": str(tmp_path / "index.sqlite")})
    v = schema.Interface(module="get-by-id")
    materialize_model(i, v)
    assert i.get_by_id(v.uuid) is not None
    assert i.get_by_id("non-existing") is None


def test_index_find_predicate(tmp_path):
    i = index.Index({"database": str(tmp_path / "index.sqlite")})
    v = schema.Interface(module="machinable", predicate={"a": 0, "b": 0})
    materialize_model(i, v)
    assert len(i.find(FindRequest(module="machinable", predicate={})).items) == 1
    assert (
        len(
            i.find(
                FindRequest(
                    module="machinable",
                    predicate={"a": 1},
                )
            ).items
        )
        == 0
    )
    assert (
        len(
            i.find(
                FindRequest(
                    module="machinable",
                    predicate={"a": 0},
                )
            ).items
        )
        == 1
    )
    assert (
        len(
            i.find(
                FindRequest(
                    module="machinable",
                    predicate={"a": 0, "b": 1},
                )
            ).items
        )
        == 0
    )
    assert (
        len(
            i.find(
                FindRequest(
                    module="machinable",
                    predicate={"a": 0, "b": 0},
                )
            ).items
        )
        == 1
    )


def test_index_find_by_record_suffix(tmp_path):
    i = index.Index({"database": str(tmp_path / "index.sqlite")})
    v = schema.Interface(module="machinable", predicate={"a": 0, "b": 0})
    materialize_model(i, v)
    found = i.find(FindRequest(record_id_suffix=v.hash)).items
    assert len(found) == 1
    assert found[0].record_id == v.uuid

    v2 = schema.Interface(module="machinable-alt", predicate={"a": 0, "b": 0})
    materialize_model(i, v2)
    found2 = i.find(FindRequest(record_id_suffix=v2.hash)).items
    assert len(found2) == 1
    assert found2[0].record_id == v2.uuid

    v3 = schema.Interface(module="machinable", predicate={"a": 1})
    materialize_model(i, v3)

    by_hash = i.find(FindRequest(record_id_suffix=v.hash)).items
    assert {m.record_id for m in by_hash} == {v.uuid}


def test_index_find_related(tmp_path):
    i, v1, v2, v3, v4 = test_index_create_relation(tmp_path, setup=True)

    q = i.find_related("test_one", v1.uuid)
    assert len(q) == 1
    assert q[0].uuid == v2.uuid
    q = i.find_related("test_one", v2.uuid, inverse=True)
    assert len(q) == 1
    assert q[0].uuid == v1.uuid

    q = i.find_related("test_many", v1.uuid)
    assert len(q) == 3
    assert {v.uuid for v in q} == {v2.uuid, v3.uuid, v4.uuid}

    q = i.find_related("test_many", v2.uuid, inverse=True)
    assert len(q) == 1
    assert q[0].uuid == v1.uuid

    q = i.find_related("test_many_to_many", v1.uuid)
    assert len(q) == 2
    assert {v.uuid for v in q} == {v2.uuid, v3.uuid}

    q = i.find_related("test_many_to_many", v3.uuid, inverse=True)
    assert len(q) == 2
    assert {v.uuid for v in q} == {v1.uuid, v2.uuid}


def test_index_import_directory(tmp_storage, tmp_path):
    local_index = index.Index({"database": str(tmp_path / "local.sqlite")})
    remote_index = index.Index({"database": str(tmp_path / "remote.sqlite")})

    with remote_index, Storage(str(tmp_path / "remote")):
        a = Execution.make("dummy").launch()
        b = Execution.make("dummy", {"a": 2}, uses=a).launch()
        a_source_dir = a.local_directory()
        b_source_dir = b.local_directory()
        assert b.uses[0] == a

    with Storage(str(tmp_path / "local")):
        assert local_index.get_by_id(a.uuid) is None
        local_index.import_directory(a_source_dir, relations=False)
        local_index.import_directory(b_source_dir, file_importer=shutil.move)
        assert local_index.get_by_id(a.uuid) is not None
        assert local_index.get_by_id(b.uuid) is not None
        assert os.path.exists(local_index.local_directory(a.uuid))
        assert os.path.exists(local_index.local_directory(b.uuid))

        assert os.path.exists(a_source_dir)
        assert not os.path.exists(b_source_dir)

        assert local_index.find_related("Interface.Interface.using", b.uuid)

        with local_index:
            c = Execution.find_by_id(b.uuid)
            r = c.uses
            assert r[0] == a


def test_reindex_restores_catalog_and_relations(tmp_storage):
    rel = "Interface.Interface.using"
    i = tmp_storage

    a = Execution.make("dummy").launch()
    b = Execution.make("dummy", {"a": 2}, uses=a).launch()
    a_uuid, b_uuid = a.uuid, b.uuid
    a_dir, b_dir = a.local_directory(), b.local_directory()
    assert b.uses[0] == a

    # wipe the index cache; the storage directories remain the source of truth
    os.remove(i._resolved_database())
    assert i.get_by_id(a_uuid) is None

    # forward reference: ingest b (which points at a) BEFORE a is ingested
    i.ingest_directory(b_dir)
    assert i.get_by_id(b_uuid) is not None
    assert i.get_by_id(a_uuid) is None
    # the dangling edge is recorded but does not resolve yet
    assert i.find_related(rel, b_uuid) == []

    # ingest a; the edge now resolves automatically (no fix-up pass)
    i.ingest_directory(a_dir)
    related = i.find_related(rel, b_uuid)
    assert related is not None and any(m.uuid == a_uuid for m in related)

    # full reindex is idempotent and resolves local_directory()
    ingested = i.reindex()
    assert a_uuid in ingested and b_uuid in ingested
    assert os.path.isdir(i.local_directory(a_uuid))
    assert os.path.isdir(i.local_directory(b_uuid))


def test_created_by_attribution_and_filter(tmp_path):
    import getpass

    from machinable import Interface, Project

    proj = str(tmp_path / "p")
    shutil.copytree(
        "tests/samples/project",
        proj,
        ignore=shutil.ignore_patterns("storage", ".machinable.sqlite"),
    )

    # explicit username is captured at first materialization
    with Project(proj, username="bob"):
        a = Interface.make("basic").materialize()
        assert a.created_by == "bob"
        a_uuid = a.uuid

    # default attribution is the OS user
    with Project(proj):
        b = Interface.make("dummy").materialize()
        assert b.created_by == getpass.getuser()

    with Project(proj):
        idx = index.Index.get()
        # round-trips through the index column
        assert idx.get_by_id(a_uuid).created_by == "bob"
        # queryable filter
        found = idx.find(FindRequest(created_by="bob")).items
        assert a_uuid in {x.record_id for x in found}
        assert all(x.created_by == "bob" for x in found)

        # a different user reindexing the shared storage preserves the creator
        os.remove(idx._resolved_database())
        idx.reindex()
        assert idx.get_by_id(a_uuid).created_by == "bob"


def test_label_mutable_and_create_by_id(tmp_path):
    from machinable import Interface, Project

    proj = str(tmp_path / "p")
    shutil.copytree(
        "tests/samples/project",
        proj,
        ignore=shutil.ignore_patterns("storage", ".machinable.sqlite"),
    )

    with Project(proj):
        idx = index.Index.get()

        # create-by-id with a client-supplied content id, idempotent
        a = Interface.make("basic").materialize(record_id="fixedcontentid000000")
        assert a.uuid == "fixedcontentid000000"
        again = Interface.make("basic").materialize(record_id="fixedcontentid000000")
        assert again.uuid == a.uuid

        # label is mutable (config stays immutable) and persisted to the index
        a.set_label("first")
        assert idx.get_by_id(a.uuid).label == "first"
        a.set_label("renamed")
        assert idx.get_by_id(a.uuid).label == "renamed"

        # queryable by label
        found = idx.find(FindRequest(label="renamed")).items
        assert a.uuid in {x.record_id for x in found}

        # reindex preserves the latest label (round-trips via model.json)
        os.remove(idx._resolved_database())
        idx.reindex()
        assert idx.get_by_id(a.uuid).label == "renamed"


def test_search_config_operators(tmp_path):
    from machinable import Interface, Project
    from machinable.api.models import ConfigFilter, ConfigMatch, SortSpec

    proj = str(tmp_path / "p")
    shutil.copytree(
        "tests/samples/project",
        proj,
        ignore=shutil.ignore_patterns("storage", ".machinable.sqlite"),
    )

    with Project(proj):
        idx = index.Index.get()
        for i in (1, 2, 3):
            Interface.make("view", {"duration": i}).materialize()

        entries, total = idx.search(
            FindRequest(
                kind="Interface",
                config=ConfigMatch(
                    filters=[ConfigFilter(path="duration", op="gte", value=2)]
                ),
                sort=[
                    SortSpec(by="duration", config_layer="resolved", direction="asc")
                ],
            )
        )
        assert total == 2
        assert [e.config.resolved["duration"] for e in entries] == [2, 3]


def test_search_config_path_is_not_sql_injectable(tmp_path):
    """A quote/paren in a user-supplied config path must be bound, never interpolated
    into the SQL — otherwise it breaks out of the json_extract literal (injection)."""
    from machinable import Interface, Project
    from machinable.api.models import ConfigFilter, ConfigMatch

    proj = str(tmp_path / "p")
    shutil.copytree(
        "tests/samples/project",
        proj,
        ignore=shutil.ignore_patterns("storage", ".machinable.sqlite"),
    )

    with Project(proj):
        idx = index.Index.get()
        for i in (1, 2, 3):
            Interface.make("view", {"duration": i}).materialize()

        # a classic injection payload as the path: it must be rejected (invalid path
        # segment) rather than executed or silently returning every row.
        with pytest.raises(ValueError):
            idx.search(
                FindRequest(
                    kind="Interface",
                    config=ConfigMatch(
                        filters=[
                            ConfigFilter(path="duration') OR 1=1 --", op="eq", value=1)
                        ]
                    ),
                )
            )

        # a benign path with an operator still works and matches by value only
        entries, total = idx.search(
            FindRequest(
                kind="Interface",
                config=ConfigMatch(
                    filters=[ConfigFilter(path="duration", op="eq", value=1)]
                ),
            )
        )
        assert total == 1
