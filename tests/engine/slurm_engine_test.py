from machinable import Execution
from machinable.engine import Slurm
import sh


def test_slurm_engine():
    execution = Execution(
        "thenode",
        storage="./_test_data/storage/slurm",
        engine=Slurm(),
        project="./test_project",
    ).submit()
    assert str(execution.schedule._result[0]).find("sh.CommandNotFound: sbatch") > 0

    def sbatch(*args, **kwargs):
        return sh.bash(args[-1])

    sh.sbatch = sbatch
    Execution(
        "thenode",
        storage="./_test_data/storage/slurm",
        engine=Slurm(),
        project="./test_project",
    ).submit()
