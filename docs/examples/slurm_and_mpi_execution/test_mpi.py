import shutil

import pytest
from machinable import Component, Execution, Project

try:
    import mpi4py
except ImportError:
    mpi4py = None


class ExternalComponent(Component):
    def on_create(self):
        print("Hello from MPI script")
        self.save_file("test.txt", "hello")


@pytest.mark.skipif(
    not shutil.which("mpirun") or mpi4py is None,
    reason="Test requires MPI environment",
)
def test_mpi_execution(tmp_storage):
    with Project.instance("docs/examples"):
        component = ExternalComponent()
        with Execution.get("execution.mpi"):
            component.launch()
        assert component.is_finished()
        assert component.load_file("test.txt") == "hello"
