import copy
import json
import os

import sh

from ..core.exceptions import ExecutionException
from ..utils.dicts import update_dict
from .engine import Engine


class RemoteEngine(Engine):
    def __init__(
        self, engine=None, host=None, directory=None, python="python", sync=None
    ):
        if host is None:
            raise ValueError("You have to provide a remote host")
        if directory is None:
            raise ValueError("You have to provide a remote directory")
        self.engine = Engine.create(engine)
        self.host = host
        self.directory = directory
        self.python = python
        self.shell = sh.ssh.bake(self.host)
        self.sync = update_dict({"delete_on_remote": False}, sync)

        Engine.set_latest(self)

    def serialize(self):
        return {
            "type": "remote",
            "engine": self.engine.serialize(),
            "host": self.host,
            "directory": self.directory,
            "python": self.python,
        }

    @classmethod
    def unserialize(cls, serialized):
        serialized["engine"] = Engine.unserialize(serialized["engine"])
        return cls.create(serialized)

    def submit(self, execution):
        if execution.storage.get("url", "mem://").startswith("mem://"):
            raise ValueError("Remote engine does not support temporary file systems")
        self.log(
            f"Rsyncing project {execution.project.directory_path} -> {self.host}:{self.directory}"
        )
        path = execution.project.directory_path
        if path[-1] != "/":
            path += "/"
        sh.rsync(
            "-azL",
            path,
            f"{self.host}:{self.directory}"
            f"{' --delete' if self.sync.get('delete_on_remote', False) else ''}",
        )
        self.log("Rsync complete. Executing ...")

        # todo$: handle local URLs and ssh URL correctly
        #  i.e. mirror local one to remote, remove ssh prefix if same as self.host

        url = os.path.join(
            execution.storage["url"],
            execution.storage.get("directory", ""),
            execution.experiment_id,
        )
        engine = self.engine.to_json().replace('"', '\\"')
        remote_project = copy.deepcopy(execution.project.options)
        remote_project["directory"] = self.directory
        project = json.dumps(remote_project).replace('"', '\\"')
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
        command = f'`cd {self.directory}; {self.python} -c "{code}"`'
        try:
            p = self.shell(command, _bg=True)
            execution.set_result(p)
        except sh.ErrorReturnCode as ex:
            execution.set_result(
                ExecutionException(ex.stderr.decode("utf-8"), reason="engine_failure")
            )
            self.log(f"Execution failed: {str(ex)}", level="error")

        return execution

    def __repr__(self):
        return f"Remote({repr(self.engine)})"
