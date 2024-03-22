from typing import Literal, Optional, Union

import shutil
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
        resume_failed: Union[bool, Literal["new", "skip"]] = False

    def on_compute_default_resources(self, executable):
        resources = {}

        ranks = executable.config.get("ranks", False)
        if ranks not in [None, False]:
            resources["-n"] = int(ranks)

        return resources

    def __call__(self):
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
                        raise ExecutionFailed(
                            f"{executable.module} <{executable.id})> has previously been executed unsuccessfully. Set `resume_failed` to True, 'new' or 'skip' to handle resubmission."
                        )

            resources = self.computed_resources(executable)
            mpi = executable.config.get("mpi", self.config.mpi)

            if mpi is None:
                executable.dispatch()
            else:
                script = "#!/usr/bin/env bash\n"

                if self.config.preamble:
                    script += self.config.preamble

                script += executable.dispatch_code()

                script_file = chmodx(
                    self.save_file(
                        [executable.id, "mpi.sh"],
                        script,
                    )
                )

                cmd = [shutil.which(self.config.mpi)]
                for k, v in resources.items():
                    if v not in [None, True]:
                        if k.startswith("--"):
                            cmd.append(f"{k}={v}")
                        else:
                            cmd.extend([k, str(v)])
                    else:
                        cmd.append(k)
                cmd.append(script_file)

                print(" ".join(cmd))

                self.save_file(
                    [executable.id, "mpi.json"],
                    data={
                        "cmd": cmd,
                        "script": script,
                    },
                )

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
