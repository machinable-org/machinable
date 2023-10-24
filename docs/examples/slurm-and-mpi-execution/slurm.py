from typing import Optional

import subprocess

from machinable import Execution
from machinable.errors import ExecutionFailed


class Slurm(Execution):
    class Config:
        mpi: Optional[str] = None
        confirm: bool = True

    def on_before_dispatch(self):
        if self.config.confirm:
            print(
                f"Submitting {len(self.pending_executables)} jobs ({len(self.executables)} total). Proceed? [Y/n]: "
            )
            choice = input().lower()
            return {"": True, "yes": True, "y": True, "no": False, "n": False}[
                choice
            ]

    def __call__(self):
        script = "#!/usr/bin/env bash\n"
        for executable in self.pending_executables:
            # check if executable is already launched
            if isinstance(executable.execution, Slurm):
                raise ValueError("same")

            # todo: check if execuable.is_started or is_running
            # if so, skip

            # for uses, check if it is a slurm instance, otherwise raise error to wait for finish first
            # if slurm_id, make job dependent on slurm_id

            resources = self.resources(executable)

            if "--job-name" not in resources:
                resources["--job-name"] = f"{executable.id}"
            if "--output" not in resources:
                resources["--output"] = self.local_directory(
                    executable.id, "output.log"
                )
            if "--open-mode" not in resources:
                resources["--open-mode"] = "append"

            sbatch_arguments = []
            for k, v in resources.items():
                if not k.startswith("--"):
                    continue
                line = "#SBATCH " + k
                if v not in [None, True]:
                    line += f"={v}"
                sbatch_arguments.append(line)
            script += "\n".join(sbatch_arguments) + "\n"

            if self.config.mpi:
                n = int(resources.get("--nodes", 0)) * int(
                    resources.get("--ntasks-per-node", 0)
                )
                if n >= 1:
                    script += f"{self.config.mpi} -n {n} "

            script += executable.dispatch_code()

            # submit to slurm
            process = subprocess.Popen(
                ["sbatch"],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                stdin=subprocess.PIPE,
            )

            process.stdin.write(script.encode("utf8"))

            stdoutput, _ = process.communicate()

            returncode = process.returncode

            if returncode != 0:
                raise ExecutionFailed(
                    self.__repr__(),
                    returncode,
                    stdoutput.decode("utf8").strip(),
                )

            output = stdoutput.decode("utf8").strip()

            try:
                job_id = int(output.rsplit(" ", maxsplit=1)[-1])
            except ValueError:
                job_id = False
            print(
                f"{output} for {executable.id} ({executable.local_directory()} with output at {resources['--output']})"
            )

            # save job information
            self.save_file(
                [executable.id, "slurm.json"],
                data={
                    "job_id": job_id,
                    "cmd": sbatch_arguments,
                    "script": script,
                },
            )

    def canonicalize_resources(self, resources):
        if resources is None:
            return {}

        shorthands = {
            "A": "account",
            "B": "extra-node-info",
            "C": "constraint",
            "c": "cpus-per-task",
            "d": "dependency",
            "D": "workdir",
            "e": "error",
            "F": "nodefile",
            "H": "hold",
            "h": "help",
            "I": "immediate",
            "i": "input",
            "J": "job-name",
            "k": "no-kill",
            "L": "licenses",
            "M": "clusters",
            "m": "distribution",
            "N": "nodes",
            "n": "ntasks",
            "O": "overcommit",
            "o": "output",
            "p": "partition",
            "Q": "quiet",
            "s": "share",
            "t": "time",
            "u": "usage",
            "V": "version",
            "v": "verbose",
            "w": "nodelist",
            "x": "exclude",
            "g": "geometry",
            "R": "no-rotate",
        }

        canonicalized = {}
        for k, v in resources.items():
            prefix = ""
            if k.startswith("#"):
                prefix = "#"
                k = k[1:]

            if k.startswith("--"):
                # already correct
                canonicalized[prefix + k] = str(v)
                continue
            if k.startswith("-"):
                # -p => --partition
                try:
                    if len(k) != 2:
                        raise KeyError("Invalid length")
                    canonicalized[prefix + "--" + shorthands[k[1]]] = str(v)
                    continue
                except KeyError as _ex:
                    raise ValueError(f"Invalid short option: {k}") from _ex
            if len(k) == 1:
                # p => --partition
                try:
                    canonicalized[prefix + "--" + shorthands[k]] = str(v)
                    continue
                except KeyError as _ex:
                    raise ValueError(f"Invalid short option: -{k}") from _ex
            else:
                # option => --option
                canonicalized[prefix + "--" + k] = str(v)

        return canonicalized
