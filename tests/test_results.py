"""Results as files: results.json, the four kinds, reading them elsewhere and live."""

import contextlib
import json
import os
import shutil
import sys
import threading

import numpy as np
import pytest
from pydantic import BaseModel

from machinable import Index, Interface, Project, get, result
from machinable import results as R
from tests.memory_storage import BUCKETS, MemoryStorage

TEMPLATES = np.arange(7 * 5 * 3, dtype="float32").reshape(7, 5, 3) / 4
TRAINS = [np.arange(i * 3, dtype="int64") + 10 * i for i in range(7)]


def _units(n: int = 7, start: int = 0) -> dict:
    ids = np.arange(start, start + n)
    return {
        "unit_id": ids.astype("int64"),
        "snr": ids / 2,
        "label": np.array([f"u{i}" for i in ids]),
        "good": ids % 2 == 0,
    }


class Sort(Interface):
    class Config(BaseModel):
        tag: str = ""

    def __call__(self):
        self.save_result(
            "summary", {"units": 7, "sorter": "fake", "tag": self.config.tag}
        )
        self.save_result("units", _units(), units={"snr": "1"})
        self.save_result(
            "templates", TEMPLATES, chunks=[1, 5, 3], dims=["unit", "sample", "channel"]
        )
        self.save_result("spike_trains", TRAINS, chunks=4, index="unit")

    @result
    def peak(self):
        return {"channel": 2}


def test_each_kind_round_trips(tmp_storage):
    sort = get(Sort, {"tag": "a"}).launch()
    manifest = sort.results_manifest()
    assert manifest is not None and manifest["complete"] is True
    assert manifest["run"] == sort.execution.uuid
    assert set(manifest["results"]) == {
        "summary",
        "units",
        "templates",
        "spike_trains",
        "peak",
    }
    assert sort.result("summary") == {"units": 7, "sorter": "fake", "tag": "a"}
    assert sort.result("peak") == {"channel": 2} and sort.peak() == {"channel": 2}
    units = sort.result("units")
    assert list(units) == ["unit_id", "snr", "label", "good"]
    for name, column in _units().items():
        assert units[name].tolist() == column.tolist()
    entry = manifest["results"]["units"]
    assert entry["rows"] == 7
    assert entry["columns"][1] == {"name": "snr", "dtype": "float64", "units": "1"}
    templates = sort.result("templates")
    assert templates.shape == (7, 5, 3) and templates.dims == [
        "unit",
        "sample",
        "channel",
    ]
    assert np.array_equal(templates[3], TEMPLATES[3])
    assert np.array_equal(templates[2:5], TEMPLATES[2:5])
    assert np.array_equal(np.asarray(templates), TEMPLATES)
    trains = sort.result("spike_trains")
    assert len(trains) == 7 and trains[0].size == 0
    assert all(np.array_equal(trains[i], TRAINS[i]) for i in range(7))
    assert sort.result("missing", "none") == "none"
    # all of it under results/, declared by file
    for described in manifest["results"].values():
        assert described["file"].startswith("results/")
        assert os.path.exists(sort.local_directory(described["file"]))


def test_appending_and_replacing(tmp_storage):
    interface = get(Interface).launch()
    interface.save_result("units", _units(3), chunks=2)
    interface.save_result("units", _units(2, start=3), append=True)
    interface.save_result("trains", TRAINS[:3], chunks=2)
    interface.save_result("trains", TRAINS[3:], append=True)
    interface.save_result("templates", TEMPLATES[:3], chunks=2)
    interface.save_result("templates", TEMPLATES[3:], append=True)
    assert interface.result("units")["unit_id"].tolist() == [0, 1, 2, 3, 4]
    assert interface.result("units")["label"].tolist() == ["u0", "u1", "u2", "u3", "u4"]
    assert [t.tolist() for t in interface.result("trains")] == [
        t.tolist() for t in TRAINS
    ]
    assert np.array_equal(interface.result("templates").read(), TEMPLATES)

    old = interface.results_manifest()["results"]["templates"]["file"]
    interface.save_result("templates", TEMPLATES[:1])
    new = interface.results_manifest()["results"]["templates"]["file"]
    # a replaced result is written anew and the old files go
    assert new != old and not os.path.exists(interface.local_directory(old))
    assert interface.result("templates").shape == (1, 5, 3)

    with pytest.raises(R.ResultError):
        interface.save_result("units", {"other": np.zeros(1)}, append=True)
    with pytest.raises(R.ResultError):
        interface.save_result("summary", {"x": float("nan")})
    with pytest.raises(R.ResultError):
        interface.save_result("bad name", 1)


NAMES = ["a", "b"]


class Rerun(Interface):
    def __call__(self):
        for name in NAMES:
            self.save_result(name, {"name": name})


def test_a_new_run_replaces_the_last_runs_results(tmp_storage):
    NAMES[:] = ["a", "b"]
    interface = get(Rerun).launch()
    first = interface.results_manifest()
    assert set(first["results"]) == {"a", "b"}
    interface.cached(False)
    NAMES[:] = ["b"]
    interface.launch()
    second = interface.results_manifest()
    assert second["run"] != first["run"] and set(second["results"]) == {"b"}
    assert not os.path.exists(interface.local_directory(first["results"]["a"]["file"]))


def test_written_outside_a_run_and_completed_by_hand(tmp_storage):
    interface = get(Interface).launch()
    interface.save_result("x", [1, 2])
    assert interface.results_manifest()["complete"] is True
    assert interface.results_complete(False) is True
    assert interface.results_manifest()["complete"] is False
    assert interface.results_complete(False) is False


def test_arrays_read_by_zarr_readers_conventions(tmp_path):
    """The files are zarr v3: metadata and chunk keys as any zarr reader expects."""
    directory = str(tmp_path)
    R.save(directory, "a", TEMPLATES, chunks=[2, 5, 3], compression="gzip")
    entry = R.read_manifest(directory)["results"]["a"]
    meta = json.load(open(os.path.join(directory, entry["file"], "zarr.json")))
    assert meta["zarr_format"] == 3 and meta["node_type"] == "array"
    assert meta["codecs"][0] == {"name": "bytes", "configuration": {"endian": "little"}}
    assert meta["codecs"][1]["name"] == "gzip"
    assert sorted(os.listdir(os.path.join(directory, entry["file"], "c"))) == [
        "0",
        "1",
        "2",
        "3",
    ]
    assert os.path.isfile(os.path.join(directory, entry["file"], "c", "3", "0", "0"))
    zarr = pytest.importorskip("zarr")
    assert np.array_equal(
        zarr.open_array(os.path.join(directory, entry["file"]))[:], TEMPLATES
    )


def test_stale_chunks_of_a_cached_copy():
    old = {
        "results": {
            "a": {"kind": "array", "file": "results/a.x.zarr", "shape": [5, 2]},
            "b": {"kind": "json", "file": "results/b.x.json"},
        }
    }
    new = {
        "results": {
            "a": {"kind": "array", "file": "results/a.x.zarr", "shape": [9, 2]},
            "b": {"kind": "json", "file": "results/b.y.json"},
        }
    }
    import tempfile

    with tempfile.TemporaryDirectory() as directory:
        meta = R.array_metadata([5, 2], "int64", [2, 2])
        R.ZarrArray(directory, "results/a.x.zarr").write_meta(meta)
        for name in ("c/0/0", "c/1/0", "c/2/0"):
            R._write_bytes(os.path.join(directory, "results/a.x.zarr", name), b"x")
        R._write_bytes(os.path.join(directory, "results/b.x.json"), b"1")
        stale = R.stale_files(directory, old, new)
    # rows 0-3 were whole chunks; chunk 2 held row 4 of then 5
    assert sorted(stale) == [
        "results/a.x.zarr/c/2/0",
        "results/a.x.zarr/zarr.json",
        "results/b.x.json",
    ]


def _bytes_on_disk(directory: str) -> int:
    return sum(
        os.path.getsize(os.path.join(path, name))
        for path, _, names in os.walk(directory)
        for name in names
    )


def _chunk_rows(directory: str, file: str) -> int:
    meta = json.load(open(os.path.join(directory, file, "zarr.json")))
    return meta["chunk_grid"]["configuration"]["chunk_shape"][0]


def test_small_results_stay_small(tmp_path):
    """A chunk is written whole (padded), so a fresh write fits it to the data."""
    small = {f"x{i}": np.arange(23, dtype="float64") for i in range(8)}
    small["label"] = np.array(["good"] * 23)
    small["good"] = np.ones(23, dtype=bool)
    table, ragged, array = (str(tmp_path / n) for n in ("table", "ragged", "array"))
    R.save(table, "units", small)
    R.save(ragged, "trains", [np.arange(n, dtype="int64") for n in range(23)])
    R.save(array, "peaks", np.arange(23, dtype="float32"))
    # 23 rows of 10 columns: 64-row chunks, the metadata the larger part
    assert _bytes_on_disk(table) < 12_000
    assert _bytes_on_disk(ragged) < 6_000
    assert _bytes_on_disk(array) < 2_000
    entry = R.read_manifest(table)["results"]["units"]
    assert _chunk_rows(table, f"{entry['file']}/x0") == R.MIN_ROWS_PER_CHUNK
    entry = R.read_manifest(ragged)["results"]["trains"]
    assert _chunk_rows(ragged, f"{entry['file']}/values") == 256  # 253 values
    assert _chunk_rows(ragged, f"{entry['file']}/offsets") == 64  # 24 offsets
    read = R.read(table, R.read_manifest(table)["results"]["units"])
    assert list(read["label"]) == ["good"] * 23


def test_a_large_table_chunks_at_the_default(tmp_path):
    directory = str(tmp_path)
    R.save(directory, "big", {"x": np.arange(R.ROWS_PER_CHUNK * 2 + 5)})
    entry = R.read_manifest(directory)["results"]["big"]
    assert _chunk_rows(directory, f"{entry['file']}/x") == R.ROWS_PER_CHUNK
    assert sorted(os.listdir(os.path.join(directory, entry["file"], "x", "c"))) == [
        "0",
        "1",
        "2",
    ]
    assert R.read(directory, entry)["x"][-1] == R.ROWS_PER_CHUNK * 2 + 4


def test_live_results_keep_a_chunk_to_grow_into(tmp_path):
    directory = str(tmp_path)
    for start in range(0, 10_000, 1000):
        R.save(directory, "units", _units(1000, start), append=True)
        R.save(directory, "trains", TRAINS, append=True)
    manifest = R.read_manifest(directory)
    units, trains = manifest["results"]["units"], manifest["results"]["trains"]
    assert _chunk_rows(directory, f"{units['file']}/unit_id") == R.LIVE_ROWS_PER_CHUNK
    assert _chunk_rows(directory, f"{trains['file']}/values") == R.LIVE_ROWS_PER_CHUNK
    column = os.path.join(directory, units["file"], "unit_id", "c")
    assert sorted(os.listdir(column)) == ["0", "1", "2"]  # 10000 rows, 4096 a chunk
    table = R.read(directory, units)
    assert table["unit_id"].tolist() == list(range(10_000))
    assert len(R.read(directory, trains)) == 70
    # an append past a chunk boundary leaves the chunks before it as they were
    before = dict(manifest)
    R.save(directory, "units", _units(5000, 10_000), append=True)
    after = R.read_manifest(directory)
    stale = R.stale_files(directory, before, after)
    prefix = f"{units['file']}/unit_id/"
    assert sorted(n[len(prefix) :] for n in stale if n.startswith(prefix)) == [
        "c/2",
        "c/3",
        "zarr.json",
    ]


def test_a_fresh_small_result_still_takes_appends(tmp_path):
    directory = str(tmp_path)
    R.save(directory, "units", _units(3))
    R.save(directory, "units", _units(200, 3), append=True)
    entry = R.read_manifest(directory)["results"]["units"]
    assert _chunk_rows(directory, f"{entry['file']}/unit_id") == R.MIN_ROWS_PER_CHUNK
    assert R.read(directory, entry)["unit_id"].tolist() == list(range(203))


# -- another machine, a remote home -------------------------------------------------


@pytest.fixture()
def bucket(tmp_path, request):
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

    yield {"url": url, "machine": machine, "tmp": tmp_path, "project": project}
    BUCKETS.pop(url, None)


def _on(bucket, name: str, fn):
    """Run ``fn()`` as machine ``name``, in a thread (a context) of its own."""
    out, errors = [], []

    def run():
        try:
            stack, _ = bucket["machine"](name)
            with stack:
                out.append(fn())
        except BaseException as ex:  # noqa: BLE001
            errors.append(ex)

    thread = threading.Thread(target=run)
    thread.start()
    thread.join()
    assert not errors, errors
    return out[0]


def test_another_machine_reads_only_what_it_reads(bucket):
    uuid = _on(bucket, "a", lambda: get(Sort, {"tag": "far"}).launch().uuid)

    stack, storage = bucket["machine"]("b")
    with stack:
        storage.sync()
        # the catalog: the manifest and the json results, no tables or arrays
        assert any(r.endswith("/results.json") for r in storage.reads)
        assert not any(".zarr/" in r for r in storage.reads)
        found = Interface.find_by_id(uuid)
        assert found is not None
        assert Index.get().get_by_id(uuid).bytes_missing
        assert found.result("summary")["tag"] == "far"
        assert not any(".zarr/" in r for r in storage.reads)

        storage.reads.clear()
        templates = found.result("templates")
        assert np.array_equal(templates[3], TEMPLATES[3])
        # its zarr.json and the one chunk of item 3
        assert sorted(r.split(".zarr/")[1] for r in storage.reads) == [
            "c/3/0/0",
            "zarr.json",
        ]
        storage.reads.clear()
        assert np.array_equal(templates[3], TEMPLATES[3])
        assert storage.reads == []

        storage.reads.clear()
        trains = found.result("spike_trains")
        assert np.array_equal(trains[6], TRAINS[6])
        reads = sorted(r.split(".zarr/")[1] for r in storage.reads)
        assert "values/c/0" not in reads  # item 6 is values 45-62
        assert {"offsets/zarr.json", "values/zarr.json"} <= set(reads)
        assert found.result("units")["label"].tolist() == [f"u{i}" for i in range(7)]


LIVE = threading.Event()
STEP = threading.Event()


class Live(Interface):
    def __call__(self):
        self.save_result("units", _units(3), chunks=2)
        self.save_result("trains", TRAINS[:3], chunks=4)
        STEP.set()
        LIVE.wait(30)
        self.save_result("units", _units(3, start=3), append=True)
        self.save_result("trains", TRAINS[3:5], append=True)


def test_live_appends_are_seen_after_a_sync(bucket):
    LIVE.clear()
    STEP.clear()
    errors = []

    def machine_a():
        try:
            stack, _ = bucket["machine"]("a")
            with stack:
                get(Live).launch()
        except BaseException as ex:  # noqa: BLE001
            errors.append(ex)

    thread = threading.Thread(target=machine_a)
    thread.start()
    try:
        assert STEP.wait(30), errors
        stack, storage = bucket["machine"]("b")
        with stack:
            ingested, position = storage.sync()
            interfaces = [
                u
                for u in ingested
                if (e := Index.get().get_by_id(u)) is not None
                and e.kind == "Interface"
                and e.module != "machinable.project"
            ]
            found = None
            for uuid in interfaces:
                candidate = Interface.find_by_id(uuid)
                if candidate is not None and candidate.results_manifest():
                    found = candidate
            assert found is not None
            manifest = found.results_manifest()
            assert manifest["complete"] is False
            assert found.result("units")["unit_id"].tolist() == [0, 1, 2]
            assert len(found.result("trains")) == 3

            LIVE.set()
            thread.join()
            assert not errors, errors

            storage.sync(position)
            found = Interface.find_by_id(found.uuid)
            assert found is not None
            manifest = found.results_manifest()
            assert manifest["complete"] is True
            # the chunk that held row 2 of 3 was read again; rows 0-1 were kept
            assert found.result("units")["unit_id"].tolist() == [0, 1, 2, 3, 4, 5]
            assert found.result("units")["label"].tolist()[-1] == "u5"
            trains = found.result("trains")
            assert [t.tolist() for t in trains] == [t.tolist() for t in TRAINS[:5]]
    finally:
        LIVE.set()
        thread.join()


# -- the server ---------------------------------------------------------------------

SORTER = """
import numpy as np
from machinable import Interface


class Sorter(Interface):
    def __call__(self):
        self.save_result("summary", {"units": 2})
        self.save_result(
            "units", {"unit_id": np.array([4, 9]), "snr": np.array([1.5, float("nan")])}
        )
        templates = np.arange(24, dtype="float32").reshape(2, 4, 3)
        self.save_result("templates", templates, chunks=[1, 4, 3])
        self.save_result("spike_trains", [np.array([1, 2, 3]), np.array([7])])
"""


def test_the_server_serves_results_of_a_module_it_lacks(tmp_storage):
    pytest.importorskip("fastapi")
    from fastapi.testclient import TestClient

    from machinable.api.app import create_app
    from machinable.server import Server

    project = Project.get().path()
    with open(os.path.join(project, "absent_sorter.py"), "w") as f:
        f.write(SORTER)
    interface = Interface.make("absent_sorter").launch()
    run = interface.execution.uuid
    os.remove(os.path.join(project, "absent_sorter.py"))
    sys.modules.pop("absent_sorter", None)

    app = create_app(
        project_dir=project, ambient_connections=Server._ambient_connections()
    )
    with TestClient(app) as client:
        manifest = client.get(f"/v1/executions/{run}/results").json()
        assert manifest["uuid"] == interface.uuid and manifest["complete"] is True
        assert set(manifest["results"]) == {
            "summary",
            "units",
            "templates",
            "spike_trains",
        }
        assert client.get(f"/v1/executions/{interface.uuid}/results").json() == manifest

        def read(name, **params):
            response = client.get(f"/v1/executions/{run}/results/{name}", params=params)
            assert response.status_code == 200, response.text
            return response.json()

        assert read("summary")["value"] == {"units": 2}
        units = read("units")
        assert units["data"] == {"unit_id": [4, 9], "snr": [1.5, None]}
        assert read("units", start=1)["data"] == {"unit_id": [9], "snr": [None]}
        item = read("templates", item=1)
        assert item["item"] == 1 and item["data"][0] == [12.0, 13.0, 14.0]
        assert read("templates", start=0, stop=1)["data"][0][3] == [9.0, 10.0, 11.0]
        assert read("spike_trains", item=-1)["data"] == [7]
        assert read("spike_trains")["data"] == [[1, 2, 3], [7]]
        assert client.get(f"/v1/executions/{run}/results/nope").status_code == 404
        response = client.get(
            f"/v1/executions/{run}/results/templates", params={"item": 5}
        )
        assert response.status_code == 404
        assert client.get("/v1/executions/nothere/results").status_code == 404

        with client.websocket_connect(
            f"/v1/executions/{run}/results/ws?interval=0.2"
        ) as socket:
            frame = json.loads(socket.receive_text())
            assert frame["type"] == "results" and frame["uuid"] == interface.uuid
            assert frame["manifest"]["complete"] is True
            # the interface's code is gone here too: change it as a writer would
            R.set_complete(Index.get().local_directory(interface.uuid), False)
            frame = json.loads(socket.receive_text())
            assert frame["manifest"]["complete"] is False
    assert "absent_sorter" not in sys.modules


def test_the_server_reads_chunks_from_a_remote_home(bucket):
    pytest.importorskip("fastapi")
    from fastapi.testclient import TestClient

    from machinable.api.app import create_app
    from machinable.server import Server

    uuid = _on(bucket, "a", lambda: get(Sort, {"tag": "served"}).launch().uuid)
    stack, storage = bucket["machine"]("b")
    with stack:
        storage.sync()
        app = create_app(
            project_dir=str(bucket["project"]),
            ambient_connections=Server._ambient_connections(),
        )
        with TestClient(app) as client:
            storage.reads.clear()
            response = client.get(
                f"/v1/executions/{uuid}/results/templates", params={"item": 2}
            )
            assert response.status_code == 200, response.text
            assert response.json()["data"] == TEMPLATES[2].tolist()
        # a server's storage is its own instance; the bucket saw the chunk read
        objects = BUCKETS[bucket["url"]]
        assert any(k.endswith("/c/2/0/0") for k in objects)
        local = Index.get().local_directory(uuid)
        entry = R.read_manifest(local)["results"]["templates"]
        chunks = os.listdir(os.path.join(local, entry["file"], "c"))
        assert chunks == ["2"]
