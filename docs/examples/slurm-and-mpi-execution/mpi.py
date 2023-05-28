import os
import stat
import subprocess

from machinable import Execution


class Mpi(Execution):
    class Config:
        runner: str = "mpirun"
        n: int = 1

    def __call__(self):
        for executable in self.pending_executables:
            script_file = self.save_file(
                f"mpi-{executable.id}.sh",
                executable.dispatch_code(),
            )
            st = os.stat(script_file)
            os.chmod(script_file, st.st_mode | stat.S_IEXEC)
            print(
                subprocess.check_output(
                    [
                        self.config.runner,
                        "-n",
                        str(self.config.n),
                        script_file,
                    ]
                ).decode("ascii")
            )
