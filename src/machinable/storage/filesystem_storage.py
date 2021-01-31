import os

import pendulum
from machinable.component.component import Component
from machinable.element.element import Element
from machinable.execution.execution import Execution
from machinable.experiment.experiment import Experiment
from machinable.filesystem.filesystem import FileSystem
from machinable.storage.storage import Storage

epository.make(repository)


class FilesystemStorage(Storage):
    def __init__(self, url):
        self.url = url

    def get_url(self, *append):
        return os.path.join(self.url, *append)

    def write(self, model):
        if isinstance(model, Execution):
            path = f"execution-{pendulum.from_timestamp(model.uid).isoformat()}"
            repo = model.repository.name or ""

            with FileSystem(self.get_url(repo, path), create=True) as fs:
                fs.save_file("execution.json", model.serialize())
                fs.save_file("engine.json", model.engine.serialize())
        if isinstance(model, Experiment):
            model.save()
        if isinstance(model, Component):
            path = model.flags.get("EXPERIMENT_ID", "sdf")
            repo = model.experiment.execution.repository.name or ""
            with FileSystem(self.get_url(repo, path), create=True) as fs:
                fs.save_file("component.json", model.serialize())

    def find(self, model, uid):

        pass

    def read(self, model, uid):
        if model == "Experiment":
            # we need some look up here to find this out
            repo = "bla"
            path = uid
            with FileSystem(self.get_url(repo, path)) as fs:
                e = Experiment.unserialize(
                    {
                        "component": fs.load_file("component.json"),
                        "version": None,
                        "flags": {},
                        "seed": None,
                    }
                )
                # hydrate
                e.__attributes__["config"] = fs.load_file("component.json")
                return e
        elif model == "Execution":
            # uid is timestamp
            path = f"execution-{uid}"
        else:
            return None

    def update(self, path, data):
        pass

    def read(self, path):
        pass
