import os
import shutil
import subprocess
import sys
import time
from pathlib import Path
from typing import Literal, Optional

import arrow
import yaml
from pydantic import BaseModel, ConfigDict

from machinable import Execution, Index, Project
from machinable.errors import ExecutionFailed
from machinable.utils import chmodx, run_and_stream


class Slurm(Execution):
    handoff = True

    class Config(BaseModel):
        model_config = ConfigDict(extra="forbid")

        preamble: str | None = ""
        mpi: str | None = "mpirun"
        mpi_args: str = ""
        wrap: list[str] = []
        python: str | None = None
        throttle: float = 0.5
        confirm: bool = True
        copy_project_source: bool = False
        resume_failed: bool | Literal["new", "skip"] = False
        dry: bool = False

        default_resources: dict[str, str] = {
            "-p": "development",
            "-t": "1:00:00",
        }
        rsync_excludes: list[str] = [".git"]
        rsync_filter: str | None = "dir-merge,- .gitignore"
        exclude_index_directory: bool = False

        node_local: bool = False
        local_dir: str | None = None
        venv_tar: str | None = None

        periodic_sync: bool = False
        periodic_sync_interval: int = 30

    def __call__(self):
        jobs = {}
        for executable in self.pending_executables:
            if self._skip_if_launched(executable, jobs):
                continue

            executable, skip = self._handle_resume_failed(executable)
            if skip:
                continue

            run_record = Execution()
            run_record.prepare_dispatch(executable)

            source_code, project_subdir = self._prepare_source_code(
                executable, run_record
            )
            resources = self.computed_resources(executable)
            script, sbatch_arguments = self._build_script(
                executable, run_record, source_code, project_subdir, resources, jobs
            )
            result = self._submit_job(
                executable, run_record, script, sbatch_arguments, jobs
            )

            if result is None:
                # dry run
                continue

            if self.config.throttle > 0 and len(self.pending_executables) > 1:
                time.sleep(self.config.throttle)

    def on_before_dispatch(self):
        if self.config.confirm and not self.config.dry:
            return confirm(self)

    def on_compute_default_resources(self, executable):
        resources = dict(self.config.default_resources)
        if (nodes := executable.config.get("nodes", False)) not in [
            None,
            False,
        ]:
            resources["--nodes"] = nodes
        ranks = self._resolve_ranks(executable)
        if ranks is not None and ranks > 0:
            resources["--ntasks-per-node"] = ranks
        return resources

    @staticmethod
    def _resolve_ranks(executable):
        ranks = executable.config.get("ranks", False)
        if ranks in [None, False]:
            return None
        if ranks == -1:
            ranks = os.environ.get("MPI_RANKS", 0)
        return int(ranks)

    def _skip_if_launched(self, executable, jobs):
        if job := Job.find_by_name(executable.id):
            if job.status in ["PENDING", "RUNNING"]:
                print(
                    f"{executable.id} is already launched with job_id={job.job_id}, skipping ..."
                )
                return True
        return False

    def _handle_resume_failed(self, executable):
        if self.config.resume_failed is not True:
            if executable.executions.filter(lambda x: x.is_incomplete()).count() > 0:
                if self.config.resume_failed == "new":
                    return executable.new().materialize(), False
                elif self.config.resume_failed == "skip":
                    return executable, True
                else:
                    err = (
                        f"{executable.module} <{executable.id})> has previously been "
                        f"executed unsuccessfully. Set `resume_failed` to True, "
                        f"'new' or 'skip' to handle resubmission."
                    )
                    if self.config.dry:
                        print(err)
                    else:
                        raise ExecutionFailed(err)
        return executable, False

    def _prepare_source_code(self, executable, run_record):
        """Rsync source code into a local staging directory (if enabled).

        Returns (source_code, project_subdir) where project_subdir is the
        relative path from source_code to the actual project directory.  When
        `copy_project_source` is True the rsync copies the project contents
        directly so project_subdir is ".".  Otherwise source_code is cwd and
        the project may live in a subdirectory.
        """
        source_code = os.getcwd()
        project_subdir = make_relative_if_subpath(
            os.path.abspath(Project.get().path()), source_code
        )

        if self.config.exclude_index_directory:
            index = Index.get()
            index_directory = os.path.abspath(index.config.directory)
            index_exclude = make_relative_if_subpath(index_directory, source_code)
        else:
            index_exclude = None

        if not self.config.copy_project_source:
            return source_code, project_subdir

        print("Copy project source code ...")
        dest = run_record.local_directory("source_code")
        cmd = ["rsync", "-rLptgoD"]
        for exc in self.config.rsync_excludes:
            cmd += ["--exclude", exc]
        if index_exclude:
            cmd += ["--exclude", index_exclude]
        if self.config.rsync_filter:
            cmd += ["--filter", self.config.rsync_filter]
        cmd += [Project.get().path(""), dest]

        print(" ".join(cmd))
        if not self.config.dry:
            run_and_stream(cmd, check=True)
        else:
            print("Dry run, skipping rsync ...")

        # rsync copies the project contents directly into dest, so no subdir
        return dest, "."

    def _generate_sbatch_header(self, resources):
        lines = []
        for k, v in resources.items():
            if not k.startswith("--"):
                continue
            line = "#SBATCH " + k
            if v not in [None, True]:
                line += f"={v}"
            lines.append(line)
        return lines

    def _build_mpi_prefix(self, mpi, mpi_args):
        if not mpi:
            return ""
        prefix = mpi if mpi.endswith(" ") else mpi + " "
        if mpi_args:
            prefix += mpi_args
            if not prefix.endswith(" "):
                prefix += " "
        return prefix

    def _generate_node_local_setup(
        self, executable, source_code, resources, copy_source
    ):
        local_dir = self.config.local_dir or os.environ.get(
            "MACHINABLE_SLURM_LOCAL_DIR", "/tmp"
        )
        venv_tar = self.config.venv_tar or os.environ.get(
            "MACHINABLE_SLURM_VENV_TAR", None
        )
        venv_name = "venv"
        if venv_tar and ":" in venv_tar:
            venv_tar, venv_name = venv_tar.rsplit(":", 1)

        local_directory = os.path.abspath(executable.local_directory())
        fragment = ""

        distribute_cmds = []
        payload_items = []
        if copy_source:
            distribute_cmds += [
                f"mkdir -p {local_dir}/source_code",
                f"cp -fr {os.path.join(source_code, '')}. {local_dir}/source_code/",
            ]
            payload_items.append("source_code")
        distribute_cmds += [
            f"mkdir -p {local_dir}/{executable.uuid}",
            f"cp -fr {local_directory}/. {local_dir}/{executable.uuid}/",
        ]
        payload_items.append(executable.uuid)

        fragment += " && ".join(distribute_cmds) + "\n\n"
        fragment += f"cd {local_dir}\n"
        fragment += f"tar -cf payload_src.tar {' '.join(payload_items)}\n"

        # Commands to run on every node after sbcast
        unpack_cmds = [f"cd {local_dir}", "tar -xf payload.tar"]

        if venv_tar:
            fragment += f"sbcast --force {venv_tar} {local_dir}/venv.tar\n"
            unpack_cmds.append("tar -xf venv.tar")

        fragment += (
            f"sbcast --force {local_dir}/payload_src.tar {local_dir}/payload.tar\n"
        )

        distribute_script = " && ".join(unpack_cmds)
        fragment += "# Distribute files to each node's local directory\n"
        fragment += (
            f"srun --overlap --mem=0 --cpu-bind=none "
            f"-n $SLURM_NNODES -N $SLURM_NNODES --ntasks-per-node=1 "
            f"/bin/bash -c '{distribute_script}'\n\n"
        )

        if venv_tar:
            fragment += f". {local_dir}/{venv_name}/bin/activate\n\n"

        if copy_source:
            effective_source_code = f"{local_dir}/source_code"
        else:
            # Source stays at its original location, mirroring the
            # behavior when node_local is disabled.
            effective_source_code = source_code
        fragment += f"cd {effective_source_code}\n"

        # Determine effective python path
        effective_python = self.config.python
        if effective_python is None:
            effective_python = (
                f"{local_dir}/{venv_name}/bin/python3" if venv_tar else sys.executable
            )

        return fragment, effective_source_code, effective_python, local_dir

    def _resolve_controller_rank(self, resources):
        return 0

    @staticmethod
    def _last_node_srun_prefix():
        return (
            "srun --overlap --nodes=1 --ntasks=1 "
            '--nodelist="$(scontrol show hostnames $SLURM_JOB_NODELIST '
            '| tail -n 1)" '
        )

    def _generate_periodic_sync_start(
        self, executable, python, sync_file, local_dir, local_directory, resources
    ):
        """Generate the script fragment that starts the background sync daemon
        on the last allocated node (where the controller rank saves files).
        """
        controller_rank = self._resolve_controller_rank(resources)
        srun_prefix = self._last_node_srun_prefix()
        return (
            f"{srun_prefix}{python} {sync_file} "
            f'--source "{local_dir}/{executable.uuid}/" '
            f'--dest "{local_directory}/" '
            f"--interval {self.config.periodic_sync_interval} "
            f"--controller-rank {controller_rank} "
            f'--script-path "{sync_file}"\n'
        )

    def _generate_final_sync(
        self, executable, python, sync_file, local_dir, local_directory, resources
    ):
        """Generate the script fragment for the final result collection sync
        on the last allocated node.
        """
        controller_rank = self._resolve_controller_rank(resources)
        srun_prefix = self._last_node_srun_prefix()
        return (
            f"\n\n# Collect results from local directory (last node)\n"
            f"{srun_prefix}{python} {sync_file} "
            f'--source "{local_dir}/{executable.uuid}/" '
            f'--dest "{local_directory}/" '
            f"--interval 0 "
            f"--controller-rank {controller_rank} "
            f'--script-path "{sync_file}"\n'
        )

    def _generate_debug_footer(self, executable):
        """Generate trailing comments with debug/provenance information"""
        footer = "\n\n"
        footer += f"# generated at: {arrow.now()}\n"
        footer += f"# {executable.module} <{executable.id}>\n"
        footer += f"# {executable.local_directory()}\n\n"
        footer += "# " + yaml.dump(executable.version()).replace("\n", "\n# ")
        footer += "\n"
        return footer

    def _submit_job(self, executable, run_record, script, sbatch_arguments, jobs):
        """Write script to disk and submit via sbatch. Returns job_id or False"""
        script_file = chmodx(run_record.save_file("slurm.sh", script))

        cmd = ["sbatch", script_file]
        print(" ".join(cmd))

        run_record.save_file(
            "slurm.json",
            data={
                "job_id": None,
                "cmd": sbatch_arguments,
                "script": script,
            },
        )

        if self.config.dry:
            print("Dry run ... ", executable)
            return None

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
            raise RuntimeError(
                f"Command {' '.join(cmd)} failed with exit code {_ex.returncode}:\n"
                f"STDOUT: {_ex.stdout}\n"
                f"STDERR: {_ex.stderr}"
            ) from _ex

        try:
            job_id = int(output.stdout.rsplit(" ", maxsplit=1)[-1])
        except ValueError:
            job_id = False

        print(
            f"{job_id}  named `{sbatch_arguments}` for {executable.local_directory()}"
        )

        # persist job information
        jobs[executable.id] = job_id
        run_record.save_file(
            "slurm.json",
            data={
                "job_id": job_id,
                "cmd": sbatch_arguments,
                "script": script,
            },
        )

        return job_id

    def _build_script(
        self, executable, run_record, source_code, project_subdir, resources, jobs
    ):
        script = "#!/usr/bin/env bash\n"

        mpi = executable.config.get("mpi", self.config.mpi)
        mpi_args = self.config.mpi_args
        ranks = self._resolve_ranks(executable)
        if ranks is not None and mpi_args:
            mpi_args = mpi_args.replace("{ranks}", str(ranks))
        python = self.config.python or sys.executable

        if "--dependency" not in resources and (dependencies := executable.uses):
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
            # the run's own output.log is written by the payload's tee; sbatch
            # captures the raw job stream (incl. failures before Python starts)
            # to a sibling job.out on the same run-record.
            resources["--output"] = os.path.abspath(
                run_record.local_directory("job.out")
            )
        if "--open-mode" not in resources:
            resources["--open-mode"] = "append"

        # --- SBATCH header ---
        sbatch_arguments = self._generate_sbatch_header(resources)
        script += "\n".join(sbatch_arguments) + "\n\n"

        # --- preamble (env exports, module loads, etc.) ---
        if self.config.preamble:
            script += self.config.preamble
            if not self.config.preamble.endswith("\n"):
                script += "\n"

        # --- node-local setup (optional) ---
        local_dir = None
        if self.config.node_local:
            (
                node_local_fragment,
                source_code,
                python,
                local_dir,
            ) = self._generate_node_local_setup(
                executable,
                source_code,
                resources,
                self.config.copy_project_source,
            )
            script += node_local_fragment

        # --- periodic sync start (optional, requires node_local) ---
        sync_file = None
        local_directory = os.path.abspath(executable.local_directory())
        if self.config.periodic_sync and self.config.node_local:
            sync_file = chmodx(run_record.save_file("sync.py", periodic_sync_script))
            script += self._generate_periodic_sync_start(
                executable, python, sync_file, local_dir, local_directory, resources
            )

        mpi_prefix = self._build_mpi_prefix(mpi, mpi_args)
        if self.config.wrap:
            mpi_prefix = " ".join(self.config.wrap) + " " + mpi_prefix

        # --- dispatch ---
        project_directory = os.path.join(source_code, project_subdir)
        if self.config.node_local:
            interface_shared = os.path.abspath(executable.local_directory())
            interface_scratch = os.path.join(local_dir, executable.uuid)
            rr_shared = os.path.abspath(run_record.local_directory())
            rr_scratch = os.path.join(
                interface_scratch, os.path.relpath(rr_shared, interface_shared)
            )
            dispatch = self.dispatch_code(
                executable,
                python=python,
                project_directory=project_directory,
                interface_directory=interface_scratch,
                run_record_directory=rr_scratch,
            )
        else:
            dispatch = self.dispatch_code(
                executable,
                project_directory=project_directory,
                python=python,
                run_record_directory=run_record.local_directory(),
            )
        script += mpi_prefix + dispatch

        # --- final sync (optional, requires node_local) ---
        if self.config.periodic_sync and self.config.node_local and sync_file:
            # re-derive the un-mpi'd python for sync invocation
            venv_tar_value = self.config.venv_tar or os.environ.get(
                "MACHINABLE_SLURM_VENV_TAR"
            )
            venv_name = "venv"
            if venv_tar_value and ":" in venv_tar_value:
                _, venv_name = venv_tar_value.rsplit(":", 1)
            sync_python = self.config.python or (
                f"{local_dir}/{venv_name}/bin/python3"
                if venv_tar_value
                else sys.executable
            )
            script += self._generate_final_sync(
                executable,
                sync_python,
                sync_file,
                local_dir,
                local_directory,
                resources,
            )

        script += self._generate_debug_footer(executable)

        print(f"Submitting job {executable} with resources: ")
        print(yaml.dump(resources))

        return script, sbatch_arguments

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
                canonicalized[prefix + k] = str(v)
                continue
            if k.startswith("-"):
                try:
                    if len(k) != 2:
                        raise KeyError("Invalid length")
                    canonicalized[prefix + "--" + shorthands[k[1]]] = str(v)
                    continue
                except KeyError as _ex:
                    raise ValueError(f"Invalid short option: {k}") from _ex
            if len(k) == 1:
                try:
                    canonicalized[prefix + "--" + shorthands[k]] = str(v)
                    continue
                except KeyError as _ex:
                    raise ValueError(f"Invalid short option: -{k}") from _ex
            else:
                canonicalized[prefix + "--" + k] = str(v)

        return canonicalized


def yes_or_no() -> bool:
    choice = input().lower()
    return {"": True, "yes": True, "y": True, "no": False, "n": False}[choice]


def confirm(execution: Execution) -> bool:
    sys.stdout.write("\n".join(execution.pending_executables.map(lambda x: x.module)))
    sys.stdout.write(
        f"\nSubmitting {len(execution.pending_executables)} jobs "
        f"({len(execution.interfaces)} total). Proceed? [Y/n]: "
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
        if shutil.which("squeue") is None:
            return None  # no Slurm on this host (e.g. a dry run)
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


periodic_sync_script = """#!/usr/bin/env python3
import argparse
import os
import subprocess
import sys
import time


def rsync_once(source: str, dest: str) -> int:
    expanded_source = os.path.expandvars(source)
    if os.path.exists(expanded_source):
        cmd = ["rsync", "-a", "--update", expanded_source, dest]
        try:
            result = subprocess.run(cmd, check=False, capture_output=True, text=True)
            return result.returncode
        except Exception:
            return 1
    return 0


def rsync_loop(source: str, dest: str, interval: int) -> None:
    while True:
        rsync_once(source, dest)
        time.sleep(interval)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--dest", required=True)
    parser.add_argument("--interval", type=int, default=30)
    parser.add_argument("--controller-rank", type=int, default=0)
    parser.add_argument("--daemon", action="store_true")
    parser.add_argument("--script-path", required=False)
    args = parser.parse_args()

    if args.daemon:
        rsync_loop(args.source, args.dest, args.interval)
        return

    from mpi4py import MPI

    comm = MPI.COMM_WORLD
    rank = comm.Get_rank()

    if rank == args.controller_rank:
        if args.interval == 0:
            # Single sync and exit
            rsync_once(args.source, args.dest)
        else:
            # Start daemon process for periodic sync
            script_path = args.script_path if args.script_path else __file__

            proc = subprocess.Popen(
                [
                    sys.executable,
                    script_path,
                    "--daemon",
                    "--source",
                    args.source,
                    "--dest",
                    args.dest,
                    "--interval",
                    str(args.interval),
                ],
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                start_new_session=True,
            )
    comm.Barrier()


if __name__ == "__main__":
    main()
"""


def make_relative_if_subpath(path, root):
    path_abs = Path(path).resolve()
    root_abs = Path(root).resolve()
    try:
        return str(path_abs.relative_to(root_abs))
    except ValueError:
        return str(path)
