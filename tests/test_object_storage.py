"""Homes that are not directories: records in an in-memory ``mem://`` storage."""

import contextlib
import os
import shutil
import threading
import time

import pytest
from pydantic import BaseModel

from machinable import Execution, Index, Interface, Project, Storage, get
from machinable.claims import RELEASED, Claim
from tests.memory_storage import BUCKETS, MemoryStorage


class Job(Interface):
    class Config(BaseModel):
        size: int = 0
        seconds: float = 0.0
        tag: str = ""

    def __call__(self):
        print("running", self.config.tag)
        time.sleep(self.config.seconds)
        self.save_file("result.json", {"tag": self.config.tag})
        if self.config.size:
            self.save_file("big.txt", "x" * self.config.size)


@pytest.fixture()
def bucket(tmp_path, request):
    """A fresh bucket, a project, and a way to be one of several machines on it."""
    url = f"mem://{request.node.name}/lab"
    BUCKETS.pop(url, None)
    project = tmp_path / "project"
    shutil.copytree(
        "tests/samples/project", project, ignore=shutil.ignore_patterns("storage")
    )

    def machine(name: str = "a", **config):
        stack = contextlib.ExitStack()
        stack.enter_context(Project(str(project)))
        storage = stack.enter_context(
            MemoryStorage({"url": url, "directory": str(tmp_path / name), **config})
        )
        stack.enter_context(Index({"database": str(tmp_path / f"{name}.sqlite")}))
        return stack, storage

    yield {"url": url, "machine": machine, "tmp": tmp_path}
    BUCKETS.pop(url, None)


def _objects(url: str) -> dict[str, bytes]:
    return {k: v[0] for k, v in BUCKETS.get(url, {}).items()}


def _record(url: str, uuid: str) -> str:
    """The key prefix of the record ``uuid`` in the bucket."""
    for key, data in _objects(url).items():
        if key.endswith("/.machinable") and data.decode() == uuid:
            return key[: -len("/.machinable")]
    raise AssertionError(f"{uuid} is not in the bucket")


def test_locations_are_the_storages(bucket):
    stack, storage = bucket["machine"]()
    with stack:
        interface = get(Job, {"tag": "a"}).materialize()
        entry = Index.get().get_by_id(interface.uuid)
        assert entry is not None
        assert entry.storage_uri.startswith(bucket["url"] + "/")
        assert entry.local_uri is not None and entry.local_uri.startswith("file://")
        assert interface.local_directory().startswith(str(bucket["tmp"] / "a"))
        prefix = _record(bucket["url"], interface.uuid)
        assert {"id.json", "model.json", "updated_at"} <= {
            k[len(prefix) + 1 :]
            for k in _objects(bucket["url"])
            if k.startswith(prefix)
        }
        # the working copy mirrors the home's layout under the local directory
        assert storage.local_path(entry.storage_uri) == interface.local_directory()
        # new records are logged for sync
        assert any(
            k.startswith(".catalog/") and k.endswith(interface.uuid)
            for k in _objects(bucket["url"])
        )


def test_a_run_leaves_its_files_and_markers_in_the_home(bucket):
    stack, storage = bucket["machine"]()
    with stack:
        interface = get(Job, {"tag": "run"}).launch()
        run = interface.execution
        objects = _objects(bucket["url"])
        home = _record(bucket["url"], run.uuid)
        for name in (
            "id.json",
            "started_at",
            "heartbeat_at",
            "finished_at",
            "output.log",
        ):
            assert f"{home}/{name}" in objects, name
        parent = _record(bucket["url"], interface.uuid)
        assert objects[f"{parent}/cached"] == b"finished"
        assert f"{parent}/result.json" in objects
        # the claim is in the home and released
        claims = [k for k in objects if "/.claims/" in k]
        assert len(claims) == 1
        claim = Claim.from_bytes(objects[claims[0]])
        assert claim is not None and claim.state == RELEASED
        assert claim.record_id == run.uuid


def test_a_heartbeat_is_visible_in_the_home_while_the_run_is_live(bucket, monkeypatch):
    monkeypatch.setenv("MACHINABLE_HEARTBEAT_WINDOW", "1.2")
    stack, _ = bucket["machine"]()
    beats: list[bytes] = []
    with stack:
        interface = get(Job, {"seconds": 2.5})
        thread = threading.Thread(target=contextvars_run(interface.launch), daemon=True)
        thread.start()
        deadline = time.monotonic() + 2.4
        while time.monotonic() < deadline:
            for key, data in _objects(bucket["url"]).items():
                if key.endswith("/heartbeat_at") and data not in beats:
                    beats.append(data)
            time.sleep(0.05)
        thread.join()
        assert interface.cached()
        assert "finished_at" not in str(beats)
    # the first beat, then several more at most every half window
    assert 2 <= len(beats) <= 6


def contextvars_run(fn):
    import contextvars

    context = contextvars.copy_context()
    return lambda: context.run(fn)


def test_a_lost_working_copy_is_fetched_from_the_home(bucket):
    stack, _ = bucket["machine"]()
    with stack:
        interface = get(Job, {"tag": "kept"}).launch()
        uuid, run = interface.uuid, interface.execution.uuid
    shutil.rmtree(bucket["tmp"] / "a")
    os.remove(bucket["tmp"] / "a.sqlite")

    stack, storage = bucket["machine"]()
    with stack:
        assert Index.get().get_by_id(uuid) is None
        ingested = Index.get().reindex(storage)
        assert {uuid, run} <= set(ingested)
        found = Interface.find_by_id(uuid)
        assert found is not None and found.load_file("result.json") == {"tag": "kept"}
        execution = Interface.find_by_id(run)
        assert execution is not None and execution.is_finished()
        # dispatching again is a cache hit
        again = get(Job, {"tag": "kept"})
        assert again.uuid == uuid and again.cached()


def test_records_are_read_catalog_first_and_fetched_on_read(bucket):
    stack, _ = bucket["machine"]("a")
    with stack:
        interface = get(Job, {"size": 4096, "tag": "big"}).launch()
        uuid, run = interface.uuid, interface.execution.uuid

    stack, storage = bucket["machine"]("b", catalog_max_bytes=1024)
    with stack:
        ingested, position = storage.sync()
        assert {uuid, run} <= set(ingested) and position is not None
        assert storage.sync(position) == ([], position)
        entry = Index.get().get_by_id(uuid)
        assert entry is not None and entry.bytes_missing
        assert not any(r.endswith("big.txt") for r in storage.reads)
        found = Interface.find_by_id(uuid)
        assert found is not None
        assert found.load_file("result.json") == {"tag": "big"}
        assert found.load_file("big.txt") == "x" * 4096  # fetched on read
        assert sum(r.endswith("big.txt") for r in storage.reads) == 1
        refreshed = Index.get().get_by_id(uuid)
        assert refreshed is not None and not refreshed.bytes_missing

    stack, storage = bucket["machine"]("c", catalog_max_bytes=1024)
    with stack:
        storage.sync()
        found = Interface.find_by_id(uuid)
        assert found is not None and found.fetch()  # fetch() brings everything
        assert os.path.isfile(found.local_directory("big.txt"))
        refreshed = Index.get().get_by_id(uuid)
        assert refreshed is not None and not refreshed.bytes_missing


def test_machines_on_one_bucket_run_an_interface_once(bucket):
    results, errors = [], []
    barrier = threading.Barrier(3)
    calls = []

    class Once(Interface):
        def __call__(self):
            calls.append(1)
            time.sleep(0.5)
            self.save_file("result.json", {"ok": True})

    def machine(name):
        try:
            stack, _ = bucket["machine"](name)
            with stack:
                barrier.wait()
                interface = get(Once).launch()
                results.append(
                    (
                        interface.uuid,
                        interface.execution.uuid,
                        interface.cached(),
                        interface.load_file("result.json"),
                    )
                )
        except BaseException as ex:  # noqa: BLE001
            errors.append(ex)

    threads = [threading.Thread(target=machine, args=(n,)) for n in "abc"]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert not errors, errors
    assert len(calls) == 1
    assert len({r[0] for r in results}) == 1  # one interface id
    assert len({r[1] for r in results}) == 1  # one run-record id
    assert all(r[2] for r in results)
    assert all(r[3] == {"ok": True} for r in results)  # results read from the home
    runs = {
        k
        for k, v in _objects(bucket["url"]).items()
        if k.endswith("/id.json") and b'"Execution"' in v
    }
    assert len(runs) == 1


def test_a_resumed_run_pulls_its_working_copy(bucket):
    stack, _ = bucket["machine"]()
    with stack:
        interface = get(Job, {"tag": "resume"}).materialize()
        entry = Execution().prepare_dispatch(interface)
        run_directory = Index.get().working_directory(entry)
        shutil.rmtree(run_directory)
        interface.launch()
        assert interface.execution.uuid == entry.record_id  # resumed in place
        assert os.path.isfile(os.path.join(run_directory, "dispatched_at"))
        home = _record(bucket["url"], entry.record_id)
        assert f"{home}/finished_at" in _objects(bucket["url"])


def test_a_disk_home_with_a_memory_mirror(bucket, tmp_path):
    url = bucket["url"]
    with (
        Project(str(tmp_path / "project")),
        Index({"database": str(tmp_path / "m.sqlite")}),
        MemoryStorage({"url": url, "directory": str(tmp_path / "unused")}),
        Storage(str(tmp_path / "disk")),
    ):
        interface = get(Job, {"tag": "mirrored"}).launch()
        entry = Index.get().get_by_id(interface.uuid)
        assert entry is not None and entry.storage_uri.startswith("file://")
        # the mirror received the record and its results
        prefix = _record(url, interface.uuid)
        assert f"{prefix}/result.json" in _objects(url)
        # read from the mirror when the home lacks it
        shutil.rmtree(interface.local_directory())
        found = Interface.find_by_id(interface.uuid)
        assert found is not None and found.load_file("result.json") == {
            "tag": "mirrored"
        }


GATE = threading.Event()


class Gated(Interface):
    def __call__(self):
        GATE.wait(30)
        self.save_file("result.json", {"done": True})


def _working_copy(uuid: str) -> str:
    return Index.get().local_directory(uuid)


def test_a_sync_follows_a_run_to_its_end(bucket):
    GATE.clear()
    errors = []

    def machine_a():
        try:
            stack, _ = bucket["machine"]("a")
            with stack:
                get(Gated).launch()
        except BaseException as ex:  # noqa: BLE001
            errors.append(ex)

    thread = threading.Thread(target=machine_a)
    thread.start()
    try:
        deadline = time.monotonic() + 30
        while not any(k.endswith("/started_at") for k in _objects(bucket["url"])):
            assert time.monotonic() < deadline and not errors, errors
            time.sleep(0.02)

        stack, storage = bucket["machine"]("b")
        with stack:
            ingested, position = storage.sync()
            runs = [
                e
                for e in Index.get().entries_under(storage.root_uri(), "Execution")
                if e.record_id in ingested
            ]
            assert len(runs) == 1
            run = runs[0].record_id
            interface = cast_str(runs[0].parent_id)
            assert os.path.isfile(os.path.join(_working_copy(run), "started_at"))
            assert not os.path.exists(os.path.join(_working_copy(run), "finished_at"))
            # a run not finished costs its updated_at, and nothing else
            storage.reads.clear()
            assert storage.sync(position) == ([], position)
            assert storage.reads == [f"{_record(bucket['url'], run)}/updated_at"]

            GATE.set()
            thread.join()
            assert not errors, errors

            ingested, position = storage.sync(position)
            assert run in ingested and interface in ingested
            # finished here, with its results, without reading its status
            assert os.path.isfile(os.path.join(_working_copy(run), "finished_at"))
            assert os.path.isfile(os.path.join(_working_copy(interface), "cached"))
            with open(os.path.join(_working_copy(interface), "result.json")) as f:
                assert f.read().strip() == '{"done": true}'

            # settled records cost no reads
            storage.reads.clear()
            assert storage.sync(position) == ([], position)
            assert storage.reads == []
            found = Interface.find_by_id(interface)
            assert found is not None and found.cached()
    finally:
        GATE.set()
        thread.join()


def cast_str(value) -> str:
    assert isinstance(value, str)
    return value


def _on(bucket, name: str, fn):
    """Run ``fn()`` as machine ``name``, in a thread (a context) of its own."""
    result, errors = [], []

    def run():
        try:
            stack, _ = bucket["machine"](name)
            with stack:
                result.append(fn())
        except BaseException as ex:  # noqa: BLE001
            errors.append(ex)

    thread = threading.Thread(target=run)
    thread.start()
    thread.join()
    assert not errors, errors
    return result[0]


def test_a_sync_sees_an_interface_changed_elsewhere(bucket):
    uuid = _on(bucket, "a", lambda: get(Job, {"tag": "changing"}).launch().uuid)

    stack, storage = bucket["machine"]("b")
    with stack:
        _, position = storage.sync()
        assert not os.path.exists(os.path.join(_working_copy(uuid), "extra.json"))

        # A writes a result after the run, outside of it
        def change():
            found = Interface.find_by_id(uuid)
            assert found is not None
            found.save_file("extra.json", {"more": 1})
            found.save_file("extra.json", {"more": 2})

        _on(bucket, "a", change)

        storage.reads.clear()
        ingested, position = storage.sync(position)
        assert ingested == [uuid]
        found = Interface.find_by_id(uuid)
        assert found is not None and found.load_file("extra.json") == {"more": 2}
        # logged twice, read once (its catalog); the run did not change
        prefix = _record(bucket["url"], uuid)
        assert storage.reads.count(f"{prefix}/id.json") == 1
        assert storage.reads.count(f"{prefix}/updated_at") == 2  # compared, then read
        assert all(r.count("/") == prefix.count("/") + 1 for r in storage.reads)
        storage.reads.clear()
        assert storage.sync(position) == ([], position)
        assert storage.reads == []


def test_a_storage_can_be_followed(bucket):
    stack, storage = bucket["machine"]("b")
    with stack:
        with storage.follow(0.05) as following:
            uuid = _on(bucket, "a", lambda: get(Job, {"tag": "followed"}).launch().uuid)
            deadline = time.monotonic() + 30
            while not (
                (entry := Index.get().get_by_id(uuid)) is not None
                and os.path.isfile(os.path.join(_working_copy(uuid), "cached"))
            ):
                assert time.monotonic() < deadline, following.error
                time.sleep(0.02)
        assert entry is not None
        found = Interface.find_by_id(uuid)
        assert found is not None and found.cached()


def test_an_entry_logged_late_is_read(bucket):
    stack, storage = bucket["machine"]("b")
    with stack:
        _on(bucket, "a", lambda: get(Job, {"tag": "first"}).launch())
        _, position = storage.sync()
        uuid = _on(bucket, "a", lambda: get(Job, {"tag": "late"}).launch().uuid)
        # its entries come before the position (a writer whose clock is behind)
        objects = BUCKETS[bucket["url"]]
        late = sorted(
            k
            for k in objects
            if k.startswith(".catalog/") and k > ".catalog/" + position
        )
        assert late
        before = int(position.partition("-")[0]) - 10**9
        for i, key in enumerate(late):
            rest = key.partition("-")[2]
            objects[f".catalog/{before + i:020d}-{rest}"] = objects.pop(key)
        ingested, later = storage.sync(position)
        assert uuid in ingested and later == position
        assert Index.get().get_by_id(uuid) is not None
        assert storage.sync(later) == ([], later)


class Folder(Interface):
    def __call__(self):
        for name in ("one.txt", "two.txt", "sub/three.txt"):
            self.save_file(f"folder/{name}", name * 1024)
        self.save_file("folder/small.txt", "small")
        self.save_file("big.txt", "x" * 4096)


def test_a_folder_read_by_name_brings_its_missing_files(bucket):
    stack, _ = bucket["machine"]("a")
    with stack:
        uuid = get(Folder).launch().uuid

    stack, storage = bucket["machine"]("b", catalog_max_bytes=1024)
    with stack:
        storage.sync()
        found = Interface.find_by_id(uuid)
        assert found is not None
        # the folder is here with its small file only
        assert os.listdir(found.local_directory()) and os.path.isfile(
            os.path.join(_working_copy(uuid), "folder", "small.txt")
        )
        storage.reads.clear()
        folder = found.local_directory("folder")
        for name in ("one.txt", "two.txt", "sub/three.txt"):
            with open(os.path.join(folder, *name.split("/"))) as f:
                assert f.read() == name * 1024
        assert sorted(r.rsplit("/folder/", 1)[1] for r in storage.reads) == [
            "one.txt",
            "sub/three.txt",
            "two.txt",
        ]
        # big.txt is still missing; asking again reads nothing
        entry = Index.get().get_by_id(uuid)
        assert entry is not None and entry.bytes_missing
        storage.reads.clear()
        again = Interface.find_by_id(uuid)
        assert again is not None and again.local_directory("folder") == folder
        assert storage.reads == []
        # complete once the last file is here
        assert again.load_file("big.txt") == "x" * 4096
        entry = Index.get().get_by_id(uuid)
        assert entry is not None and not entry.bytes_missing
        # an ingest of a record that is all here keeps it complete
        assert storage.ingest(storage.handle(entry.storage_uri)) == uuid
        entry = Index.get().get_by_id(uuid)
        assert entry is not None and not entry.bytes_missing


def test_uses_finds_a_run_another_machine_made(bucket):
    from machinable.interface import resolve_uses

    stack, _ = bucket["machine"]("a")
    with stack:
        made = get(Job, {"tag": "sort"}).launch().uuid
    stack, _ = bucket["machine"]("b")
    with stack:
        assert Index.get().get_by_id(made) is None
        (used,) = resolve_uses([made])
        assert used.uuid == made and used.config.tag == "sort"
        assert used.load_file("result.json") == {"tag": "sort"}
        fit = get(Job, {"tag": "fit"}, uses=used).launch()
        assert [u.uuid for u in Interface.find_by_id(fit.uuid).uses] == [made]
