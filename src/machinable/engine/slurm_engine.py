from typing import Optional

import commandlib
from machinable import errors
from machinable.engine.engine import Engine
from machinable.experiment import Experiment
from machinable.project import Project
from machinable.repository import Repository
from pydantic.errors import ExtraError


def _wrap(line):
    if not line:
        return ""
    if not line.endswith("\n"):
        line += "\n"
    return line


class SlurmEngine(Engine):
    class Config:
        python: str = "python"
        shebang: str = "#!/usr/bin/env bash"

    def _dispatch(self):
        sbatch = commandlib.Command("sbatch")

        results = []
        for experiment in self.execution.experiments:
            script = f"{self.config.shebang}\n"

            resources = self.resources(experiment)
            if "--job-name" not in resources:
                resources["--job-name"] = f"{experiment.experiment_id}"
            if "--output" not in resources:
                resources["--output"] = experiment.local_directory("output.log")
            if "--open-mode" not in resources:
                resources["--open-mode"] = "append"

            sbatch_arguments = []
            for k, v in resources.items():
                line = "#SBATCH " + k
                if v not in [None, True]:
                    line += f"={v}"
                sbatch_arguments.append(line)
            script += "\n".join(sbatch_arguments) + "\n"

            script += _wrap(self.before_script(experiment))

            script += _wrap(self.script(experiment))

            script += _wrap(self.after_script(experiment))

            # submit to slurm
            try:
                output = sbatch.piped.from_string(script).output().strip()
                try:
                    job_id = int(output.rsplit(" ", maxsplit=1)[-1])
                except ValueError:
                    job_id = False
                print(output)
                experiment.save_execution_data(
                    filepath="slurm.json",
                    data={
                        "job_id": job_id,
                        "cmd": sbatch_arguments,
                        "script": script,
                        "resources": resources,
                        "project_directory": self.project_directory(experiment),
                        "project_source": self.project_source(experiment),
                    },
                )
                results.append(job_id)
            except FileNotFoundError as _exception:
                raise errors.ExecutionFailed(
                    "Slurm sbatch not found."
                ) from _exception
            except commandlib.exceptions.CommandExitError as _exception:
                raise errors.ExecutionFailed(
                    "Could not submit job to Slurm"
                ) from _exception

        return results

    def project_source(self, experiment: Experiment) -> str:
        return Project.get().path()

    def project_directory(self, experiment: Experiment) -> str:
        return Project.get().path()

    def before_script(self, experiment: Experiment) -> Optional[str]:
        """Returns script to be executed before the component dispatch"""

    def script(self, experiment: Experiment) -> Optional[str]:
        return f'{self.config.python} -c "{self.code(experiment)}"'

    def code(self, experiment: Experiment) -> Optional[str]:
        repository = Repository.get().as_json().replace('"', '\\"')
        return f"""
        from machinable import Project, Repository, Experiment
        Project('{self.project_directory(experiment)}').connect()
        Repository.from_json('{repository}').connect()
        experiment = Experiment.find('{experiment.experiment_id}', timestamp={experiment.timestamp})
        experiment.interface().dispatch()
        """.replace(
            "\n        ", ";"
        )[
            1:-1
        ]

    def after_script(self, experiment: Experiment) -> Optional[str]:
        """Returns script to be executed after the component dispatch"""

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
                canonicalized[prefix + k] = v
                continue
            if k.startswith("-"):
                # -p => --partition
                try:
                    if len(k) != 2:
                        raise KeyError("Invalid length")
                    canonicalized[prefix + "--" + shorthands[k[1]]] = v
                    continue
                except KeyError as _ex:
                    raise ValueError(f"Invalid short option: {k}") from _ex
            if len(k) == 1:
                # p => --partition
                try:
                    canonicalized[prefix + "--" + shorthands[k]] = v
                    continue
                except KeyError as _ex:
                    raise ValueError(f"Invalid short option: -{k}") from _ex
            else:
                # option => --option
                canonicalized[prefix + "--" + k] = v

        return canonicalized

    def __repr__(self):
        return "Engine <slurm>"
