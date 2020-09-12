from machinable import Execution
from machinable.engine import Slurm


def test_slurm_engine():
    execution = Execution(
        "thenode",
        storage="./_test_data/storage/slurm",
        engine=Slurm(),
        project="./test_project",
    ).submit()
    assert str(execution.schedule._result[0]).find("sh.CommandNotFound: sbatch") > 0
