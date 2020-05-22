import os
from typing import List, Tuple, Union

from ..execution.identifiers import decode_experiment_id
from ..filesystem import open_fs
from .collections import ExperimentCollection
from .experiment import ExperimentStorage


class Storage:
    """Interface to manage storage data

    The interface is read-only. machinable will never modify any of the collected data.

    # Examples

    ```python
    import machinable as ml
    storage = ml.Storage('~/data')
    storage.find('t3s42Q)
    ```

    # Arguments
    url: String, URL of storage location.
    """

    def __init__(self, url=None):
        self._index = None
        self.reset()
        if url:
            self.add(url)

    def add(self, url: str) -> "Storage":
        """Adds a URL to the search index

        # Arguments
        url: String, URL to add

        Returns the number of experiments found
        """
        # check if already indexed
        if any([url.startswith(indexed_url) for indexed_url in self._index["url"]]):
            return self

        self._index["url"].append(url)

        return self

    def find(self, experiment: Union[str, None] = None):
        """Finds an experiment

        # Arguments
        experiment: String, experiment ID. If None, all available experiments will be returned.

        # Returns
        Instance or collection of machinable.storage.ExperimentStorage
        """
        if experiment is None:
            return self.find_all()
        # lazy index
        if experiment not in self._index["experiments"]:
            self._refresh()
        try:
            return self._index["experiments"][experiment]
        except KeyError:
            raise ValueError(
                f"Experiment {experiment} could not be found. "
                f"Did you add the directory that contains the experiment storage?"
            )

    def find_by_directory(self, directory):
        """
        Finds experiments in a directory

        # Arguments
        directory: String

        # Returns
        Instance or collection of machinable.storage.ExperimentStorage
        """
        self._refresh()
        directory = directory.strip("/")
        if directory not in self._index["directories"]:
            self._index["directories"][directory] = set()
        return ExperimentCollection(list(self._index["directories"][directory]))

    def find_many(self, experiments: Union[List[str], Tuple[str]]):
        """Finds many experiments

        # Arguments
        experiments: List of experiment IDs

        # Returns
        Instance or collection of machinable.storage.ExperimentStorage
        """
        self._refresh()
        return ExperimentCollection(
            [
                self._index["experiments"].get(experiment, None)
                for experiment in experiments
            ]
        )

    def find_all(self):
        """Returns a collection of all available experiments in the storage

        # Returns
        Instance or collection of machinable.storage.ExperimentStorage
        """
        self._refresh()
        return ExperimentCollection(list(self._index["experiments"].values()))

    def reset(self) -> "Storage":
        """Resets the interface and discards the cache
        """
        self._index = {"experiments": {}, "url": [], "directories": {}}
        return self

    def _refresh(self):
        for url in self._index["url"]:
            with open_fs(url) as filesystem:
                for path, info in filesystem.walk.info():
                    if not info.is_dir:
                        continue
                    directory, name = os.path.split(path)
                    if not decode_experiment_id(name, or_fail=False):
                        continue
                    if name not in self._index["experiments"]:
                        self._index["experiments"][name] = ExperimentStorage(
                            filesystem.get_url(path)
                        )
                    directory = directory.strip("/")
                    if directory not in self._index["directories"]:
                        self._index["directories"][directory] = set()

                    self._index["directories"][directory].add(
                        self._index["experiments"][name]
                    )

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"Storage <{self._index['url']}>"
