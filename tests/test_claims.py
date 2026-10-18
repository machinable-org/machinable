"""Claims: an interface dispatched at once from many places runs once.

Threads in one process, processes sharing one index, and processes with an
index each over one storage folder all see the same record directories, so
they coordinate through the claim file (docs/design/format.md, "Claims").
Tests of liveness use a heartbeat window of seconds.
"""

import json
import os
import signal
import subprocess
import sys
import threading
import time

import pytest

from machinable import Execution, Index, Interface, Project, Storage, get
from machinable.claims import HELD, RELEASED, Claim, claim_location
from machinable.utils import load_file

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

JOB = """
import os
import threading
import time

from pydantic import BaseModel

from machinable import Interface


class SharedJob(Interface):
    class Config(BaseModel):
        counter: str = ""
        seconds: float = 1.0
        hang: str = ""
        fail: bool = False

    def __call__(self):
        with open(self.config.counter, "a") as f:
            f.write(f"{os.getpid()}-{threading.get_ident()}\\n")
        deadline = time.monotonic() + self.config.seconds
        while time.monotonic() < deadline or (
            self.config.hang and os.path.exists(self.config.hang)
        ):
            time.sleep(0.02)
        if self.config.fail:
            raise RuntimeError("failed on purpose")
        self.save_file("result.json", {"pid": os.getpid()})
"""

WORKER = """
import json
import sys

from machinable import Execution, Index, Project, Storage, get
from machinable.utils import load_file

project, storage, database, config, out, wait = sys.argv[1:7]
with Project(project), Storage(storage), Index({"database": database}):
    interface = get("shared_job", json.loads(config))
    execution = Execution().wait_elsewhere(wait == "wait")
    with execution:
        interface.launch()
    run = interface.execution if interface.cached() else None
    result = {
        "interface": interface.uuid,
        "cached": load_file(interface.local_directory("cached"), None),
        "run": run.uuid if run is not None and run.is_materialized() else None,
        "result": interface.load_file("result.json", None),
        "elsewhere": execution.elsewhere,
    }
with open(out, "w") as f:
    json.dump(result, f)
"""


def _lines(path) -> list[str]:
    try:
        with open(path) as f:
            return [line for line in f.read().splitlines() if line]
    except OSError:
        return []


def _runs_in(folder: str) -> list[tuple[str, dict, list[str]]]:
    """Every run-record directory under ``folder``: (path, id.json, files)."""
    runs = []
    for dirpath, dirnames, filenames in os.walk(folder):
        dirnames[:] = [d for d in dirnames if d != ".claims"]
        if "id.json" in filenames:
            with open(os.path.join(dirpath, "id.json")) as f:
                header = json.load(f)
            if header["kind"] == "Execution":
                runs.append((dirpath, header, filenames))
    return runs


def _wait_for(predicate, timeout=60.0) -> None:
    deadline = time.monotonic() + timeout
    while not predicate():
        assert time.monotonic() < deadline, "timed out"
        time.sleep(0.05)


@pytest.fixture()
def shared(tmp_path, monkeypatch):
    """A project with the shared job, one storage folder, a 3 s liveness window."""
    project = tmp_path / "proj"
    project.mkdir()
    (project / "shared_job.py").write_text(JOB)
    worker = tmp_path / "worker.py"
    worker.write_text(WORKER)
    storage = tmp_path / "storage"
    storage.mkdir()
    monkeypatch.setenv("MACHINABLE_HEARTBEAT_WINDOW", "3")
    env = dict(
        os.environ,
        MACHINABLE_HEARTBEAT_WINDOW="3",
        PYTHONPATH=os.path.join(REPO, "src"),
    )

    def start(database: str, config: dict, out: str, wait: bool = True):
        return subprocess.Popen(
            [
                sys.executable,
                str(worker),
                str(project),
                str(storage),
                database,
                json.dumps(config),
                out,
                "wait" if wait else "nowait",
            ],
            env=env,
            cwd=str(project),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )

    def connect(database: str = "index.sqlite"):
        """Enter the project, the storage and an index (in this thread)."""
        import contextlib

        stack = contextlib.ExitStack()
        stack.enter_context(Project(str(project)))
        stack.enter_context(Storage(str(storage)))
        stack.enter_context(Index({"database": str(tmp_path / database)}))
        return stack

    return {
        "tmp": tmp_path,
        "project": str(project),
        "storage": str(storage),
        "start": start,
        "connect": connect,
    }


def _finish(process, timeout=120) -> None:
    output, _ = process.communicate(timeout=timeout)
    assert process.returncode == 0, output.decode()


def _read(path) -> dict:
    with open(path) as f:
        return json.load(f)


# -- the two operations on disk --------------------------------------------


def test_disk_create_if_absent_and_replace_if_unchanged(tmp_path):
    storage = Storage(str(tmp_path))
    location = str(tmp_path / "identity" / ".claims" / "predicate")
    first = Claim.held("RunA", 1).to_bytes()
    assert storage.create_if_absent(location, first)
    assert not storage.create_if_absent(location, Claim.held("RunB", 1).to_bytes())
    read = storage.read_versioned(location)
    assert read is not None and read[0] == first and read[1] is None

    # two writers replacing generation 1: exactly one wins
    second = Claim.held("RunB", 2).to_bytes()
    assert storage.replace_if_unchanged(location, second, "1")
    assert not storage.replace_if_unchanged(
        location, Claim.held("RunC", 2).to_bytes(), "1"
    )
    assert storage.read_versioned(location)[0] == second  # ty: ignore[not-subscriptable]
    # writers that read an older generation never win again
    assert storage.replace_if_unchanged(location, Claim.held("RunD", 3).to_bytes(), "2")
    assert not storage.replace_if_unchanged(location, b"{}", "1")
    assert not storage.replace_if_unchanged(location, b"{}", "2")
    # no temporary files are left behind
    names = sorted(os.listdir(tmp_path / "identity" / ".claims"))
    assert names == ["predicate", "predicate.2", "predicate.3"]


def test_disk_replace_races_have_one_winner(tmp_path):
    storage = Storage(str(tmp_path))
    location = str(tmp_path / ".claims" / "p")
    assert storage.create_if_absent(location, Claim.held("Run0", 1).to_bytes())
    wins = []
    barrier = threading.Barrier(8)

    def replace(i):
        barrier.wait()
        if storage.replace_if_unchanged(
            location, Claim.held(f"Run{i}", 2).to_bytes(), "1"
        ):
            wins.append(i)

    threads = [threading.Thread(target=replace, args=(i,)) for i in range(8)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert len(wins) == 1
    claim = Claim.from_bytes(storage.read_versioned(location)[0])  # ty: ignore[not-subscriptable]
    assert claim is not None and claim.record_id == f"Run{wins[0]}"


def test_a_stalled_replace_is_completed(tmp_path, monkeypatch):
    import machinable.storage as storage_module

    storage = Storage(str(tmp_path))
    location = str(tmp_path / ".claims" / "p")
    assert storage.create_if_absent(location, Claim.held("Run0", 1).to_bytes())
    # a writer linked generation 2 and died before renaming it
    with open(location + ".2", "wb") as f:
        f.write(Claim.held("RunDead", 2).to_bytes())
    assert not storage.replace_if_unchanged(location, b"{}", "1")
    assert Claim.from_bytes(storage.read_versioned(location)[0]).record_id == "Run0"  # ty: ignore[not-subscriptable]
    monkeypatch.setattr(storage_module, "STALLED_REPLACE_SECONDS", 0.0)
    assert not storage.replace_if_unchanged(location, b"{}", "1")
    claim = Claim.from_bytes(storage.read_versioned(location)[0])  # ty: ignore[not-subscriptable]
    assert claim is not None and claim.generation == 2
    # generation 2 is replaceable now
    assert storage.replace_if_unchanged(
        location, Claim.held("RunNext", 3).to_bytes(), "2"
    )


# -- one process ------------------------------------------------------------


def test_a_dispatch_claims_and_releases(shared):
    counter = str(shared["tmp"] / "counter")
    with shared["connect"]():
        interface = get("shared_job", {"counter": counter, "seconds": 0}).launch()
        run = interface.execution
        location = claim_location(interface.local_directory())
        claim = Claim.from_bytes(open(location, "rb").read())
        assert claim is not None
        assert claim.record_id == run.uuid
        assert claim.state == RELEASED and claim.generation == 2
        assert claim.pid == os.getpid()
        # the claim is outside every record directory and never indexed
        assert not location.startswith(interface.local_directory())
        assert Index.get().reindex() and len(_runs_in(shared["storage"])) == 1
        # the claimant beat before the payload started
        assert run.heartbeat_at() is not None


def test_uncaching_still_reruns(shared):
    counter = str(shared["tmp"] / "counter")
    config = {"counter": counter, "seconds": 0}
    with shared["connect"]():
        interface = get("shared_job", config).launch()
        first = interface.execution.uuid
        assert interface.cached()
        get("shared_job", config).launch()
        assert len(_lines(counter)) == 1  # cached
        interface.cached(False)
        get("shared_job", config).launch()
        assert len(_lines(counter)) == 2
        rerun = get("shared_job", config).execution.uuid
        assert rerun != first
        claim = Claim.from_bytes(
            open(claim_location(interface.local_directory()), "rb").read()
        )
        assert claim is not None and claim.record_id == rerun
        assert claim.state == RELEASED and claim.generation == 4


def test_a_failed_run_releases_and_runs_again(shared):
    counter = str(shared["tmp"] / "counter")
    config = {"counter": counter, "seconds": 0, "fail": True}
    with shared["connect"]():
        interface = get("shared_job", config)
        with pytest.raises(Exception):
            interface.launch()
        claim = Claim.from_bytes(
            open(claim_location(interface.local_directory()), "rb").read()
        )
        assert claim is not None and claim.state == RELEASED
        with pytest.raises(Exception):
            get("shared_job", config).launch()
        assert len(_lines(counter)) == 2


def test_threads_in_one_process_run_once(shared):
    counter = str(shared["tmp"] / "counter")
    config = {"counter": counter, "seconds": 0.5}
    results = []
    errors = []
    barrier = threading.Barrier(4)

    def dispatch(database):
        try:
            with shared["connect"](database):
                barrier.wait()
                interface = get("shared_job", config).launch()
                results.append((interface.uuid, interface.execution.uuid))
        except BaseException as ex:  # noqa: BLE001
            errors.append(ex)

    # two threads share an index, two have their own
    databases = ["shared.sqlite", "shared.sqlite", "one.sqlite", "two.sqlite"]
    threads = [threading.Thread(target=dispatch, args=(d,)) for d in databases]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    assert not errors, errors
    assert len(_lines(counter)) == 1
    assert len({r[0] for r in results}) == 1  # one interface id
    assert len({r[1] for r in results}) == 1  # one run-record id
    assert len(_runs_in(shared["storage"])) == 1


def test_the_waiter_does_not_miss_the_finish(shared):
    """The prototype's race, 50 times: a waiter must never run a second time."""
    errors = []
    for repetition in range(50):
        counter = str(shared["tmp"] / f"counter-{repetition}")
        config = {"counter": counter, "seconds": 0}
        barrier = threading.Barrier(3)

        def dispatch(database, config=config, barrier=barrier):
            try:
                with (
                    shared["connect"](database),
                    Execution().wait_elsewhere(interval=0.01),
                ):
                    barrier.wait()
                    get("shared_job", config).launch()
            except BaseException as ex:  # noqa: BLE001
                errors.append(ex)

        threads = [
            threading.Thread(target=dispatch, args=(d,))
            for d in ("a.sqlite", "b.sqlite", "a.sqlite")
        ]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        assert not errors, errors
        assert len(_lines(counter)) == 1, f"ran twice in repetition {repetition}"


def test_a_lost_release_is_dropped(shared):
    """A waiter took the claim over while the run finished: the result stands."""
    counter = str(shared["tmp"] / "counter")
    with shared["connect"]():
        interface = get("shared_job", {"counter": counter, "seconds": 0})
        interface.materialize()
        location = claim_location(interface.local_directory())
        storage = Storage.get()
        original = Storage.replace_if_unchanged

        def taken_over(self, path, data, version):
            claim = Claim.from_bytes(data)
            if claim is not None and claim.state == RELEASED:
                # just before the release, another dispatcher replaces the claim
                taker = Claim.held("RunTaker0001", claim.generation)
                assert original(self, path, taker.to_bytes(), version)
                return original(self, path, data, version)
            return original(self, path, data, version)

        try:
            Storage.replace_if_unchanged = taken_over  # ty: ignore[invalid-assignment]
            interface.launch()
        finally:
            Storage.replace_if_unchanged = original  # ty: ignore[invalid-assignment]
        assert interface.cached()
        assert interface.execution.is_finished()
        claim = Claim.from_bytes(storage.read_versioned(location)[0])  # ty: ignore[not-subscriptable]
        assert claim is not None
        assert claim.record_id == "RunTaker0001" and claim.state == HELD


def test_without_waiting_a_held_claim_is_running_elsewhere(shared):
    counter = str(shared["tmp"] / "counter")
    config = {"counter": counter, "seconds": 0}
    with shared["connect"]():
        interface = get("shared_job", config)
        interface.materialize()
        location = claim_location(interface.local_directory())
        Storage.get().create_if_absent(
            location, Claim.held("RunOther0001", 1).to_bytes()
        )
        execution = Execution().wait_elsewhere(False)
        with execution:
            interface.launch()
        assert not interface.cached()
        assert execution.elsewhere == {
            interface.uuid: ("running elsewhere", "RunOther0001")
        }
        assert _lines(counter) == []

        # waiting with a timeout gives up the same way
        started = time.monotonic()
        execution = Execution().wait_elsewhere(timeout=0.3, interval=0.05)
        with execution:
            get("shared_job", config).launch()
        assert 0.3 <= time.monotonic() - started < 3
        assert execution.elsewhere[interface.uuid][0] == "running elsewhere"
        assert _lines(counter) == []

        # once the claim goes stale (no heartbeat past the 3 s timeout), the
        # next dispatcher takes it over and runs
        time.sleep(3.1)
        get("shared_job", config).launch()
        assert len(_lines(counter)) == 1


def test_a_nested_launch_runs_under_its_own_claim(tmp_storage):
    """An interface whose run dispatches itself again does not wait on itself."""
    from machinable.execution import _HELD_CLAIMS

    interface = get("count").launch()
    location = claim_location(interface.local_directory())
    token = _HELD_CLAIMS.set(frozenset({location}))
    try:
        Storage.get().replace_if_unchanged(
            location, Claim.held(interface.execution.uuid, 3).to_bytes(), "2"
        )
        interface.cached(False)
        get("count").launch()  # would wait forever on its own fresh claim
    finally:
        _HELD_CLAIMS.reset(token)
    assert get("count").cached()


# -- shared interface ids ----------------------------------------------------


def test_interface_ids_are_shared_by_indexes_over_one_folder(shared):
    config = {"counter": str(shared["tmp"] / "counter"), "seconds": 0}
    from machinable.claims import shared_record_id

    with shared["connect"]("one.sqlite"):
        first = get("shared_job", config)
        first.materialize()
        other_config = {**config, "seconds": 1.0}
        unlaunched = get("shared_job", other_config)
        unlaunched.materialize()
        # deterministic before any directory exists
        assert first.uuid == shared_record_id(
            first.parent.record_id,
            first._resolve_index_entry().identity_key,
            first.predicate_key,
        )
    with shared["connect"]("two.sqlite"):
        # the directory's id.json is taken
        assert get("shared_job", config).materialize().uuid == first.uuid
        assert get("shared_job", other_config).materialize().uuid == unlaunched.uuid


def test_existing_random_ids_are_kept(tmp_storage):
    """An index that holds an interface keeps its (minted) id."""
    interface = get("count")
    interface.materialize(record_id="MintedRandom")
    assert get("count").materialize().uuid == "MintedRandom"


def test_a_directory_written_by_another_index_brings_its_runs(shared):
    config = {"counter": str(shared["tmp"] / "counter"), "seconds": 0}
    with shared["connect"]("one.sqlite"):
        run = get("shared_job", config).launch().execution.uuid
    with shared["connect"]("two.sqlite"):
        interface = get("shared_job", config).materialize()
        assert interface.cached()  # the cached marker is in the shared folder
        assert interface.execution.uuid == run
        assert interface.execution.is_finished()
    assert len(_lines(config["counter"])) == 1


# -- processes ---------------------------------------------------------------


@pytest.mark.parametrize("separate", [False, True], ids=["one-index", "two-indexes"])
def test_processes_dispatching_at_once_run_once(shared, separate):
    tmp = shared["tmp"]
    counter = str(tmp / "counter")
    config = {"counter": counter, "seconds": 1.5}
    databases = [
        str(tmp / (f"index-{i}.sqlite" if separate else "index.sqlite"))
        for i in range(3)
    ]
    outs = [str(tmp / f"out-{i}.json") for i in range(3)]
    processes = [shared["start"](d, config, o) for d, o in zip(databases, outs)]
    for process in processes:
        _finish(process)

    assert len(_lines(counter)) == 1  # ran once
    results = [_read(o) for o in outs]
    assert len({r["interface"] for r in results}) == 1
    assert len({r["run"] for r in results}) == 1 and results[0]["run"]
    assert all(r["result"] == results[0]["result"] is not None for r in results)
    waiters = [r for r in results if r["elsewhere"]]
    assert len(waiters) == 2
    assert all(
        tuple(r["elsewhere"][r["interface"]]) == ("finished elsewhere", r["run"])
        for r in waiters
    )
    # one folder, one run-record, one id
    runs = _runs_in(shared["storage"])
    assert len(runs) == 1 and runs[0][1]["uuid"] == results[0]["run"]
    assert "finished_at" in runs[0][2]

    # a later dispatcher is a cache hit at once
    out = str(tmp / "late.json")
    started = time.monotonic()
    _finish(shared["start"](str(tmp / "late.sqlite"), config, out))
    late = _read(out)
    assert late["run"] == results[0]["run"] and late["cached"]
    assert len(_lines(counter)) == 1
    assert time.monotonic() - started < 30


def test_a_killed_claimant_is_taken_over_by_one_waiter(shared):
    tmp = shared["tmp"]
    counter = str(tmp / "counter")
    hang = tmp / "hang"
    hang.write_text("")
    config = {"counter": counter, "seconds": 0.5, "hang": str(hang)}
    out = {name: str(tmp / f"{name}.json") for name in "abcd"}

    a = shared["start"](str(tmp / "a.sqlite"), config, out["a"])
    try:
        # A runs, beating, until killed
        _wait_for(lambda: len(_lines(counter)) == 1)
        _wait_for(
            lambda: any("heartbeat_at" in f for _, _, f in _runs_in(shared["storage"]))
        )
        ((_, killed, _),) = _runs_in(shared["storage"])

        # without waiting, D finds it running elsewhere and leaves it be
        _finish(shared["start"](str(tmp / "d.sqlite"), config, out["d"], wait=False))
        d = _read(out["d"])
        assert d["cached"] is None and d["run"] is None
        assert tuple(d["elsewhere"][d["interface"]]) == (
            "running elsewhere",
            killed["uuid"],
        )

        b = shared["start"](str(tmp / "b.sqlite"), config, out["b"])
        c = shared["start"](str(tmp / "c.sqlite"), config, out["c"])
        time.sleep(1.5)  # both wait on A
        assert b.poll() is None and c.poll() is None
    finally:
        a.send_signal(signal.SIGKILL)
        a.wait()
    hang.unlink()

    # after the window, exactly one of the two takes the claim over and runs
    _finish(b)
    _finish(c)
    assert len(_lines(counter)) == 2  # A, then the one that took over
    rb, rc = _read(out["b"]), _read(out["c"])
    assert rb["run"] == rc["run"] is not None
    assert rb["run"] != killed["uuid"]
    assert [bool(rb["elsewhere"]), bool(rc["elsewhere"])].count(True) == 1

    # the dead run-record stays, marked abandoned; the new one finished
    runs = {h["uuid"]: f for _, h, f in _runs_in(shared["storage"])}
    assert set(runs) == {killed["uuid"], rb["run"]}
    assert "abandoned_at" in runs[killed["uuid"]]
    assert "finished_at" not in runs[killed["uuid"]]
    assert "finished_at" in runs[rb["run"]]

    # the abandoned run reads as died
    with shared["connect"]("b.sqlite"):
        dead = Interface.find_by_id(killed["uuid"])
        assert dead is not None and dead.is_abandoned()  # ty: ignore[unresolved-attribute]
        assert not dead.is_active() and not dead.is_live()  # ty: ignore[unresolved-attribute]


def test_without_claims_dispatch_is_unchanged(tmp_storage, monkeypatch):
    """A storage that cannot claim exclusively runs as before claims existed."""
    monkeypatch.setattr(Storage, "exclusive_claims", lambda self: False)
    interface = get("count").launch()
    assert interface.cached()
    assert interface.execution.is_finished()
    assert not os.path.exists(claim_location(interface.local_directory()))
    assert load_file(interface.local_directory("cached"), None) == "finished"
