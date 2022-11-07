import commandlib
from machinable import Execution


class Mpi(Execution):
    class Config:
        runner: str = "mpirun"
        n: int = 1

    def on_dispatch_experiment(self, experiment):
        runner = commandlib.Command(self.config.runner, "-n", self.config.n)

        script_filepath = experiment.save_execution_data(
            "mpi.sh", experiment.to_dispatch_code(inline=True)
        )

        print(
            f"Running experiment {experiment.experiment_id} script via MPI at {script_filepath}"
        )
        print(runner(script_filepath).output())
