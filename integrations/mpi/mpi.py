import os
import sys
from typing import Literal

from pydantic import BaseModel, ConfigDict

from machinable import Execution
from machinable.errors import ExecutionFailed
from machinable.utils import chmodx, run_and_stream


class MPI(Execution):
    class Config(BaseModel):
        model_config = ConfigDict(extra="forbid")

        preamble: str | None = ""
        mpi: str | None = "mpirun"
        python: str | None = None
        wrap: list[str] = []
        resume_failed: bool | Literal["new", "skip"] = False
        dry: bool = False

    def version_gated(self, memory_max: str = "15G"):
        return {
            "wrap": ["systemd-run", "--user", "--scope", "-p", f"MemoryMax={memory_max}"]
        }

    def _wrap_command(self, cmd: list) -> list:
        """Prepend the configured ``wrap`` tokens to the launch command."""
        return [*self.config.wrap, *cmd] if self.config.wrap else cmd

    def on_compute_default_resources(self, executable):
        resources = {}

        ranks = executable.config.get("ranks", False)
        if ranks not in [None, False]:
            if ranks == -1:
                ranks = os.environ.get("MPI_RANKS", 0)
            if int(ranks) > 0:
                resources["-n"] = int(ranks)

        return resources

    def __call__(self):
        all_cmds = "#!/usr/bin/env bash\n"
        for executable in self.pending_executables:
            if self.config.resume_failed is not True:
                if (
                    executable.executions.filter(lambda x: x.is_incomplete()).count()
                    > 0
                ):
                    if self.config.resume_failed == "new":
                        executable = executable.new().materialize()
                    elif self.config.resume_failed == "skip":
                        continue
                    else:
                        msg = (
                            f"{executable.module} <{executable.id})>"
                            " has previously been executed unsuccessfully."
                            " Set `resume_failed` to True, 'new' or 'skip'"
                            " to handle resubmission."
                        )
                        if self.config.dry:
                            print("Dry run ... ", msg)
                            continue

                        raise ExecutionFailed(msg)

            resources = self.computed_resources(executable)
            mpi = executable.config.get("mpi", self.config.mpi)
            python = self.config.python or sys.executable

            run_record = Execution()
            run_record.prepare_dispatch(executable)

            script = "#!/usr/bin/env bash\n"

            if self.config.preamble:
                script += self.config.preamble

            # add debug information
            script += "\n"
            script += f"# {executable.module} <{executable.id}>\n"
            script += f"# {executable.local_directory()}\n"
            script += "\n"

            script += self.dispatch_code(
                executable,
                python=python,
                run_record_directory=run_record.local_directory(),
            )

            script_file = chmodx(run_record.save_file("mpi.sh", script))

            if mpi is None:
                cmd = []
            else:
                cmd = [mpi]
            for k, v in resources.items():
                if v is None or v is True:
                    cmd.append(k)
                else:
                    if k.startswith("--"):
                        cmd.append(f"{k}={v}")
                    else:
                        cmd.extend([k, str(v)])

            cmd.append(script_file)
            cmd = self._wrap_command(cmd)

            run_record.save_file(
                "mpi.json",
                data={
                    "cmd": cmd,
                    "script": script,
                },
            )

            if self.config.dry:
                all_cmds += f"# {executable}\n"
                all_cmds += " ".join(cmd) + "\n\n"
                continue

            print(" ".join(cmd))

            # output.log is the interface's own output (written by the payload's
            # tee) so we capture the raw mpirun stream including any failure before
            # Python starts to a sibling job.out on the same run-record.
            with open(
                run_record.local_directory("job.out"),
                "w",
                buffering=1,
            ) as f:
                try:
                    run_and_stream(
                        cmd,
                        stdout_handler=lambda o: [
                            sys.stdout.write(o),
                            f.write(o),
                        ],
                        stderr_handler=lambda o: [
                            sys.stderr.write(o),
                            f.write(o),
                        ],
                    )
                except KeyboardInterrupt as _ex:
                    raise KeyboardInterrupt(
                        "Interrupting `" + " ".join(cmd) + "`"
                    ) from _ex

        if self.config.dry:
            print("# Dry run ...\n# ==============")
            print(all_cmds)
