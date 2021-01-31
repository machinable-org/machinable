import json
import os
import uuid

import pendulum
from fs import open_fs
from machinable.filesystem.filesystem import FileSystem
from machinable.repository.repository import Repository
from machinable.utils.host import get_host_info
from machinable.utils.traits import Discoverable


class Storage(Discoverable):
    """Storage base class"""

    @classmethod
    def make(cls, args):
        """hack"""
        return cls(args)

    def __init__(self, filesystem, index=None) -> None:
        super().__init__()
        self.filesystem = filesystem
        self.index = index
        self.format = "v3a"

    def get_url(self, *append):
        # url = self.filesystem.url
        # hack
        url = self.filesystem
        return os.path.join(url, *append)

    @classmethod
    def connect(cls, url):
        from machinable.element.element import Element

        Element.__storage__ = cls.make(url)

    def create(self, element, repository=None):
        assert element.uuid is None

        element.uuid = str(uuid.uuid4())

        from machinable.component.component import Component
        from machinable.execution.execution import Execution

        if isinstance(element, Execution):
            # filesystem
            # todo: use self.filesystem
            path = f"execution-{pendulum.from_timestamp(element.timestamp).isoformat()}"

            with open_fs(
                self.get_url(repository.name, path), create=True
            ) as filesystem:
                with filesystem.open("element.json", "w") as f:
                    f.write(
                        json.dumps(
                            {
                                "uuid": element.uuid,
                                "element": "execution",
                                "format": self.format,
                            }
                        )
                    )
                with filesystem.open("execution.json", "w") as f:
                    f.write(
                        json.dumps(
                            {
                                "timestamp": element.timestamp,
                                "experiments": [
                                    e.experiment_id for e in element.experiments
                                ],
                            }
                        )
                    )
                for e in element.experiments:
                    with filesystem.open(
                        f"experiment-{e.experiment_id}.json", "w"
                    ) as f:
                        f.write(json.dumps(e.spec))
                with filesystem.open("host.json", "w") as f:
                    f.write(json.dumps(get_host_info()))

            # todo: bubble up to indexes

        if isinstance(element, Component):
            path = element.experiment.experiment_id
            with open_fs(
                self.get_url(repository.name, path), create=True
            ) as filesystem:
                with filesystem.open("element.json", "w") as f:
                    f.write(
                        json.dumps(
                            {
                                "uuid": element.uuid,
                                "element": "component",
                                "format": self.format,
                            }
                        )
                    )
                with filesystem.open("component.json", "w") as f:
                    f.write(json.dumps(element.serialize()))
                with filesystem.open("host.json", "w") as f:
                    f.write(json.dumps(get_host_info()))

            # bubble up to indexes
