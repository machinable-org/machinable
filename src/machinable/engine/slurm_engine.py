import json
import os
import stat

import pendulum
import sh

from ..config.interface import mapped_config
from ..core.exceptions import ExecutionException
from ..filesystem import abspath, open_fs
from ..utils.formatting import exception_to_str
from ..utils.utils import call_with_context
from .engine import Engine


def _wrap(line):
    if not line:
        return ""
    if not line.endswith("\n"):
        line += "\n"
    return line


class SlurmEngine(Engine):
    def __init__(self, commands=None, python="python", shebang="#!/usr/bin/env bash"):
        self.commands = self._parse_commands(commands)
        self.python = python
        self.shebang = shebang
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
            "shebang": self.shebang,
        }

    def _dispatch(self, execution):
        url = os.path.join(
            execution.storage.config["url"],
            execution.storage.config["directory"] or "",
            execution.submission_id,
        )

        # script path
        script_path = "engine/slurm_" + pendulum.now().strftime("%d-%m-%Y_%H-%M-%S")
        with open_fs(url) as filesystem:
            filesystem.makedirs(script_path, recreate=True)
        script_url = os.path.join(url, script_path)

        # submission
        project = json.dumps(execution.project.options).replace('"', '\\"')
        code = f"""
        import machinable as ml
        e = ml.Execution.from_storage('{abspath(url)}')
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
            script = f"{self.shebang}\n"
            script += f'#SBATCH --job-name="{execution.submission_id}:{component_id}"\n'
            script += f"#SBATCH -o {os.path.join(component_path,  'output.log')}\n"
            script += "#SBATCH --open-mode=append\n"
            _c = mapped_config(component)
            _cc = mapped_config(components)
            script += _wrap(
                call_with_context(
                    self.before_script,
                    execution=execution,
                    index=index,
                    execution_type=execution_type,
                    component=_c,
                    components=_cc,
                    config=_c.config,
                    flags=_c.flags,
                    storage=storage,
                    resources=resources,
                    args=args,
                    kwargs=kwargs,
                )
            )
            script += submission.replace("$COMPONENT_ID", component_id)
            script += _wrap(
                call_with_context(
                    self.after_script,
                    execution=execution,
                    index=index,
                    execution_type=execution_type,
                    component=_c,
                    components=_cc,
                    config=_c.config,
                    flags=_c.flags,
                    storage=storage,
                    resources=resources,
                    args=args,
                    kwargs=kwargs,
                )
            )

            # write script to disk
            target = os.path.join(
                script_url.replace("osfs://", ""), f"{component_id}.sh"
            )

            if target.find("://") != -1:
                raise ValueError("Slurm engine only supports local storages")

            with open(target, "w") as f:
                f.write(script)
            st = os.stat(target)
            os.chmod(target, st.st_mode | stat.S_IEXEC)

            # submit to slurm
            try:
                sbatch_arguments = []
                canonical_resources = self.canonicalize_resources(resources)
                for k, v in canonical_resources.items():
                    sbatch_arguments.append(k)
                    if v not in [None, True]:
                        sbatch_arguments.append(str(v))
                sbatch_arguments.append(target)
                p = sh.sbatch(*sbatch_arguments)
                output = p.stdout.decode("utf-8")
                try:
                    job_id = int(output.rsplit(" ", maxsplit=1)[-1])
                except ValueError:
                    job_id = False
                info = {
                    "job_id": job_id,
                    "cmd": "sbatch " + " ".join(sbatch_arguments),
                    "script": target,
                    "resources": canonical_resources,
                }
                execution.set_result(info, echo=False)
                execution.storage.save_file(f"{component_id}/engine/slurm.json", info)
            except Exception as ex:
                if isinstance(ex, sh.ErrorReturnCode):
                    message = ex.stderr.decode("utf-8")
                else:
                    message = exception_to_str(ex)
                execution.set_result(
                    ExecutionException(message, reason="engine_failure"),
                    echo=True,
                )

        total = len(execution.schedule._result)
        success = len(execution.schedule._result) - execution.failures
        self.log(f"Submitted {success}/{total} jobs successfully")

        return execution

    def before_script(self) -> str:
        if "before_script" not in self.commands:
            return ""
        return self.commands["before_script"] + ";"

    def after_script(self) -> str:
        if "after_script" not in self.commands:
            return ""
        return self.commands["after_script"] + ";"

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
                    if len(k) != 2:
                        raise KeyError("Invalid length")
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
