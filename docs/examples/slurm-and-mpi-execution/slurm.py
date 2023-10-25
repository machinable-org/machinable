from typing import Literal, Optional

import subprocess
import time

from machinable import Execution
from machinable.errors import ExecutionFailed


class Job:
    def __init__(self, job_id: str):
        self.job_id = job_id
        self.details = self._fetch_details()

    def _fetch_details(self) -> dict:
        cmd = ["scontrol", "show", "job", self.job_id]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            return None

        details = {}
        raw_info = result.stdout.split()
        for item in raw_info:
            if "=" in item:
                key, value = item.split("=", 1)
                details[key] = value
        return details

    @classmethod
    def find_by_name(cls, job_name: str) -> Optional["Job"]:
        cmd = ["squeue", "--name", job_name, "--noheader", "--format=%i"]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode == 0 and result.stdout.strip():
            return cls(result.stdout.strip())

        return None

    @property
    def status(
        self,
    ) -> Literal[
        "",
        "PENDING",
        "RUNNING",
        "SUSPENDED",
        "CANCELLED",
        "COMPLETED",
        "FAILED",
        "TIMEOUT",
        "PREEMPTED",
    ]:
        return self.details.get("JobState", "")

    @property
    def info(self) -> dict:
        return self.details

    def cancel(self) -> bool:
        cmd = ["scancel", self.job_id]
        result = subprocess.run(cmd, capture_output=True)
        return result.returncode == 0


class Slurm(Execution):
    class Config:
        mpi: Optional[str] = None
        throttle: float = 0.5
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
        jobs = {}
        for executable in self.pending_executables:
            script = "#!/usr/bin/env bash\n"

            # check if job is already launched
            if job := Job.find_by_name(executable.id):
                if job.status in ["PENDING", "RUNNING"]:
                    print(
                        f"{executable.id} is already launched with job_id={job.job_id}, skipping ..."
                    )
                    continue

            resources = self.computed_resources(executable)

            # usage dependencies
            if "--dependency" not in resources and (
                dependencies := executable.uses
            ):
                ds = []
                for dependency in dependencies:
                    if dependency.id in jobs:
                        ds.append(str(jobs[dependency.id]))
                    else:
                        if job := Job.find_by_name(dependency.id):
                            ds.append(str(job.job_id))
                if ds:
                    resources["--dependency"] = "afterok:" + (":".join(ds))

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
                f"{output}  named `{resources['--job-name']}` for {executable.local_directory()} (output at {resources['--output']})"
            )

            # save job information
            jobs[executable.id] = job_id
            self.save_file(
                [executable.id, "slurm.json"],
                data={
                    "job_id": job_id,
                    "cmd": sbatch_arguments,
                    "script": script,
                },
            )

            if self.config.throttle > 0 and len(self.pending_executables) > 1:
                time.sleep(self.config.throttle)

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
