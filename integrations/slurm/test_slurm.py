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
