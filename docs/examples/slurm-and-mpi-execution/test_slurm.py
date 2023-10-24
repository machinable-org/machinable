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
    with Index(str(tmp_path)):
        with Project("docs/examples/slurm-and-mpi-execution"):
            # standard submission
            with Execution.get(
                "slurm",
                {"confirm": False},
                resources=json.loads(
                    os.environ.get("MACHINABLE_SLURM_TEST_RESOURCES", "{}")
                ),
            ):
                component = SlurmComponent().launch()

            status = False
            for _ in range(60):
                if component.execution.is_finished():
                    assert (
                        "Hello world from Slurm" in component.execution.output()
                    )
                    assert (
                        component.load_file("test_run.json")["success"] is True
                    )
                    status = True
                    break

                time.sleep(1)
            print(component.execution.output())
            assert status, f"Timeout for {component.local_directory()}"
