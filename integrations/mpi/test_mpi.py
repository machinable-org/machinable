import os
import shutil

import pytest

from machinable import Execution, Index, Interface, Project, Storage

try:
    import mpi4py
except ImportError:
    mpi4py = None


class MpiExample(Interface):
    def __call__(self):
        print("Hello from MPI script")
        self.save_file("test.txt", "hello")


def test_mpi_dry_run(tmp_path):
    """The submission path runs without an MPI environment when dry."""
    with (
        Storage(str(tmp_path)),
        Index({"database": str(tmp_path / "test.sqlite")}),
    ):
        with Project(os.path.dirname(__file__)):
            interface = MpiExample()
            execution = Execution.make("mpi", {"dry": True})
            execution.add(interface)
            execution.dispatch()
            assert not interface.cached()
            script = interface.execution.load_file("mpi.sh")
            assert "Hello from MPI script" not in (script or "")
            assert (script or "").startswith("#!")


@pytest.mark.skipif(
    not shutil.which("mpirun") or mpi4py is None,
    reason="Test requires MPI environment",
)
def test_mpi_execution(tmp_path):
    with (
        Storage(str(tmp_path)),
        Index({"database": str(tmp_path / "test.sqlite")}),
    ):
        with Project(os.path.dirname(__file__)):
            interface = MpiExample()
            with Execution.get("mpi", resources={"-n": 2}):
                interface.launch()
            assert interface.execution.is_finished()
            assert interface.load_file("test.txt") == "hello"
