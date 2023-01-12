import commandlib
from machinable import Execution


class Mpi(Execution):
    class Config:
        runner: str = "mpirun"
        n: int = 1

    def on_dispatch(self):
        for experiment in self.experiments:
            runner = commandlib.Command(self.config.runner, "-n", self.config.n)

            script_filepath = self.save_data(
                "mpi.sh", experiment.to_dispatch_code(inline=True)
            )

            print(
                f"Running experiment {experiment.experiment_id} script via MPI at {script_filepath}"
            )
            print(runner(script_filepath).output())
