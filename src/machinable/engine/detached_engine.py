import os
import sys
from shlex import quote

from ..core.settings import get_settings
from .engine import Engine


class DetachedEngine(Engine):
    def __init__(self, engine=None, using="tmux", close=True):
        if using not in ["tmux"]:
            raise ValueError(f"Invalid detached mode: {using}")
        self.engine = Engine.create(engine)
        self.using = using
        self.close = close

    def submit(self, execution):
        name = "machinable-experiment-" + execution.experiment_id

        url = os.path.join(
            execution.storage.get("url", "mem://"), execution.experiment_id
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
        if self.close:
            command += "; exit"
        self.shell(command, name=name)

        return execution

    def storage_middleware(self, storage):
        if not storage.get("url", "mem://").startswith("mem://"):
            return storage

        # use temporary directory
        storage["url"] = get_settings()["tmp_directory"]

        # todo$: how to clean up?

        return storage

    def serialize(self):
        return {
            "type": "detached",
            "engine": self.engine.serialize(),
            "using": self.using,
            "close": self.close,
        }

    @classmethod
    def unserialize(cls, serialized):
        serialized["engine"] = Engine.unserialize(serialized["engine"])
        return cls.create(serialized)

    def __repr__(self):
        return f"Detached({repr(self.engine)}, using={self.using})"

    def shell(self, command, name):
        return getattr(self, self.using + "_shell")(command, name)

    # using

    def tmux_shell(self, command, name):
        return os.system(
            f"tmux new-session -d -s {name}; tmux send-keys {quote(command)} Enter"
        )
