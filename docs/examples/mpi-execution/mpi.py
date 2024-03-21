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

        mpi: Optional[str] = "mpirun"
        ranks: Optional[int] = None
        nodes: Optional[int] = None
        resume_failed: Union[bool, Literal["new", "skip"]] = False

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

            # automatically infer the ranks and nodes from the executable
            # (if the executable does not expose `ranks`, `nodes` will be ignored)
            if (ranks := self.config.ranks) == -1:
                ranks = executable.config.get("ranks", False)
            if (nodes := self.config.nodes) == -1:
                nodes = executable.config.get("nodes", None)
            if self.config.mpi is None or ranks is False:
                # single-threaded execution
                executable.dispatch()
            else:
                # run using MPI
                script_file = chmodx(
                    self.save_file(
                        [executable.id, "mpi.sh"],
                        "#!/usr/bin/env bash\n\n" + executable.dispatch_code(),
                    )
                )
                cmd = [shutil.which(self.config.mpi)]
                if isinstance(ranks, int):
                    cmd.extend(["-n", str(ranks)])
                if isinstance(nodes, int):
                    cmd.extend(
                        [
                            "-N",
                            str(nodes),
                        ]
                    )

                cmd.append(script_file)
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
