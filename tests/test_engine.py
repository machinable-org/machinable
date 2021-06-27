import shutil

import pytest
from machinable import Execution, Experiment, Project, errors
from machinable.execution import Execution


def test_local_engine():
    Project("./tests/samples/project").connect()
    Execution("machinable.engine.local_engine").add(
        Experiment("execution.basics")
    ).dispatch()


def test_slurm_engine():
    Project("./tests/samples/project").connect()
    execution = Execution("machinable.engine.slurm_engine").add(
        Experiment("execution.basics")
    )
    if shutil.which("sbatch") is None:
        # sbatch is not available
        with pytest.raises(errors.ExecutionFailed):
            execution.dispatch()
