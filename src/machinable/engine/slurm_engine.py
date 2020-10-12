import json
import os
import stat

import pendulum
import sh

from ..core.exceptions import ExecutionException
from ..filesystem import open_fs
from ..utils.formatting import exception_to_str
from .engine import Engine


class SlurmEngine(Engine):
    def __init__(self, commands=None, python="python", script="#!/usr/bin/env bash"):
        self.commands = self._parse_commands(commands)
        self.python = python
        self.script = script
        Engine.set_latest(self)

    def _parse_commands(self, commands):
        if isinstance(commands, (str, list, tuple)):
            commands = {"script": commands}
        elif commands is None:
            commands = {}

        if not isinstance(commands, dict):
            raise ValueError(f"Invalid command specification: {commands}")

        parsed = {}
        events = [
            "setup",
            "before_script",
            "after_script",
        ]
        for key, command in commands.items():
            if key not in events:
                raise ValueError(
                    f"Invalid command event: {key}. Available events: {events}"
                )

            if isinstance(command, (list, tuple)):
                command = ";\n".join(command)

            if command is None or command.strip() == "":
                continue

            if command.endswith(";"):
                command = command[:-1]

            parsed[key] = command

        return parsed

    def serialize(self):
        return {
            "type": "slurm",
            "commands": self.commands,
            "python": self.python,
            "script": self.script,
        }

    def _submit(self, execution):
        url = os.path.join(
            execution.storage.config["url"],
            execution.storage.config["directory"] or "",
            execution.experiment_id,
        )

        # script path
        script_path = "_engine/slurm_" + pendulum.now().strftime("%d-%m-%Y_%H-%M-%S")
        with open_fs(url) as filesystem:
            filesystem.makedirs(script_path, recreate=True)
        script_url = os.path.join(url, script_path)

        # submission
        project = json.dumps(execution.project.options).replace('"', '\\"')
        code = f"""
        import machinable as ml
        e = ml.Execution.from_storage('{url}')
        e.set_engine('native')
        e.set_storage({execution.storage.config})
        e.set_project(ml.Project.from_json('{project}'))
        e.filter(lambda i, component, _: component == '$COMPONENT_ID')
        e.submit()
        """.replace(
            "\n        ", ";"
        )[
            1:-1
        ]
        submission = (
            f'cd {execution.project.directory_path};\n{self.python} -c "{code};"\n'
        )

        for (
            index,
            execution_type,
            component,
            components,
            storage,
            resources,
            args,
            kwargs,
        ) in execution.schedule.iterate(execution.storage.config):
            component_id = component["flags"]["COMPONENT_ID"]
            component_path = os.path.join(url.replace("osfs://", ""), component_id)
            os.makedirs(component_path, exist_ok=True)
            script = f"{self.script}\n"
            script += f'#SBATCH --job-name="{execution.experiment_id}:{component_id}"\n'
            script += f"#SBATCH -o {os.path.join(component_path,  'output.log')}\n"
            script += "#SBATCH --open-mode=append\n"
            script += f"export MACHINABLE_PROJECT={execution.project.directory_path}\n"
            try:
                script += self.commands["before_script"] + ";\n"
            except KeyError:
                pass

            script += submission.replace("$COMPONENT_ID", component_id)

            try:
                script += self.commands["after_script"] + ";\n"
            except KeyError:
                pass

            # write script to disk
            target = os.path.join(
                script_url.replace("osfs://", ""), f"{component_id}.sh"
            )

            if target.find("://") != -1:
                raise ValueError("Slurm engine only support local storages")

            with open(target, "w") as f:
                f.write(script)
            st = os.stat(target)
            os.chmod(target, st.st_mode | stat.S_IEXEC)

            # submit to slurm
            try:
                sbatch_arguments = [
                    k + "=" + v if v is not None else k
                    for k, v in self.canonicalize_resources(resources).items()
                ]
                p = sh.sbatch(*sbatch_arguments)
                output = p.stdout.decode("utf-8")
                slurm_id = int(output.rsplit(" ", maxsplit=1)[-1])
                execution.set_result({"slurm_id": slurm_id}, echo=False)
            except Exception as ex:
                if isinstance(ex, sh.ErrorReturnCode):
                    message = ex.stderr.decode("utf-8")
                else:
                    message = exception_to_str(ex)
                execution.set_result(
                    ExecutionException(message, reason="engine_failure"), echo=True,
                )

        total = len(execution.schedule._result)
        success = len(execution.schedule._result) - execution.failures
        self.log(f"Submitted {success}/{total} jobs successfully")

        return execution

    def on_before_storage_creation(self, execution):
        if execution.storage.config.get("url", "mem://").startswith("mem://"):
            raise ValueError("Remote engine does not support temporary file systems")

        # disable output redirection and rely on Slurm output log instead
        def disable_output_redirection(i, component, element):
            element[1]["flags"]["OUTPUT_REDIRECTION"] = "DISABLED"
            return element

        execution.schedule.transform(disable_output_redirection)

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
            if k.startswith("-/"):
                prefix = "-/"
                k = k[2:]

            if k.startswith("--"):
                # already correct
                canonicalized[prefix + k] = v
                continue
            if k.startswith("-"):
                # -p => --partition
                try:
                    canonicalized[prefix + "--" + shorthands[k[1]]] = v
                    continue
                except KeyError:
                    raise ValueError(f"Invalid short option: {k}")
            if len(k) == 1:
                # p => --partition
                try:
                    canonicalized[prefix + "--" + shorthands[k]] = v
                    continue
                except KeyError:
                    raise ValueError(f"Invalid short option: -{k}")
            else:
                # option => --option
                canonicalized[prefix + "--" + k] = v

        return canonicalized

    def __repr__(self):
        return f"Engine <slurm>"
