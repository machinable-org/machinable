from typing import Literal, Optional, Union

import os
import sys

from machinable import Execution
from machinable.errors import ExecutionFailed
from machinable.utils import chmodx, run_and_stream
from pydantic import BaseModel, ConfigDict


class MPI(Execution):
    class Config(BaseModel):
        model_config = ConfigDict(extra="forbid")

        preamble: Optional[str] = ""
        mpi: Optional[str] = "mpirun"
        python: Optional[str] = None
        resume_failed: Union[bool, Literal["new", "skip"]] = False
        dry: bool = False

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
        all_script = "#!/usr/bin/env bash\n"
        for executable in self.pending_executables:
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
                        msg = f"{executable.module} <{executable.id})> has previously been executed unsuccessfully. Set `resume_failed` to True, 'new' or 'skip' to handle resubmission."
                        if self.config.dry:
                            print("Dry run ... ", msg)
                            continue

                        raise ExecutionFailed(msg)

            resources = self.computed_resources(executable)
            mpi = executable.config.get("mpi", self.config.mpi)
            python = self.config.python or sys.executable

            script = "#!/usr/bin/env bash\n"

            if self.config.preamble:
                script += self.config.preamble

            # add debug information
            script += "\n"
            script += f"# {executable.module} <{executable.id}>\n"
            script += f"# {executable.local_directory()}>\n"
            script += "\n"

            script += executable.dispatch_code(python=python)

            script_file = chmodx(
                self.save_file(
                    [executable.id, "mpi.sh"],
                    script,
                )
            )

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

            self.save_file(
                [executable.id, "mpi.json"],
                data={
                    "cmd": cmd,
                    "script": script,
                },
            )

            all_script += f"# {executable}\n"
            all_script += " ".join(cmd) + "\n\n"

            if self.config.dry:
                continue

            print(" ".join(cmd))

            with open(
                self.local_directory(executable.id, "output.log"),
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

        sp = chmodx(self.save_file("mpi.sh", all_script))

        if self.config.dry:
            print(f"# Dry run ... \n# ==============\n{sp}\n\n")
            print(all_script)
