from typing import List, Tuple, Union

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

    def __init__(self, url: str):
        self._index = None
        self.reset()
        self.add(url)

    def add(self, url: str) -> "Storage":
        """Load a write location

        # Arguments
        url: String, URL to add

        Returns the number of experiments found
        """
        if url in self._index["url"]:
            return self
        with open_fs(url) as filesystem:
            for path in filesystem.listdir(""):
                if len(path) == 6:
                    self._index["experiments"][path] = ExperimentStorage(
                        filesystem.get_url(path)
                    )
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
        try:
            return self._index["experiments"][experiment]
        except KeyError:
            raise ValueError(
                f"Experiment {experiment} could not be found. "
                f"Did you add the directory that contains the experiment storage?"
            )

    def find_many(self, experiments: Union[List[str], Tuple[str]]):
        """Finds many experiments

        # Arguments
        experiments: List of experiment IDs

        # Returns
        Instance or collection of machinable.storage.ExperimentStorage
        """
        return ExperimentCollection(
            [self.find(experiment) for experiment in experiments]
        )

    def find_all(self):
        """Returns a collection of all available experiments in the storage

        # Returns
        Instance or collection of machinable.storage.ExperimentStorage
        """
        return ExperimentCollection(list(self._index["experiments"].values()))

    def reset(self) -> "Storage":
        """Resets the interface and discards the cache
        """
        self._index = {"experiments": {}, "url": []}
        return self

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"Storage <{self._index['url']}>"
