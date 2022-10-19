from typing import Any, List, Optional, Union

import os
import stat
import sys

import commandlib
from machinable import errors
from machinable.execution import Execution
from machinable.experiment import Experiment
from machinable.project import Project
from machinable.storage import Storage


def _wrap(line):
    if not line:
        return ""
    if not line.endswith("\n"):
        line += "\n"
    return line


class External(Execution):
    class Config:
        shebang: str = "#!/usr/bin/env bash"
        python: Optional[str] = None
        runner: Union[str, List[str]] = "bash"

    def on_dispatch(self) -> List[Any]:
        if isinstance(self.config.runner, str):
            runner = commandlib.Command(self.config.runner)
        else:
            runner = commandlib.Command(*self.config.runner)

        results = []
        for experiment in self.experiments:
            script = f"{self.config.shebang}\n"

            script += self.script_body(experiment)

            # submit to runner

            script_filepath = experiment.save_execution_data(
                "runner.sh", script
            )
            st = os.stat(script_filepath)
            os.chmod(script_filepath, st.st_mode | stat.S_IEXEC)

            print(
                f"Running experiment {experiment.experiment_id} script at {script_filepath}"
            )
            try:
                output = runner(script_filepath).output()
                print(output)
                results.append(output)
            except FileNotFoundError as _exception:
                raise errors.ExecutionFailed("Runner not found") from _exception
            except commandlib.exceptions.CommandExitError as _exception:
                raise errors.ExecutionFailed(
                    "Could not submit job to runner"
                ) from _exception

        return results

    def project_source(self, experiment: Experiment) -> str:
        return Project.get().path()

    def project_directory(self, experiment: Experiment) -> str:
        return Project.get().path()

    def before_script(self, experiment: Experiment) -> Optional[str]:
        """Returns script to be executed before the experiment dispatch"""

    def script(self, experiment: Experiment) -> Optional[str]:
        return f'{self.config.python or sys.executable} -c "{self.code(experiment)}"'

    def code(self, experiment: Experiment) -> Optional[str]:
        storage = Storage.get().as_json().replace('"', '\\"')
        return f"""
        from machinable import Project, Storage, Experiment
        Project('{self.project_directory(experiment)}').connect()
        Storage.from_json('{storage}').connect()
        experiment = Experiment.find('{experiment.experiment_id}', timestamp={experiment.timestamp})
        assert experiment.__module__ == experiment.__model__.module, 'Could not instantiate experiment'
        experiment.dispatch()
        """.replace(
            "\n        ", ";"
        )[
            1:-1
        ]

    def after_script(self, experiment: Experiment) -> Optional[str]:
        """Returns script to be executed after the experiment dispatch"""

    def script_body(self, experiment: Experiment) -> str:
        script = ""

        script += _wrap(self.before_script(experiment))
        script += _wrap(self.script(experiment))
        script += _wrap(self.after_script(experiment))

        return script

    def __repr__(self):
        return "Execution <external>"
