"""The `ssh` transport against a real Slurm, in a container.

The unit tests assert what the submission *builds*; this one submits it. A
single-node Slurm reachable over SSH stands in for the cluster, so the
generated script is actually accepted by `sbatch`, the payload actually
imports on the far side, and the run's markers and results actually come back.

Requires docker. Skipped when it is unavailable; build once, reuse after:

    docker build -t machinable-slurm:test integrations/ssh/docker
"""

import os
import shutil
import socket
import subprocess
import sys
import time

import pytest

from machinable import Execution, Index, Interface, Project, Storage

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "slurm"))
from ssh import Ssh  # noqa: E402

IMAGE = "machinable-slurm:test"
CONTAINER = "machinable-slurm-test"
DOCKER_DIR = os.path.join(os.path.dirname(__file__), "docker")
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

pytestmark = pytest.mark.skipif(
    shutil.which("docker") is None
    or subprocess.run(
        ["docker", "info"], capture_output=True, timeout=30
    ).returncode
    != 0,
    reason="requires a usable docker",
)


def _free_port() -> int:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def _run(*args, **kwargs):
    return subprocess.run(args, capture_output=True, text=True, **kwargs)


@pytest.fixture(scope="module")
def cluster(tmp_path_factory):
    """A single-node Slurm reachable over SSH, and a transport pointed at it."""
    keys = tmp_path_factory.mktemp("ssh")
    key = str(keys / "id_ed25519")
    _run("ssh-keygen", "-t", "ed25519", "-N", "", "-f", key, "-q", check=True)

    if _run("docker", "image", "inspect", IMAGE).returncode != 0:
        build = _run("docker", "build", "-t", IMAGE, DOCKER_DIR, timeout=900)
        if build.returncode != 0:
            pytest.skip(f"could not build {IMAGE}: {build.stderr[-500:]}")

    port = _free_port()
    _run("docker", "rm", "-f", CONTAINER)
    started = _run(
        "docker", "run", "-d", "--name", CONTAINER,
        "--hostname", "machinable-slurm",
        "-p", f"{port}:22",
        "-e", f"SSH_PUBKEY={open(key + '.pub').read().strip()}",
        "-v", f"{REPO}:/machinable:ro",
        IMAGE,
    )
    if started.returncode != 0:
        pytest.skip(f"could not start {CONTAINER}: {started.stderr[-500:]}")

    transport = Ssh(
        {
            "host": "root@127.0.0.1",
            "directory": "/root/project",
            "storage": "/root/storage",
            "options": [
                "-p", str(port),
                "-i", key,
                "-o", "StrictHostKeyChecking=no",
                "-o", "UserKnownHostsFile=/dev/null",
                "-o", "BatchMode=yes",
                "-o", "LogLevel=ERROR",
            ],
        }
    )

    try:
        deadline = time.time() + 120
        while time.time() < deadline:
            probe = transport.run(["sinfo", "-h", "-o", "%T"], check=False)
            if probe.returncode == 0 and probe.stdout.strip() == "idle":
                break
            time.sleep(2)
        else:
            logs = _run("docker", "logs", CONTAINER)
            pytest.skip(f"cluster did not come up: {logs.stdout[-500:]}")
        yield transport
    finally:
        _run("docker", "rm", "-f", CONTAINER)


def test_dispatch_runs_on_the_cluster_and_the_results_come_back(
    cluster, tmp_path, monkeypatch
):
    """Submit from here, run there, read the record here."""
    project = tmp_path / "project"
    project.mkdir()
    (project / "payload.py").write_text(
        "from machinable import Interface\n\n\n"
        "class Payload(Interface):\n"
        "    def __call__(self):\n"
        "        import socket\n"
        '        print("running on", socket.gethostname())\n'
        '        self.save_file("result.json", {"host": socket.gethostname()})\n'
    )
    monkeypatch.chdir(project)

    with (
        Storage(str(tmp_path / "storage")),
        Index({"database": str(tmp_path / "index.sqlite")}),
        Project(str(project)),
        cluster,
    ):
        cluster.push(str(project), "/root/project")

        interface = Interface.make("payload")
        execution = Execution.make(
            "slurm",
            {
                "confirm": False,
                "python": "/opt/venv/bin/python3",
                "mpi": None,
            },
        )
        execution.add(interface)
        execution.dispatch()

        run = interface.execution

        assert run.status_snapshot().is_pending
        assert run.load_file("slurm.json")["job_id"] > 0

        status = cluster.wait(interface, interval=2, timeout=180)
        assert status.is_finished, (
            f"run did not finish; job.out: {run.load_file('job.out', '')!r}"
        )
        assert status.is_started and not status.is_pending

        assert "running on machinable-slurm" in (run.output() or "")
        assert interface.load_file("result.json") is None

        cluster.sync(interface)
        assert interface.load_file("result.json") == {"host": "machinable-slurm"}


def test_cancel_reaches_a_run_on_the_cluster(cluster, tmp_path, monkeypatch):
    """The cancel marker has to land where the payload reads it, not here."""
    project = tmp_path / "project"
    project.mkdir()
    (project / "slow.py").write_text(
        "from machinable import Interface\n\n\n"
        "class Slow(Interface):\n"
        "    def __call__(self):\n"
        "        import time\n"
        '        print("started", flush=True)\n'
        "        for _ in range(1800):\n"
        "            time.sleep(0.1)\n"
        '        self.save_file("finished.json", {"ok": True})\n'
    )
    monkeypatch.chdir(project)

    with (
        Storage(str(tmp_path / "storage")),
        Index({"database": str(tmp_path / "index.sqlite")}),
        Project(str(project)),
        cluster,
    ):
        cluster.push(str(project), "/root/project")

        interface = Interface.make("slow")
        execution = Execution.make(
            "slurm",
            {"confirm": False, "python": "/opt/venv/bin/python3", "mpi": None},
        )
        execution.add(interface)
        execution.dispatch()
        run = interface.execution

        deadline = time.time() + 120
        while time.time() < deadline:
            cluster.sync(interface, status_only=True)
            if run.status_snapshot().is_started:
                break
            time.sleep(2)
        assert run.status_snapshot().is_started, "payload never started"

        run.cancel()

        listing = cluster.run(
            ["ls", cluster.path(run.local_directory())], check=False
        )
        assert "cancelled" in listing.stdout, listing.stdout

        status = cluster.wait(interface, interval=2, timeout=120)
        assert status.is_finished or status.is_incomplete, status
        assert interface.load_file("finished.json") is None
