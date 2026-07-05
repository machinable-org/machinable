"""Format v1 contract tests: id.json header, updated_at marker, private
overlay, ingest-as-pure-copy, collision guard, and store migration."""

import os

import pytest

from machinable import Project, get, schema
from machinable.errors import IndexCollision, MachinableError
from machinable.format import (
    bump_updated_at,
    read_id,
    read_updated_at_ns,
    write_id,
)
from machinable.index import Index, materialize_keys_from_model
from machinable.utils import load_file, save_file


def _entry(idx, record_id):
    return idx.get_by_id(record_id)


def test_record_directory_is_format_v1(tmp_storage):
    interface = get("count").materialize()
    directory = interface.local_directory()

    # sentinel + header + model + sync marker
    assert os.path.isfile(os.path.join(directory, ".machinable"))
    header = read_id(directory)
    assert header is not None
    assert header["format"] == 1
    assert os.path.isfile(os.path.join(directory, "model.json"))
    assert read_updated_at_ns(directory) is not None

    # header matches the index row (single source of the keys)
    entry = _entry(tmp_storage, interface.uuid)
    assert header["uuid"] == entry.record_id
    assert header["kind"] == entry.kind
    assert header["identity_key"] == entry.identity_key
    assert header["predicate_key"] == entry.predicate_key
    assert header["parent"] == entry.parent_id

    # new records mint 12-char base62 ids
    assert len(interface.uuid) == 12


def test_ingest_is_pure_copy(tmp_storage, tmp_path):
    interface = get("count").materialize()
    interface.set_label("important")
    directory = interface.local_directory()
    original = _entry(tmp_storage, interface.uuid)

    # a fresh index over the same directory reproduces the row from disk alone
    with Index({"database": str(tmp_path / "other.sqlite")}) as other:
        record_id = other.ingest_directory(directory)
        assert record_id == interface.uuid
        copy = _entry(other, record_id)
        assert copy.identity_key == original.identity_key
        assert copy.predicate_key == original.predicate_key
        assert copy.parent_id == original.parent_id
        assert copy.kind == original.kind
        assert copy.module == original.module
        assert copy.label == "important"
        # updated_at column derives from the marker file, not ingestion time
        assert copy.updated_at_ns == read_updated_at_ns(directory)


def test_ingest_requires_id_json(tmp_storage, tmp_path):
    legacy = tmp_path / "legacy-record"
    legacy.mkdir()
    save_file([str(legacy), ".machinable"], "AbCdEf")
    save_file(
        [str(legacy), "model.json"],
        schema.Interface(module="test-a", uuid="AbCdEf"),
    )
    with pytest.raises(MachinableError, match="machinable migrate"):
        tmp_storage.ingest_directory(str(legacy))


def test_materialize_collision_guard(tmp_storage):
    interface = get("count").materialize()
    entry = _entry(tmp_storage, interface.uuid)

    # same record_id + same keys → idempotent reuse
    same = materialize_keys_from_model(
        schema.Interface(module=entry.module, uuid=entry.record_id),
        parent_id=entry.parent_id,
        identity_key=entry.identity_key,
        predicate=dict(entry.predicate),
        predicate_key=entry.predicate_key,
        record_id=entry.record_id,
    )
    response = tmp_storage.materialize(same)
    assert response.created is False

    # same record_id + different identity → loud failure, never a merge
    different = materialize_keys_from_model(
        schema.Interface(module="something-else", uuid=entry.record_id),
        parent_id=entry.parent_id,
        identity_key="deadbeefdeadbeefdeadbeef",
        predicate={},
        predicate_key=entry.predicate_key,
        record_id=entry.record_id,
    )
    with pytest.raises(IndexCollision):
        tmp_storage.materialize(different)


def test_hidden_is_private_overlay(tmp_storage, tmp_path):
    interface = get("count").materialize()
    directory = interface.local_directory()

    assert interface.hidden() is False
    interface.hidden(True, reason="wip")
    # per-person state: index-only, never written to the record directory
    assert not os.path.isfile(os.path.join(directory, "hidden"))
    assert interface.hidden() is True
    entry = _entry(tmp_storage, interface.uuid)
    assert entry.hidden is True
    assert entry.private.get("hidden_reason") == "wip"

    # overlay survives re-ingest of the record
    tmp_storage.ingest_directory(directory)
    entry = _entry(tmp_storage, interface.uuid)
    assert entry.hidden is True
    assert entry.private.get("hidden_reason") == "wip"

    # ...but does not travel: a fresh index sees the record unhidden
    with Index({"database": str(tmp_path / "other.sqlite")}) as other:
        other.ingest_directory(directory)
        assert _entry(other, interface.uuid).hidden is False

    interface.hidden(False)
    assert interface.hidden() is False
    entry = _entry(tmp_storage, interface.uuid)
    assert entry.hidden is False
    assert "hidden_reason" not in entry.private


def test_set_private_merge_semantics(tmp_storage):
    interface = get("count").materialize()
    tmp_storage.set_private(interface.uuid, {"captu": {"star": True}})
    tmp_storage.set_private(interface.uuid, {"note": "check later"})
    private = tmp_storage.get_private(interface.uuid)
    assert private == {"captu": {"star": True}, "note": "check later"}
    tmp_storage.set_private(interface.uuid, {"note": None})
    assert "note" not in tmp_storage.get_private(interface.uuid)
    tmp_storage.set_private(interface.uuid, {"only": 1}, merge=False)
    assert tmp_storage.get_private(interface.uuid) == {"only": 1}


def test_touch_updates_marker_and_index(tmp_storage):
    interface = get("count").materialize()
    directory = interface.local_directory()
    before_ns = read_updated_at_ns(directory)

    interface._last_touch_sync = 0.0  # defeat the write-through debounce
    interface.touch()
    after_ns = read_updated_at_ns(directory)
    assert after_ns >= before_ns
    assert _entry(tmp_storage, interface.uuid).updated_at_ns == after_ns

    # official mutating APIs bump the marker automatically
    interface.save_file("artifact.txt", "data")
    assert read_updated_at_ns(directory) >= after_ns


def test_migrate_store(tmp_path):
    from machinable.migrate import migrate_store

    store = tmp_path / "legacy-store"
    record = store / "some" / "nested" / "record"
    record.mkdir(parents=True)
    model = schema.Interface(module="test-a", uuid="Abc123")
    save_file([str(record), ".machinable"], model.uuid)
    save_file([str(record), "model.json"], model)
    save_file([str(record), "hidden"], "wip")

    summary = migrate_store(str(store))
    assert summary["upgraded"] == 1
    assert summary["reindexed"] == 1
    assert summary["hidden"] == 1

    header = read_id(str(record))
    assert header is not None
    assert header["uuid"] == "Abc123"
    assert header["format"] == 1
    assert read_updated_at_ns(str(record)) is not None
    # the legacy hidden marker file is folded into the overlay and removed
    assert not os.path.isfile(os.path.join(str(record), "hidden"))

    with Project(str(tmp_path)), Index() as idx:
        entry = _entry(idx, "Abc123")
        assert entry is not None
        assert entry.hidden is True
        assert entry.private.get("hidden_reason") == "wip"

    # idempotent: a second run upgrades nothing further
    summary = migrate_store(str(store))
    assert summary["upgraded"] == 0
    assert summary["already_v1"] == 1


def test_format_helpers_roundtrip(tmp_path):
    directory = str(tmp_path / "rec")
    os.makedirs(directory)
    write_id(
        directory,
        uuid="XyZ123AbCdEf",
        kind="Interface",
        identity_key="a" * 24,
        predicate_key="b" * 32,
        parent=None,
    )
    header = read_id(directory)
    assert header["uuid"] == "XyZ123AbCdEf"
    assert header["parent"] is None
    assert load_file([directory, "id.json"])["format"] == 1

    bump_updated_at(directory)
    assert read_updated_at_ns(directory) is not None
