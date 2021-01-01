import sh
from machinable import Execution
from machinable.engine.slurm_engine import SlurmEngine


def test_slurm_engine(tmp_path):
    execution = Execution(
        "thenode",
        storage=tmp_path / "storage/slurm",
        engine=Slurm(),
        project="./test_project",
    ).submit()
    assert (
        str(execution.schedule._result[0]).find("sh.CommandNotFound: sbatch")
        > 0
    )

    def sbatch(*args, **kwargs):
        return sh.bash(args[-1])

    sh.sbatch = sbatch
    Execution(
        "thenode",
        storage=tmp_path / "storage/slurm",
        engine=Slurm(),
        project="./test_project",
    ).submit()


def test_slurm_engine_script_modifier_methods(tmp_path):
    class TestEngine(Slurm):
        def before_script(self, execution, config):
            return f"{execution.project.path()}; {config.a};"

    Execution(
        "thenode",
        storage=tmp_path / "storage/slurm",
        engine=TestEngine(),
        project="./test_project",
    ).submit()
