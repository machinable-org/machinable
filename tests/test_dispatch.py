"""Serverless dispatch (`machinable dispatch`) tests: phase separation,
marker lifecycle, scheduler handoff with recursive re-entry, detach."""

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
        "tests/samples/project", target, ignore=shutil.ignore_patterns("storage")
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
