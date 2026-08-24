import json
import os
import shutil
import time
from pathlib import Path

import pytest
from pydantic import BaseModel

from machinable import Execution, Index, Interface, Project, Storage


class SlurmInterface(Interface):
    """Dummy slurm payload."""
    class Config(BaseModel):
        ranks: int = 1
        nodes: int = 1

    def __call__(self):
        """stdout + fileout."""
        print("Hello world from Slurm")
        self.save_file("test_run.json", {"success": True})


def test_slurm_dry_run(tmp_path):
    """The submission path runs without a Slurm environment when dry."""
    with (
        Storage(str(tmp_path)),
        Index({"database": str(tmp_path / "index.sqlite")}),
    ):
        with Project(os.path.dirname(__file__)):
            component = SlurmInterface()
            execution = Execution.make("slurm", {"confirm": False, "dry": True})
            execution.add(component)
            execution.dispatch()
            assert not component.cached()
            script = component.execution.load_file("slurm.sh")
            assert "#SBATCH" in (script or "")


@pytest.mark.skipif(
    not shutil.which("sbatch") or "MACHINABLE_SLURM_TEST_RESOURCES" not in os.environ,
    reason="Test requires Slurm environment",
)
def test_slurm_execution(tmp_path):
    """Test slurm execution."""
    component = SlurmInterface()
    directory = os.environ.get("MACHINABLE_SLURM_TEST_DIRECTORY", None)
    if directory is not None:
        tmp_path = Path(directory) / component.uuid
    with (
        Storage(str(tmp_path)),
        Index({"database": str(tmp_path / "index.sqlite")}),
    ):
        with Project(os.path.dirname(__file__)):
            # standard submission
            with Execution.get(
                "slurm",
                {"confirm": False},
                resources=json.loads(
                    os.environ.get("MACHINABLE_SLURM_TEST_RESOURCES", "{}")
                ),
            ):
                component = SlurmInterface().launch()

            status = False
            for _ in range(60):
                if component.execution.is_finished():
                    assert "Hello world from Slurm" in component.execution.output()
                    assert component.load_file("test_run.json")["success"] is True
                    status = True
                    break

                time.sleep(1)

            assert status, f"Timeout for {component.local_directory()}"

            # usage
            with Execution.get(
                "slurm",
                {"confirm": False},
                resources=json.loads(
                    os.environ.get("MACHINABLE_SLURM_TEST_RESOURCES", "{}")
                ),
            ):
                A = SlurmInterface(uses=component).launch()
                A.save_file("name", "A")
                B = SlurmInterface().launch()
                B.save_file("name", "B")
                C = SlurmInterface(uses=[A, B]).launch()
                C.save_file("name", "C")

            status = False
            for _ in range(60):
                if C.execution.is_finished():
                    assert "Hello world from Slurm" in C.execution.output()
                    assert C.load_file("test_run.json")["success"] is True
                    status = True
                    break

                time.sleep(1)

            assert status, f"Timeout for {C.local_directory()}"


def _payload(script: str) -> str:
    import base64
    import re

    match = re.search(r"b64decode\('([^']+)'\)", script)
    assert match is not None, script
    return base64.b64decode(match.group(1)).decode()


def test_submits_through_a_connected_transport(tmp_path, monkeypatch):
    import subprocess
    import sys

    sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "ssh"))
    from ssh import Ssh

    from machinable import Transport

    sent = []

    class StubbedSsh(Ssh):
        """Real addressing, no network."""

        def run(self, cmd, **kwargs):
            sent.append(("ssh", list(cmd)))
            stdout = "Submitted batch job 55" if cmd[0] == "sbatch" else ""
            return subprocess.CompletedProcess(cmd, 0, stdout=stdout, stderr="")

        def _rsync(self, source, destination, **kwargs):
            sent.append(("rsync", source, destination))
            return subprocess.CompletedProcess([], 0, stdout="", stderr="")

    project = os.path.dirname(__file__)
    monkeypatch.chdir(project)
    with (
        Storage(str(tmp_path / "storage")),
        Index({"database": str(tmp_path / "index.sqlite")}),
        Project(project),
    ):
        transport = StubbedSsh(
            {
                "host": "gpu.lan",
                "storage": "/scratch/me/storage",
                "directory": "/home/me/project",
            }
        )
        with transport:
            assert Transport.get() is transport
            component = SlurmInterface()
            execution = Execution.make(
                "slurm", {"confirm": False, "python": "/scratch/venv/bin/python"}
            )
            execution.add(component)
            execution.dispatch()
            script = component.execution.load_file("slurm.sh")
            submission = component.execution.load_file("slurm.json")

    payload = _payload(script)

    # the job is addressed entirely in the cluster's coordinates ...
    assert "#SBATCH --output=/scratch/me/storage/" in script
    assert "/scratch/venv/bin/python" in script
    assert "Interface.from_directory('/scratch/me/storage/" in payload
    assert "Execution.from_directory('/scratch/me/storage/" in payload
    assert "Project('/home/me/project" in payload
    # ... and nothing names this machine
    assert str(tmp_path) not in script
    assert str(tmp_path) not in payload

    # the whole conversation with the far side, in order: check for a duplicate
    # submission, prepare the destination, hand over the record directory (the
    # run-record and its scripts nest inside it), submit
    assert [item[0] for item in sent] == ["ssh", "ssh", "rsync", "ssh"]
    assert sent[0][1][0] == "squeue"
    assert sent[1][1][:2] == ["mkdir", "-p"]
    assert sent[2][2].startswith("gpu.lan:/scratch/me/storage/")
    assert sent[3][1][0] == "sbatch"
    assert sent[3][1][1].endswith("/slurm.sh")
    assert submission["job_id"] == 55


def test_submits_locally_when_no_transport_is_connected(tmp_path, monkeypatch):
    monkeypatch.chdir(os.path.dirname(__file__))
    with (
        Storage(str(tmp_path / "storage")),
        Index({"database": str(tmp_path / "index.sqlite")}),
        Project(os.path.dirname(__file__)),
    ):
        component = SlurmInterface()
        execution = Execution.make("slurm", {"confirm": False, "dry": True})
        execution.add(component)
        execution.dispatch()
        script = component.execution.load_file("slurm.sh")

    assert f"#SBATCH --output={tmp_path}" in script
    assert str(tmp_path) in _payload(script)


def test_node_local_staging_composes_with_a_transport(tmp_path, monkeypatch):
    import re
    import subprocess
    import sys

    sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "ssh"))
    from ssh import Ssh

    class StubbedSsh(Ssh):
        def run(self, cmd, **kwargs):
            stdout = "Submitted batch job 7" if cmd[0] == "sbatch" else ""
            return subprocess.CompletedProcess(cmd, 0, stdout=stdout, stderr="")

        def _rsync(self, source, destination, **kwargs):
            return subprocess.CompletedProcess([], 0, stdout="", stderr="")

    project = os.path.dirname(__file__)
    monkeypatch.chdir(project)
    with (
        Storage(str(tmp_path / "storage")),
        Index({"database": str(tmp_path / "index.sqlite")}),
        Project(project),
    ):
        with StubbedSsh(
            {
                "host": "gpu.lan",
                "storage": "/scratch/me/storage",
                "directory": "/home/me/project",
            }
        ):
            component = SlurmInterface()
            execution = Execution.make(
                "slurm",
                {
                    "confirm": False,
                    "node_local": True,
                    "periodic_sync": True,
                    "local_dir": "/nodelocal",
                    "venv_tar": "/sw/venvs/env.tar:venv",
                    # no `python`: the broadcast venv supplies it, which is the
                    # point of node-local when the main venv never leaves home
                },
            )
            execution.add(component)
            execution.dispatch()
            script = component.execution.load_file("slurm.sh")
            uuid = component.uuid

    payload = _payload(script)
    scratch = f"/nodelocal/{uuid}"

    # the venv is broadcast from the cluster's own filesystem: `venv_tar` is
    # already a far-side path and must not be remapped like a record directory
    assert "sbcast --force /sw/venvs/env.tar /nodelocal/venv.tar" in script
    assert ". /nodelocal/venv/bin/activate" in script
    # ... and it, not this machine's interpreter, runs the job
    assert "/nodelocal/venv/bin/python3" in script
    assert sys.executable not in script

    # staging copies the cluster's copy of the record into node scratch
    staged = re.search(r"mkdir -p (\S+) && cp -fr (\S+)/\. (\S+)/", script)
    assert staged is not None, script
    shared = staged.group(2)
    assert shared.startswith("/scratch/me/storage/")
    assert staged.group(1) == staged.group(3) == scratch

    # the payload runs against scratch, and the run-record keeps its position
    # inside the interface directory across the remapping
    assert f"Interface.from_directory('{scratch}')" in payload
    assert "Project('/home/me/project" in payload

    run_directory = re.search(r"Execution\.from_directory\('([^']+)'\)", payload)
    assert run_directory is not None, payload
    run_directory = run_directory.group(1)
    # a `..` chain would still *start* with the scratch prefix while pointing
    # anywhere at all, which is exactly how a half-remapped relpath fails
    assert ".." not in run_directory
    tail = run_directory[len(scratch) + 1 :]
    assert run_directory == f"{scratch}/{tail}"

    # the same run-record, at the same position, on the cluster's shared copy:
    # sbatch's capture and the sync script both address it there, so a failure
    # before the payload starts is still readable after the node is gone
    output = re.search(r"#SBATCH --output=(\S+)", script)
    assert output is not None, script
    assert output.group(1) == f"{shared}/{tail}/job.out"
    assert f'--script-path "{shared}/{tail}/sync.py"' in script

    # results flow back the other way: scratch -> the cluster's shared copy,
    # which is what a later pull to this machine would read
    assert f'--source "{scratch}/"' in script
    assert f'--dest "{shared}/"' in script

    # nothing anywhere names the submitting machine
    assert str(tmp_path) not in script
    assert str(tmp_path) not in payload
