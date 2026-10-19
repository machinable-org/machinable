"""S3 against moto's S3 server (in this process) and MinIO (when Docker runs)."""

import json
import os
import shutil
import signal
import subprocess
import sys
import threading
import time
import uuid

import pytest

obstore = pytest.importorskip("obstore")
moto_server = pytest.importorskip("moto.server")
boto3 = pytest.importorskip("boto3")

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from s3 import S3  # noqa: E402

from machinable import Index, Interface, Project, get  # noqa: E402

# minio/minio is no longer on Docker Hub; bitnami's build of the same release
MINIO = os.environ.get("MACHINABLE_S3_TEST_MINIO", "bitnamilegacy/minio:2025.4.22")
KEY, SECRET = "testing", "testing-secret"

JOB = """
import os
import time

from pydantic import BaseModel

from machinable import Interface


class SharedJob(Interface):
    class Config(BaseModel):
        counter: str = ""
        seconds: float = 0.0
        hang: str = ""
        size: int = 0
        folder: int = 0

    def __call__(self):
        print("running")
        if self.config.counter:
            with open(self.config.counter, "a") as f:
                f.write(f"{os.getpid()}\\n")
        deadline = time.monotonic() + self.config.seconds
        while time.monotonic() < deadline or (
            self.config.hang and os.path.exists(self.config.hang)
        ):
            time.sleep(0.05)
        self.save_file("result.json", {"pid": os.getpid()})
        if self.config.size:
            with open(self.local_directory("big.bin"), "wb") as f:
                f.truncate(self.config.size)
        for i in range(self.config.folder):
            os.makedirs(self.local_directory("folder"), exist_ok=True)
            with open(self.local_directory(f"folder/part{i}.bin"), "wb") as f:
                f.truncate(4096)
        if self.config.folder:
            self.save_file("folder/small.json", {"parts": self.config.folder})
"""

WORKER = """
import json
import sys

sys.path.insert(0, {here!r})

from machinable import Execution, Index, Project, get
from machinable.utils import load_file
from s3 import S3

project, settings, config, out, wait = sys.argv[1:6]
with (
    Project(project),
    Index({{"database": project + "/index.sqlite"}}),
    S3(dict(json.loads(settings), directory=project + "/storage")),
):
    interface = get("shared_job", json.loads(config))
    execution = Execution().wait_elsewhere(wait == "wait")
    with execution:
        interface.launch()
    run = interface.execution if interface.cached() else None
    result = {{
        "interface": interface.uuid,
        "cached": load_file(interface.local_directory("cached"), None),
        "run": run.uuid if run is not None and run.is_materialized() else None,
        "result": interface.load_file("result.json", None),
        "elsewhere": execution.elsewhere,
    }}
with open(out, "w") as f:
    json.dump(result, f)
"""


def _moto():
    server = moto_server.ThreadedMotoServer(
        ip_address="127.0.0.1", port=0, verbose=False
    )
    server.start()
    try:
        yield f"http://127.0.0.1:{server.get_host_and_port()[1]}"
    finally:
        server.stop()


def _minio():
    if shutil.which("docker") is None:
        pytest.skip("MinIO needs Docker")
    if subprocess.run(["docker", "info"], capture_output=True).returncode != 0:
        pytest.skip("Docker is not running")
    name = f"machinable-minio-{uuid.uuid4().hex[:8]}"
    started = subprocess.run(
        [
            "docker",
            "run",
            "-d",
            "--rm",
            "--name",
            name,
            "-p",
            "127.0.0.1::9000",
            "-e",
            f"MINIO_ROOT_USER={KEY}",
            "-e",
            f"MINIO_ROOT_PASSWORD={SECRET}",
            MINIO,
            *([] if "bitnami" in MINIO else ["server", "/data"]),
        ],
        capture_output=True,
        text=True,
    )
    if started.returncode != 0:
        pytest.skip(f"MinIO did not start: {started.stderr.strip()}")
    try:
        port = (
            subprocess.run(
                ["docker", "port", name, "9000"], capture_output=True, text=True
            )
            .stdout.split(":")[-1]
            .strip()
        )
        endpoint = f"http://127.0.0.1:{port}"
        client = _client(endpoint)
        deadline = time.monotonic() + 60
        while True:
            try:
                client.list_buckets()
                break
            except Exception:
                if time.monotonic() > deadline:
                    raise
                time.sleep(0.5)
        yield endpoint
    finally:
        subprocess.run(["docker", "rm", "-f", name], capture_output=True)


def _client(endpoint):
    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        region_name="us-east-1",
        aws_access_key_id=KEY,
        aws_secret_access_key=SECRET,
    )


@pytest.fixture(scope="module", params=["moto", "minio"])
def endpoint(request):
    yield from (_moto() if request.param == "moto" else _minio())


@pytest.fixture()
def bucket(endpoint):
    name = f"machinable-{uuid.uuid4().hex[:12]}"
    _client(endpoint).create_bucket(Bucket=name)
    return {
        "url": f"s3://{name}/lab/machinable",
        "endpoint": endpoint,
        "region": "us-east-1",
        "access_key_id": KEY,
        "secret_access_key": SECRET,
    }


@pytest.fixture()
def machines(tmp_path, bucket, monkeypatch):
    projects = []
    for name in "abcd":
        project = tmp_path / name / "proj"
        project.mkdir(parents=True)
        (project / "shared_job.py").write_text(JOB)
        projects.append(str(project))
    worker = tmp_path / "worker.py"
    worker.write_text(WORKER.format(here=HERE))
    monkeypatch.setenv("MACHINABLE_HEARTBEAT_WINDOW", "3")
    env = dict(os.environ, AWS_EC2_METADATA_DISABLED="true")

    def start(project: str, config: dict, out: str, wait: bool = True):
        return subprocess.Popen(
            [
                sys.executable,
                str(worker),
                project,
                json.dumps(bucket),
                json.dumps(config),
                out,
                "wait" if wait else "nowait",
            ],
            env=env,
            cwd=project,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )

    def connect(project: str, **settings):
        """Enter one machine (in this process)."""
        import contextlib

        stack = contextlib.ExitStack()
        stack.enter_context(Project(project))
        stack.enter_context(Index({"database": project + "/index.sqlite"}))
        storage = stack.enter_context(
            S3(dict(bucket, directory=project + "/storage", **settings))
        )
        return stack, storage

    return {
        "projects": projects,
        "start": start,
        "connect": connect,
        "tmp": tmp_path,
        "bucket": bucket,
    }


def _objects(bucket: dict) -> dict[str, int]:
    """Every object under the bucket's prefix: key -> size."""
    storage = S3(bucket)
    return {m["path"]: m["size"] for b in obstore.list(storage.store) for m in b}


def _get(bucket: dict, key: str) -> bytes:
    return bytes(obstore.get(S3(bucket).store, key).bytes())


def _runs_in(bucket: dict) -> dict[str, set[str]]:
    """Every run-record in the bucket: uuid -> the names of its files."""
    files: dict[str, set[str]] = {}
    for key in _objects(bucket):
        directory, _, name = key.rpartition("/")
        files.setdefault(directory, set()).add(name)
    runs = {}
    for directory, names in files.items():
        if "id.json" in names and "/.claims" not in directory:
            header = json.loads(_get(bucket, directory + "/id.json"))
            if header["kind"] == "Execution":
                runs[header["uuid"]] = names
    return runs


def _finish(process, timeout=180) -> None:
    output, _ = process.communicate(timeout=timeout)
    assert process.returncode == 0, output.decode()


def _load(path) -> dict:
    with open(path) as f:
        return json.load(f)


def _lines(path) -> list[str]:
    try:
        with open(path) as f:
            return [line for line in f.read().splitlines() if line]
    except OSError:
        return []


def _wait_for(predicate, timeout=60.0) -> None:
    deadline = time.monotonic() + timeout
    while not predicate():
        assert time.monotonic() < deadline, "timed out"
        time.sleep(0.1)


# -- the bucket ---------------------------------------------------------------


def test_the_claim_operations_are_conditional_writes(bucket):
    storage = S3(bucket)
    location = storage.root_uri() + "/x/.claims/p"
    assert storage.create_if_absent(location, b"1")
    assert not storage.create_if_absent(location, b"2")  # If-None-Match: *
    read = storage.read_versioned(location)
    assert read is not None and read[0] == b"1" and read[1]
    assert not storage.replace_if_unchanged(location, b"3", '"not-the-etag"')
    assert storage.replace_if_unchanged(location, b"4", read[1])  # If-Match
    assert not storage.replace_if_unchanged(location, b"5", read[1])
    assert storage.read_versioned(location)[0] == b"4"  # ty: ignore[not-subscriptable]


def test_a_credential_provider_is_asked_again_when_credentials_expire(bucket):
    import datetime

    calls = []

    def provider():
        calls.append(1)
        return {
            "access_key_id": KEY,
            "secret_access_key": SECRET,
            "token": None,
            "expires_at": datetime.datetime.now(datetime.UTC)
            + datetime.timedelta(seconds=1),
        }

    settings = {
        k: v
        for k, v in bucket.items()
        if k not in ("access_key_id", "secret_access_key")
    }
    storage = S3(settings, credential_provider=provider)
    storage.write(storage.root_uri(), "probe", b"1")
    time.sleep(1.5)
    assert storage.read(storage.root_uri(), "probe") == b"1"
    assert len(calls) >= 2


# -- results in a bucket ------------------------------------------------------


def test_a_run_leaves_its_files_and_markers_in_the_bucket(machines, monkeypatch):
    monkeypatch.setenv("MACHINABLE_HEARTBEAT_WINDOW", "1.2")
    a = machines["projects"][0]
    beats: set[bytes] = set()
    stack, _ = machines["connect"](a)
    with stack:
        import contextvars

        interface = get("shared_job", {"seconds": 2.5})
        context = contextvars.copy_context()
        thread = threading.Thread(target=lambda: context.run(interface.launch))
        thread.start()
        while thread.is_alive():
            for key in _objects(machines["bucket"]):
                if key.endswith("/heartbeat_at"):
                    try:
                        beats.add(_get(machines["bucket"], key))
                    except FileNotFoundError:
                        pass
            time.sleep(0.1)
        thread.join()
        run = interface.execution
        assert interface.cached()
    assert len(beats) >= 2  # live, beating in the bucket
    runs = _runs_in(machines["bucket"])
    assert set(runs) == {run.uuid}
    assert {
        "id.json",
        "started_at",
        "heartbeat_at",
        "finished_at",
        "output.log",
    } <= runs[run.uuid]
    keys = _objects(machines["bucket"])
    cached = [k for k in keys if k.endswith("/cached")]
    assert len(cached) == 1 and _get(machines["bucket"], cached[0]) == b"finished"
    assert any(k.endswith("/result.json") for k in keys)
    claims = [k for k in keys if "/.claims/" in k]
    assert len(claims) == 1
    assert json.loads(_get(machines["bucket"], claims[0]))["state"] == "released"
    assert any(k.startswith(".catalog/") for k in keys)


def test_reading_on_demand(machines):
    a, b, c, _ = machines["projects"]
    size = int(os.environ.get("MACHINABLE_S3_TEST_BYTES", 16 * 1024 * 1024))
    stack, _ = machines["connect"](a)
    with stack:
        interface = get("shared_job", {"size": size}).launch()
        uuid_, run = interface.uuid, interface.execution.uuid
        result = interface.load_file("result.json")

    # another machine lists the bucket's catalog without its data
    stack, storage = machines["connect"](b, catalog_max_bytes=1024)
    reads = []
    original = storage.read

    def counting(location, name):
        reads.append(name)
        return original(location, name)

    storage.read = counting  # ty: ignore[invalid-assignment]
    with stack:
        started = time.monotonic()
        ingested, position = storage.sync()
        assert time.monotonic() - started < 1.0
        assert {uuid_, run} <= set(ingested)
        assert storage.sync(position) == ([], position)
        assert "big.bin" not in reads
        entry = Index.get().get_by_id(uuid_)
        assert entry is not None and entry.bytes_missing
        found = Interface.find_by_id(uuid_)
        assert found is not None and found.load_file("result.json") == result
        assert "big.bin" not in reads
        path = found.local_directory("big.bin")  # a result method's read
        assert os.path.getsize(path) == size and reads.count("big.bin") == 1
        assert not Index.get().get_by_id(uuid_).bytes_missing  # ty: ignore[possibly-missing-attribute]
        # dispatching it again is a cache hit
        assert get("shared_job", {"size": size}).cached()

    # a third rebuilds its index from the bucket and fetches everything
    stack, storage = machines["connect"](c, catalog_max_bytes=1024)
    with stack:
        assert {uuid_, run} <= set(Index.get().reindex(storage))
        found = Interface.find_by_id(uuid_)
        assert found is not None and found.fetch()
        assert os.path.getsize(found.local_directory("big.bin")) == size
        execution = Interface.find_by_id(run)
        assert execution is not None and execution.is_finished()  # ty: ignore[unresolved-attribute]
        # an explicit delete removes the bucket's copy; the local one stays
        assert storage.contains(run) and storage.delete(uuid_)
        assert not storage.contains(run)
        assert found.load_file("result.json") == result


def test_a_folder_read_by_name_brings_its_missing_files(machines):
    a, b, _, _ = machines["projects"]
    stack, _ = machines["connect"](a)
    with stack:
        uuid_ = get("shared_job", {"folder": 3}).launch().uuid

    stack, storage = machines["connect"](b, catalog_max_bytes=1024)
    reads = []
    original = storage.read

    def counting(location, name):
        reads.append(name)
        return original(location, name)

    storage.read = counting  # ty: ignore[invalid-assignment]
    with stack:
        storage.sync()
        found = Interface.find_by_id(uuid_)
        assert found is not None
        assert os.path.isfile(
            os.path.join(Index.get().local_directory(uuid_), "folder", "small.json")
        )
        reads.clear()
        folder = found.local_directory("folder")
        assert sorted(os.listdir(folder)) == [
            "part0.bin",
            "part1.bin",
            "part2.bin",
            "small.json",
        ]
        assert sorted(reads) == [
            "folder/part0.bin",
            "folder/part1.bin",
            "folder/part2.bin",
        ]
        assert not Index.get().get_by_id(uuid_).bytes_missing  # ty: ignore[possibly-missing-attribute]
        reads.clear()
        assert found.local_directory("folder") == folder and reads == []


# -- several machines on one bucket --------------------------------------------


def test_machines_on_one_bucket_run_an_interface_once(machines):
    tmp = machines["tmp"]
    counter = str(tmp / "counter")
    config = {"counter": counter, "seconds": 1.5}
    a, b, c, d = machines["projects"]
    processes = [
        machines["start"](p, config, str(tmp / f"{i}.json"))
        for i, p in enumerate((a, b, c))
    ]
    for process in processes:
        _finish(process)

    assert len(_lines(counter)) == 1
    results = [_load(tmp / f"{i}.json") for i in range(3)]
    assert len({r["interface"] for r in results}) == 1
    assert len({r["run"] for r in results}) == 1 and results[0]["run"]
    assert sorted(r["cached"] for r in results).count("finished") >= 1
    assert all(r["result"] == results[0]["result"] is not None for r in results), (
        json.dumps(results)
    )
    runs = _runs_in(machines["bucket"])
    assert list(runs) == [results[0]["run"]]  # one bucket, one run-record, one id
    assert "finished_at" in runs[results[0]["run"]]

    # later, on a fourth machine: a cache hit
    _finish(machines["start"](d, config, str(tmp / "d.json")))
    late = _load(tmp / "d.json")
    assert late["run"] == results[0]["run"] and late["cached"]
    assert len(_lines(counter)) == 1


def test_a_killed_claimants_claim_is_taken_over_once(machines):
    tmp = machines["tmp"]
    counter = str(tmp / "counter")
    hang = tmp / "hang"
    hang.write_text("")
    config = {"counter": counter, "seconds": 0.5, "hang": str(hang)}
    a, b, c, d = machines["projects"]

    pa = machines["start"](a, config, str(tmp / "a.json"))
    try:
        _wait_for(lambda: len(_lines(counter)) == 1)
        _wait_for(
            lambda: any(
                "heartbeat_at" in f for f in _runs_in(machines["bucket"]).values()
            )
        )
        (killed,) = _runs_in(machines["bucket"])

        _finish(machines["start"](d, config, str(tmp / "d.json"), wait=False))
        rd = _load(tmp / "d.json")
        assert rd["cached"] is None
        assert tuple(rd["elsewhere"][rd["interface"]]) == ("running elsewhere", killed)

        pb = machines["start"](b, config, str(tmp / "b.json"))
        pc = machines["start"](c, config, str(tmp / "c.json"))
        time.sleep(1.5)
        assert pb.poll() is None and pc.poll() is None  # both wait on A
    finally:
        pa.send_signal(signal.SIGKILL)
        pa.wait()
    hang.unlink()

    _finish(pb)
    _finish(pc)
    rb, rc = _load(tmp / "b.json"), _load(tmp / "c.json")
    assert len(_lines(counter)) == 2  # A, then the one that took over
    assert rb["run"] == rc["run"] is not None and rb["run"] != killed
    assert [bool(rb["elsewhere"]), bool(rc["elsewhere"])].count(True) == 1

    runs = _runs_in(machines["bucket"])
    assert set(runs) == {killed, rb["run"]}
    assert "abandoned_at" in runs[killed] and "finished_at" not in runs[killed]
    assert "finished_at" in runs[rb["run"]]
