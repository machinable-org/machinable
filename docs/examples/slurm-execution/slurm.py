from typing import Literal, Optional, Union

import os
import subprocess
import sys
import time

import yaml
from machinable import Execution, Project
from machinable.errors import ExecutionFailed
from machinable.utils import chmodx, run_and_stream
from pydantic import BaseModel, ConfigDict


def yes_or_no() -> bool:
    choice = input().lower()
    return {"": True, "yes": True, "y": True, "no": False, "n": False}[choice]


def confirm(execution: Execution) -> bool:
    sys.stdout.write(
        "\n".join(execution.pending_executables.map(lambda x: x.module))
    )
    sys.stdout.write(
        f"\nSubmitting {len(execution.pending_executables)} jobs ({len(execution.executables)} total). Proceed? [Y/n]: "
    )
    if yes_or_no():
        sys.stdout.write("yes\n")
        return True
    else:
        sys.stdout.write("no\n")
        return False


class Job:
    def __init__(self, job_id: str):
        self.job_id = job_id
        self.details = self._fetch_details()

    def _fetch_details(self) -> dict:
        cmd = ["scontrol", "show", "job", str(self.job_id)]
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
        cmd = ["scancel", str(self.job_id)]
        result = subprocess.run(cmd, capture_output=True)
        return result.returncode == 0


class Slurm(Execution):
    class Config(BaseModel):
        model_config = ConfigDict(extra="forbid")

        preamble: Optional[str] = ""
        mpi: Optional[str] = "mpirun"
        throttle: float = 0.5
        confirm: bool = True
        copy_project_source: bool = True
        resume_failed: Union[bool, Literal["new", "skip"]] = False

    def on_before_dispatch(self):
        if self.config.confirm:
            return confirm(self)

    def on_compute_default_resources(self, executable):
        resources = {}
        resources["-p"] = "development"
        resources["-t"] = "2:00:00"
        if (nodes := executable.config.get("nodes", False)) not in [
            None,
            False,
        ]:
            resources["--nodes"] = nodes
        if (ranks := executable.config.get("ranks", False)) not in [
            None,
            False,
        ]:
            resources["--ntasks-per-node"] = ranks

        return resources

    def __call__(self):
        jobs = {}
        for executable in self.pending_executables:
            # check if job is already launched
            if job := Job.find_by_name(executable.id):
                if job.status in ["PENDING", "RUNNING"]:
                    print(
                        f"{executable.id} is already launched with job_id={job.job_id}, skipping ..."
                    )
                    continue

            if self.config.resume_failed is not True:
                if (
                    executable.executions.filter(
                        lambda x: x.is_incomplete(executable)
                    ).count()
                    > 0
                ):
                    if self.config.resume_failed == "new":
                        executable = executable.new().commit()
                    elif self.config.resume_failed == "skip":
                        continue
                    else:
                        raise ExecutionFailed(
                            f"{executable.module} <{executable.id})> has previously been executed unsuccessfully. Set `resume_failed` to True, 'new' or 'skip' to handle resubmission."
                        )

            source_code = Project.get().path()
            if self.config.copy_project_source:
                print("Copy project source code ...")
                source_code = self.local_directory(executable.id, "source_code")
                cmd = ["rsync", "-a", Project.get().path(""), source_code]
                print(" ".join(cmd))
                run_and_stream(cmd, check=True)

            script = "#!/usr/bin/env bash\n"

            resources = self.computed_resources(executable)
            mpi = executable.config.get("mpi", self.config.mpi)

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
                resources["--output"] = os.path.abspath(
                    self.local_directory(executable.id, "output.log")
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

            script += "\n".join(sbatch_arguments) + "\n\n"

            if self.config.preamble:
                script += self.config.preamble

            if mpi:
                if mpi[-1] != " ":
                    mpi += " "
                script += mpi

            script += executable.dispatch_code(project_directory=source_code)

            print(f"Submitting job {executable} with resources: ")
            print(yaml.dump(resources))

            # submit to slurm
            script_file = chmodx(
                self.save_file([executable.id, "slurm.sh"], script)
            )

            cmd = ["sbatch", script_file]
            print(" ".join(cmd))

            try:
                output = subprocess.run(
                    cmd,
                    text=True,
                    check=True,
                    env=os.environ,
                    capture_output=True,
                )
                print(output.stdout)
            except subprocess.CalledProcessError as _ex:
                print(_ex.output)
                raise _ex

            try:
                job_id = int(output.stdout.rsplit(" ", maxsplit=1)[-1])
            except ValueError:
                job_id = False
            print(
                f"{job_id}  named `{resources['--job-name']}` for {executable.local_directory()} (output at {resources['--output']})"
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
