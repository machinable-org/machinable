import json
import os
import shutil
import time

import pytest

try:
    import mpi4py
except ImportError:
    mpi4py = None

from machinable import Execution, Experiment, Project


def test_docs_snippets_estimate_pi(tmp_storage):
    with Project.instance("docs/snippets/estimate_pi"):
        import docs.snippets.estimate_pi.interface


def test_docs_snippets_tutorial_main(tmp_storage):
    with Project.instance("docs/snippets/tutorial"):
        import docs.snippets.tutorial.main


def test_docs_snippets_tutorial_main_unified(tmp_storage):
    with Project.instance("docs/snippets/tutorial"):
        import docs.snippets.tutorial.main_unified


# Examples/execution


class ExternalExperiment(Experiment):
    def on_create(self):
        print("Hello from MPI script")
        self.save_data("test.txt", "hello")


@pytest.mark.skipif(
    not shutil.which("mpirun") or mpi4py is None,
    reason="Test requires MPI environment",
)
def test_mpi_execution(tmp_storage):
    with Project.instance("docs/snippets/examples"):
        experiment = ExternalExperiment()
        with Execution.get("execution.mpi"):
            experiment.launch()
        assert experiment.is_finished()
        assert experiment.load_data("test.txt") == "hello"


class SlurmExperiment(Experiment):
    def __call__(self):
        print("Hello world from Slurm")
        self.save_data("test_run.json", {"success": True})


@pytest.mark.skipif(
    not shutil.which("sbatch")
    or "MACHINABLE_SLURM_TEST_RESOURCES" not in os.environ,
    reason="Test requires Slurm environment",
)
def test_slurm_execution(tmp_storage):
    experiment = SlurmExperiment()
    with Project.instance("docs/snippets/examples"), Execution.get(
        "execution.slurm",
        resources=json.loads(
            os.environ.get("MACHINABLE_SLURM_TEST_RESOURCES", "{}")
        ),
    ):
        experiment.launch()
        for _ in range(30):
            if experiment.is_finished():
                assert "Hello world from Slurm" in experiment.output()
                assert experiment.load_data("test_run.json")["success"] is True
                return

            time.sleep(1)
        assert False, "Timeout"
