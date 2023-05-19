import json
import os
import shutil
import time

import pytest

try:
    import mpi4py
except ImportError:
    mpi4py = None

from machinable import Component, Execution, Project


def test_docs_snippets_estimate_pi(tmp_storage):
    with Project("docs/snippets/estimate_pi"):
        import docs.snippets.estimate_pi.interface


def test_docs_snippets_tutorial_main(tmp_storage):
    with Project("docs/snippets/tutorial"):
        import docs.snippets.tutorial.main


def test_docs_snippets_tutorial_main_unified(tmp_storage):
    with Project("docs/snippets/tutorial"):
        import docs.snippets.tutorial.main_unified


# Examples/execution


class ExternalComponent(Component):
    def on_create(self):
        print("Hello from MPI script")
        self.save_file("test.txt", "hello")


@pytest.mark.skipif(
    not shutil.which("mpirun") or mpi4py is None,
    reason="Test requires MPI environment",
)
def test_mpi_execution(tmp_storage):
    with Project.instance("docs/snippets/examples"):
        component = ExternalComponent()
        with Execution.get("execution.mpi"):
            component.launch()
        assert component.is_finished()
        assert component.load_file("test.txt") == "hello"


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
    with Project.instance("docs/snippets/examples"), Execution.get(
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
