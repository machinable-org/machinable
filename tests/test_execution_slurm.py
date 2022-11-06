import json
import os
import shutil
import time

import pytest
from machinable import Experiment, Storage
from machinable.execution.slurm import Slurm


class SlurmExperiment(Experiment):
    def on_execute(self):
        print("Hello world from Slurm")
        self.save_data("test_run.json", {"success": True})


@pytest.mark.skipif(
    not shutil.which("sbatch")
    or "MACHINABLE_SLURM_TEST_RESOURCES" not in os.environ,
    reason="Test requires Slurm environment",
)
def test_slurm_execution(tmp_path):
    with Storage.filesystem(str(tmp_path)):
        experiment = SlurmExperiment(
            resources=json.loads(
                os.environ.get("MACHINABLE_SLURM_TEST_RESOURCES", "{}")
            )
        )
        experiment.execute("machinable.execution.slurm")
        for _ in range(30):
            if experiment.is_finished():
                assert "Hello world from Slurm" in experiment.output()
                assert experiment.load_data("test_run.json")["success"] is True
                return

            time.sleep(1)
        assert False, "Timeout"


def test_slurm_script(tmp_storage):
    experiment = SlurmExperiment()
    Storage.get().commit(experiment)
    script = Slurm().code(experiment)
    exec(script)
