import json
import os
import shutil
import time

import pytest
from machinable import Component, Execution, Project


class SlurmComponent(Component):
    def __call__(self):
        print("Hello world from Slurm")
        self.save_file("test_run.json", {"success": True})


@pytest.mark.skipif(
    not shutil.which("sbatch")
    or "MACHINABLE_SLURM_TEST_RESOURCES" not in os.environ,
    reason="Test requires Slurm environment",
)
def test_slurm_execution(tmp_storage):
    component = SlurmComponent()
    with Project.instance("docs/examples"), Execution.get(
        "execution.slurm",
        resources=json.loads(
            os.environ.get("MACHINABLE_SLURM_TEST_RESOURCES", "{}")
        ),
    ):
        component.launch()
        for _ in range(30):
            if component.is_finished():
                assert "Hello world from Slurm" in component.output()
                assert component.load_file("test_run.json")["success"] is True
                return

            time.sleep(1)
        assert False, "Timeout"
