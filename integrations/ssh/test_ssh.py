"""Ssh transport: addressing and command construction, without a network."""

import os
import subprocess

import pytest

from machinable import Index, Project, Storage

from ssh import Ssh


@pytest.fixture()
def connected(tmp_path):
    project = tmp_path / "project"
    project.mkdir()
    with (
        Storage(str(tmp_path / "storage")),
        Index({"database": str(tmp_path / "index.sqlite")}),
        Project(str(project)),
    ):
        yield tmp_path


def _transport():
    return Ssh(
        {
            "host": "gpu.lan",
            "storage": "/scratch/me/storage",
            "directory": "/home/me/project",
        }
    )


def test_path_swaps_roots(connected):
    transport = _transport()

    record = os.path.join(str(connected / "storage"), "abc", "def")
    assert transport.path(record) == "/scratch/me/storage/abc/def"
    assert transport.path(str(connected / "storage")) == "/scratch/me/storage"
    assert transport.path(str(connected / "project" / "a.py")) == "/home/me/project/a.py"


def test_unmapped_paths_raise_rather_than_pass_through(connected):
    transport = _transport()

    with pytest.raises(ValueError, match="not under any directory"):
        transport.path("/somewhere/else")

    bare = Ssh({"host": "gpu.lan"})
    with pytest.raises(ValueError, match="none configured"):
        bare.path(str(connected / "storage"))


def test_a_longer_root_wins(tmp_path):
    project = tmp_path / "project"
    (project / "storage").mkdir(parents=True)
    with (
        Storage(str(project / "storage")),
        Index({"database": str(tmp_path / "index.sqlite")}),
        Project(str(project)),
    ):
        transport = Ssh(
            {
                "host": "gpu.lan",
                "storage": "/scratch/me/storage",
                "directory": "/home/me/project",
            }
        )
        assert transport.path(str(project / "storage" / "abc")) == (
            "/scratch/me/storage/abc"
        )
        assert transport.path(str(project / "run.py")) == "/home/me/project/run.py"


def test_run_sends_one_quoted_remote_command(connected, monkeypatch):
    from machinable import transport as transport_module

    seen = []

    def fake_run(cmd, **kwargs):
        seen.append(list(cmd))
        return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")

    monkeypatch.setattr(transport_module.subprocess, "run", fake_run)

    _transport().run(["squeue", "--name", "a name", "--format=%i"])

    assert seen[0][0] == "ssh"
    assert "BatchMode=yes" in seen[0]
    assert seen[0][-2] == "gpu.lan"
    assert seen[0][-1] == "squeue --name 'a name' --format=%i"


def test_push_creates_the_destination_then_mirrors(connected, monkeypatch):
    from machinable import transport as transport_module

    seen = []

    def fake_run(cmd, **kwargs):
        seen.append(list(cmd))
        return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")

    monkeypatch.setattr(transport_module.subprocess, "run", fake_run)

    local = str(connected / "storage" / "abc")
    remote = _transport().push(local)
    assert remote == "/scratch/me/storage/abc"

    assert seen[0][-1] == "mkdir -p /scratch/me/storage/abc"
    rsync = seen[1]
    assert rsync[0] == "rsync"
    assert "--update" in rsync
    assert "--delete" not in rsync
    assert rsync[-2] == local + "/"
    assert rsync[-1] == "gpu.lan:/scratch/me/storage/abc/"
    assert rsync[rsync.index("-e") + 1].startswith("ssh ")


def test_pull_narrows_to_the_status_files(connected, monkeypatch):
    from machinable import transport as transport_module
    from machinable.transport import STATUS_FILES

    seen = []

    def fake_run(cmd, **kwargs):
        seen.append(list(cmd))
        return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")

    monkeypatch.setattr(transport_module.subprocess, "run", fake_run)

    local = str(connected / "storage" / "abc")
    assert _transport().pull("/scratch/me/storage/abc", local, include=STATUS_FILES)

    rsync = seen[0]
    assert rsync[rsync.index("--include") + 1] == "*/"
    assert rsync[rsync.index("--exclude") + 1] == "*"
    for pattern in STATUS_FILES:
        assert pattern in rsync
    assert "--update" not in rsync
    assert "--delete" not in rsync
    assert rsync[-2] == "gpu.lan:/scratch/me/storage/abc/"
    assert rsync[-1] == local + "/"


def test_push_keeps_update_so_a_repush_cannot_roll_markers_back(connected, monkeypatch):
    from machinable import transport as transport_module

    seen = []

    def fake_run(cmd, **kwargs):
        seen.append(list(cmd))
        return subprocess.CompletedProcess(cmd, 0, stdout="", stderr="")

    monkeypatch.setattr(transport_module.subprocess, "run", fake_run)

    _transport().push(str(connected / "storage" / "abc"))

    rsync = next(cmd for cmd in seen if cmd[0] == "rsync")
    assert "--update" in rsync
    assert "--delete" not in rsync
