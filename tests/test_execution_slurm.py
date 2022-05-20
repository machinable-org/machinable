import json
import os
import shutil
import time

import pytest
from machinable import Experiment, Storage
from machinable.execution.slurm import Slurm


class SlurmExperiment(Experiment):
    def on_execute():
        print("Hello world from Slurm")


@pytest.mark.skipif(
    not shutil.which("sbatch")
    or "MACHINABLE_SLURM_TEST_RESOURCES" not in os.environ,
    reason="Test requires Slurm environment",
)
def test_slurm_execution():
    experiment = SlurmExperiment(
        resources=json.loads(
            os.environ.get("MACHINABLE_SLURM_TEST_RESOURCES", "{}")
        )
    )
    experiment.execute("machinable.execution.slurm")
    for _ in range(15):
        if experiment.is_finished():
            assert "Hello world from Slurm" in experiment.output()
            return

        time.sleep(1)
    assert False, "Timeout"


def test_slurm_script():
    experiment = SlurmExperiment()
    Storage.get().commit(experiment)
    script = Slurm().code(experiment)
    exec(script)
