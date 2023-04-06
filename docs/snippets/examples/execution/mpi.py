import subprocess

from machinable import Execution


class Mpi(Execution):
    class Config:
        runner: str = "mpirun"
        n: int = 1

    def __call__(self):
        for experiment in self.experiments:
            print(
                subprocess.check_output(
                    [
                        self.config.runner,
                        "-n",
                        str(self.config.n),
                        self.save_file(
                            f"mpi-{experiment.experiment_id}.sh",
                            experiment.dispatch_code(),
                        ),
                    ]
                ).decode("ascii")
            )
