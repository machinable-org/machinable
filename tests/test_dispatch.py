"""Serverless dispatch (`machinable dispatch`) tests: phase separation,
marker lifecycle, scheduler handoff with recursive re-entry, detach."""

import json
import os
import shutil
import sys

import pytest

from machinable.dispatch import dispatch_request
from machinable.utils import load_file


@pytest.fixture()
def project_dir(tmp_path):
    target = tmp_path / "project"
    shutil.copytree(
        "tests/samples/project",
        target,
        ignore=shutil.ignore_patterns("storage", ".machinable.sqlite"),
    )
    sys.path.insert(0, str(target))
    yield str(target)
    sys.path.remove(str(target))


def _markers(record_dir):
    return {
        name: load_file([record_dir, name], None)
        for name in ("dispatched_at", "started_at", "finished_at")
    }


def test_dispatch_foreground(project_dir):
    handle = dispatch_request(
        {"interfaces": [{"target": "count"}]},
        project=project_dir,
        mode="foreground",
        with_metadata=True,
    )
    assert len(handle["runs"]) == 1
    assert handle["uuid"] == handle["runs"][0]["uuid"]
    assert handle["parent_uuid"]

    markers = _markers(handle["record_dir"])
    assert markers["dispatched_at"] is not None
    assert markers["started_at"] is not None
    assert markers["finished_at"] is not None

    # metadata bundle: enough to ingest both records remotely (§B4)
    bundle = handle["metadata"][handle["uuid"]]
    assert bundle["id"]["uuid"] == handle["uuid"]
    assert bundle["model"]["kind"] == "Execution"
    assert "dispatched_at" in bundle["markers"]
    parent = handle["metadata"][handle["parent_uuid"]]
    assert parent["id"]["uuid"] == handle["parent_uuid"]

    # re-dispatch of a finished interface is a no-op (cached)
    again = dispatch_request(
        {"interfaces": [{"target": "count"}]},
        project=project_dir,
        mode="foreground",
    )
    assert again["runs"] == []


def test_dispatch_prepare_is_pending(project_dir):
    handle = dispatch_request(
        {"interfaces": [{"target": "basic"}]},
        project=project_dir,
        mode="prepare",
    )
    markers = _markers(handle["record_dir"])
    assert markers["dispatched_at"] is not None
    assert markers["started_at"] is None  # §L1.4 pending: dispatched only
    assert markers["finished_at"] is None

    from machinable import Execution

    status = Execution.from_directory(handle["record_dir"]).status_snapshot()
    assert status.is_pending
    assert not status.is_started and not status.is_active


def test_dispatch_handoff_and_recursive_reentry(project_dir):
    request = {
        "execution": {"target": "handoff_execution"},
        "interfaces": [{"target": "count"}],
    }
    # dispatch: handoff → submission runs synchronously, no payload, no detach
    handle = dispatch_request(request, project=project_dir, mode="detach")
    record_dir = handle["record_dir"]
    markers = _markers(record_dir)
    assert markers["dispatched_at"] is not None
    assert markers["started_at"] is None  # pending in the queue window
    assert load_file([record_dir, "submitted"], None) == "ok"

    # the scheduler re-enters recursively: same request, --foreground →
    # the payload continues the *same* pending run-record
    reentry = dispatch_request(request, project=project_dir, mode="foreground")
    assert reentry["uuid"] == handle["uuid"]
    assert reentry["record_dir"] == record_dir
    markers = _markers(record_dir)
    assert markers["started_at"] is not None
    assert markers["finished_at"] is not None


def test_dispatch_detached(project_dir):
    handle = dispatch_request(
        {"interfaces": [{"target": "basic"}]},
        project=project_dir,
        mode="detach",
        wait=True,
    )
    record_dir = handle["record_dir"]
    markers = _markers(record_dir)
    assert markers["finished_at"] is not None
    # the child logged and the request was persisted for provenance
    assert os.path.isfile(os.path.join(record_dir, "dispatch_request.json"))
    assert os.path.isfile(os.path.join(record_dir, "dispatch.log"))


def test_dispatch_looks_before_handing_off(project_dir):
    """Held elsewhere is reported, finished elsewhere is cached: neither dispatches."""
    from machinable import Project, get
    from machinable.claims import Claim, claim_location
    from machinable.storage import Storage

    with Project(project_dir):
        interface = get("count").materialize()
        location = claim_location(interface.local_directory())
        Storage.get().create_if_absent(
            location, Claim.held("RunHeld00001", 1).to_bytes()
        )

    handle = dispatch_request(
        {"interfaces": [{"target": "count"}]}, project=project_dir, mode="prepare"
    )
    assert handle["runs"] == []
    assert handle["running_elsewhere"] == [
        {"uuid": "RunHeld00001", "parent_uuid": interface.uuid, "record_dir": None}
    ]

    # the holder finishes elsewhere (here: in the foreground, once its claim
    # is gone); the next dispatch adopts that run without dispatching
    os.remove(location)
    done = dispatch_request(
        {"interfaces": [{"target": "count"}]}, project=project_dir, mode="foreground"
    )
    assert len(done["runs"]) == 1
    # a lost release: the claim still names the finished run, and its cached
    # marker never got written; the parent adopts the run instead of a rerun
    os.remove(location)
    os.remove(os.path.join(interface.local_directory(), "cached"))
    with Project(project_dir):
        Storage.get().create_if_absent(location, Claim.held(done["uuid"], 5).to_bytes())
    again = dispatch_request(
        {"interfaces": [{"target": "count"}]}, project=project_dir, mode="prepare"
    )
    assert again["runs"] == [] and "running_elsewhere" not in again
    assert load_file([interface.local_directory(), "cached"], None) == "finished"


# ------------------------------------------- used records and working copies


def _vector():
    from .test_plain_config import _corpus_vectors

    return next(v for v in _corpus_vectors() if v["name"] == "data-record")


def _folder(directory, artifacts) -> str:
    """A data record's files as a plain folder on this computer."""
    for path, content in artifacts.items():
        target = directory / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content, encoding="utf-8")
    return str(directory)


@pytest.fixture()
def data_project(tmp_path):
    """A project (its own storage and index) with a data record and a reader.

    The record's home has only its header; its files are a folder elsewhere.
    """
    from machinable import Project, get
    from machinable.corpus import PLAIN_MODULES
    from machinable.interface import connection_scope

    from .test_plain_config import READER, _forget_modules, _write_modules

    modules = {**PLAIN_MODULES, "reader": READER}
    directory = tmp_path / "projects" / "data"
    directory.mkdir(parents=True)
    _write_modules(str(directory), modules)
    _forget_modules(modules)
    given = _vector()["input"]
    with connection_scope(), Project(str(directory)):
        record = get(given["module"], given["config"]).materialize()
        uuid = record.uuid
    folder = _folder(tmp_path / "on-the-rig" / "session", given["artifacts"])
    sys.path.insert(0, str(directory))
    yield str(directory), uuid, folder, given
    sys.path.remove(str(directory))
    _forget_modules(modules)


def _reads(record_uuid, folder):
    return {
        "interfaces": [
            {
                "target": "reader",
                "uses": [record_uuid],
                "working_copy": {record_uuid: folder},
            }
        ]
    }


def _seen(project, run_uuid):
    from machinable import Interface, Project
    from machinable.interface import connection_scope

    with connection_scope(), Project(project):
        return Interface.find_by_id(run_uuid).load_file("seen.json")


def test_dispatch_reads_a_used_record_from_its_working_copy(data_project):
    pytest.importorskip("fastapi")
    from fastapi.testclient import TestClient

    from machinable import Interface, Project
    from machinable.api.app import create_app
    from machinable.interface import connection_scope

    project, uuid, folder, given = data_project
    before = sorted(os.listdir(folder))
    handle = dispatch_request(_reads(uuid, folder), project=project, mode="foreground")

    seen = _seen(project, handle["parent_uuid"])
    assert seen["path"] == os.path.join(folder, "Record Node 101", "structure.oebin")
    assert seen["oebin"] == given["artifacts"]["Record Node 101/structure.oebin"]
    # the folder is only read: nothing fetched or written into it
    assert sorted(os.listdir(folder)) == before

    with connection_scope(), Project(project):
        # the working copy is not identifying: the run fetching the record
        # is the same run
        (record,) = [Interface.find_by_id(uuid, fetch=False, stub=True)]
        fetching = Interface.make("reader", uses=[record]).materialize()
        assert fetching.uuid == handle["parent_uuid"]
        dispatched = Interface.find_by_id(handle["parent_uuid"])
        assert dispatched.predicate_key == fetching.predicate_key
        assert [u.uuid for u in dispatched.uses] == [uuid]

    # the same request through the server names the same run (cached now)
    with TestClient(create_app(project_dir=project)) as client:
        response = client.post("/v1/executions", json=_reads(uuid, folder))
        assert response.status_code == 200, response.text
        assert response.json()["interface_uuids"] == [handle["parent_uuid"]]


def test_detached_dispatch_reads_the_working_copy(data_project):
    project, uuid, folder, given = data_project
    handle = dispatch_request(
        _reads(uuid, folder), project=project, mode="detach", wait=True
    )
    seen = _seen(project, handle["parent_uuid"])
    assert seen["path"].startswith(folder)
    assert seen["files"] == json.loads(given["artifacts"]["files.json"])
    # the run-record keeps the request, never the folder (the private overlay
    # gave it to the child)
    recorded = load_file([handle["record_dir"], "dispatch_request.json"])
    assert recorded["interfaces"][0]["uses"] == [uuid]
    assert "working_copy" not in recorded["interfaces"][0]
    for name in os.listdir(handle["record_dir"]):
        path = os.path.join(handle["record_dir"], name)
        if os.path.isfile(path):
            with open(path, encoding="utf-8", errors="replace") as f:
                assert folder not in f.read(), name


def test_dispatch_refuses_unknown_records_and_missing_folders(data_project, tmp_path):
    from machinable.errors import ConfigurationError, NotFound

    project, uuid, folder, _ = data_project
    with pytest.raises(NotFound, match="NoSuchRecord"):
        dispatch_request(
            {"interfaces": [{"target": "reader", "uses": ["NoSuchRecord"]}]},
            project=project,
            mode="prepare",
        )
    with pytest.raises(ConfigurationError, match="not a directory"):
        dispatch_request(
            _reads(uuid, str(tmp_path / "nowhere")), project=project, mode="prepare"
        )
    with pytest.raises(ConfigurationError, match="not used"):
        dispatch_request(
            {"interfaces": [{"target": "reader", "working_copy": {uuid: folder}}]},
            project=project,
            mode="prepare",
        )
