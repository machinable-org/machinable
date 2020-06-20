import os

from dotmap import DotMap

from ..filesystem import open_fs, parse_fs_url
from .collections import ComponentCollection
from .component import ComponentStorage


class ExperimentStorage:
    def __init__(self, url: str):
        if "://" not in url:
            url = "osfs://" + url
        self.url = url
        resource = os.path.normpath(parse_fs_url(self.url)["resource"])
        self._path = os.path.basename(resource)
        if len(self._path) == 12:
            # if component, switch to experiment
            component_id = self._path
            self._path = os.path.basename(os.path.dirname(resource))
            self.url = self.url.replace("/" + component_id, "")
        if len(self._path) != 6:
            raise ValueError(
                "The provided URL is not a valid experiment storage directory"
            )
        self._cache = dict()
        self._index = {"components": {}}

    def file(self, filepath, reload=False):
        """Returns the content of a file in the experiment storage

        # Arguments
        filepath: Relative filepath
        reload: If True, cache will be ignored
        """
        if filepath not in self._cache or reload:
            with open_fs(self.url) as filesystem:
                self._cache[filepath] = filesystem.load_file(filepath)
        return self._cache[filepath]

    @property
    def id(self):
        """6-digit experiment ID, e.g. F4K3r6"""
        return self._path

    @property
    def seed(self):
        """Returns the global random seed used in the experiment"""
        return self.file("execution.json")["seed"]

    @property
    def timestamp(self):
        """Returns the timestamp of the experiment"""
        return self.file("execution.json")["timestamp"]

    @property
    def code_backup(self):
        """True if code backup is available"""
        return self.file("execution.json")["code_backup"]

    @property
    def code_version(self):
        """Returns information about the source code version as a dictionary

        ```
        project:
          path: VCS url
          commit: Commit hash or None
          is_dirty: Whether everything has been commited to VCS
        vendor: List of vendor project information with the same structure as above
        ```
        """
        return DotMap(self.file("execution.json")["code_version"])

    @property
    def started_at(self):
        """Start of execution
        """
        return self.file("execution.json")["started_at"]

    @property
    def host(self):
        """Returns information on the experiment host"""
        return DotMap(self.file("host.json"))

    @property
    def output(self):
        """Returns the captured output"""
        return DotMap(self.file("output.log"))

    @property
    def schedule(self):
        """Returns the experiment schedule"""
        return self.file("schedule.json")

    @property
    def components(self):
        """List of components
        """
        if len(self._index["components"]) == 0:
            self._index["components"] = {
                component: ComponentStorage(
                    os.path.join(self.url, component), experiment=self
                )
                for component in self.file("execution.json")["components"]
            }

        return ComponentCollection(list(self._index["components"].values()))

    def __len__(self):
        """Returns the number of components in this experiment"""
        return len(self.file("execution.json")["components"])

    def __iter__(self):
        yield from self.components

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"Storage: Experiment <{self.id}>"
