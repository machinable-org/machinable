import json
import os
import shutil
import time
from pathlib import Path

import pytest
from machinable import Component, Execution, Index, Project


class SlurmComponent(Component):
    def __call__(self):
        print("Hello world from Slurm")
        self.save_file("test_run.json", {"success": True})


@pytest.mark.skipif(
    not shutil.which("sbatch")
    or "MACHINABLE_SLURM_TEST_RESOURCES" not in os.environ,
    reason="Test requires Slurm environment",
)
def test_slurm_execution(tmp_path):
    component = SlurmComponent()
    directory = os.environ.get("MACHINABLE_SLURM_TEST_DIRECTORY", None)
    if directory is not None:
        tmp_path = Path(directory) / component.uuid
    with Index(
        {"directory": str(tmp_path), "database": str(tmp_path / "test.sqlite")}
    ):
        with Project("docs/examples/slurm_and_mpi_execution"):
            with Execution.get(
                "slurm",
                resources=json.loads(
                    os.environ.get("MACHINABLE_SLURM_TEST_RESOURCES", "{}")
                ),
            ):
                component.launch()

            for _ in range(60):
                if component.is_finished():
                    assert "Hello world from Slurm" in component.output()
                    assert (
                        component.load_file("test_run.json")["success"] is True
                    )
                    return

                time.sleep(1)
            print(component.output())
            assert False, f"Timeout for {component.local_directory()}"
