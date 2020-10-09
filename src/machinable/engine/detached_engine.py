import os
import sys
from subprocess import call

from ..core.exceptions import ExecutionException
from .engine import Engine


class DetachedEngine(Engine):
    def __init__(self, engine=None, using="tmux", exit_on_completion=True):
        if using not in ["tmux"]:
            raise ValueError(f"Invalid detached mode: {using}")
        self.engine = Engine.create(engine)
        self.using = using
        self.exit_on_completion = exit_on_completion

        Engine.set_latest(self)

    def _submit(self, execution):
        name = "machinable-experiment-" + execution.experiment_id

        url = os.path.join(
            execution.storage.get("url", "mem://"),
            execution.storage.get("directory", ""),
            execution.experiment_id,
        )
        engine = self.engine.to_json().replace('"', '\\"')
        project = execution.project.to_json().replace('"', '\\"')
        code = f"""
        import machinable as ml
        e = ml.Execution.from_storage('{url}')
        e.set_engine(ml.Engine.from_json('{engine}'))
        e.set_storage({execution.storage})
        e.set_project(ml.Project.from_json('{project}'))
        e.submit()
        """.replace(
            "\n        ", ";"
        )[
            1:-1
        ]
        command = f'{sys.executable or "python"} -c "{code}"'
        if self.exit_on_completion:
            command += "; exit"

        try:
            p = self.shell(command, name=name)
            execution.set_result(p)
        except BaseException as ex:
            execution.set_result(ExecutionException(str(ex), reason="engine_failure"))
            self.log(f"Execution failed: {str(ex)}", level="error")

        return execution

    def on_before_storage_creation(self, execution):
        if execution.storage.config.get("url", "mem://").startswith("mem://"):
            raise ValueError("Detached engine does not support temporary file systems")

    def serialize(self):
        return {
            "type": "detached",
            "engine": self.engine.serialize(),
            "using": self.using,
            "exit_on_completion": self.exit_on_completion,
        }

    @classmethod
    def unserialize(cls, serialized):
        serialized["engine"] = Engine.unserialize(serialized["engine"])
        return cls.create(serialized)

    def __repr__(self):
        return f"Engine <detached({repr(self.engine)})>"

    def shell(self, command, name):
        return getattr(self, self.using + "_shell")(command, name)

    # using

    def tmux_shell(self, command, name):
        return call(
            f"tmux new -d -s {name}; tmux send-keys `{command}` Enter", shell=True
        )
