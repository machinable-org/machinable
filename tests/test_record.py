from machinable import Component, Record, Storage


def test_record(tmp_path):
    component = Component("test")
    component.__model__._storage_instance = Storage.make(
        "machinable.storage.filesystem",
        {"directory": str(tmp_path)},
    )
    component.__model__._storage_id = str(tmp_path)

    record = Record(component)
    assert record.scope == "default"
    assert record.current == {}
    assert record.last is None
    assert record.empty()
    record["test"] = 1
    assert not record.empty()
    record.write("test", 2)
    assert record["test"] == 2
    record.update({"test": 3}, floaty=1.0)
    assert record["test"] == 3
    assert record["floaty"] == 1.0
    assert len(record) == 2
    del record["floaty"]
    assert len(record) == 1
    record.save()
    assert (
        record.last["test"]
        == component.load_file("records/default.jsonl")[0]["test"]
    )
