import shutil

import pytest
from machinable import Component, Execution, Index, Project

try:
    import mpi4py
except ImportError:
    mpi4py = None


class MpiExample(Component):
    def __call__(self):
        print("Hello from MPI script")
        self.save_file("test.txt", "hello")


@pytest.mark.skipif(
    not shutil.which("mpirun") or mpi4py is None,
    reason="Test requires MPI environment",
)
def test_mpi_execution(tmp_path):
    with Index(
        {"directory": str(tmp_path), "database": str(tmp_path / "test.sqlite")}
    ):
        with Project("docs/examples/mpi-execution"):
            component = MpiExample()
            with Execution.get("mpi"):
                component.launch()
            assert component.execution.is_finished()
            assert component.load_file("test.txt") == "hello"
