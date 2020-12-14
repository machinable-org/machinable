import os
from typing import Optional, Union

import pendulum

from ..config.mapping import config_map
from ..filesystem import parse_storage_url
from ..utils.utils import sentinel
from .collections import SubmissionCollection, SubmissionComponentCollection
from .component import SubmissionComponent
from .models import SubmissionModel
from .views.views import get as get_view


class Submission:
    def __init__(self, url: Union[str, dict, SubmissionModel], cache=None):
        self._model = SubmissionModel.create(url)
        self._cache = cache or {}

    @classmethod
    def create(cls, args) -> "Submission":
        if isinstance(args, Submission):
            return args

        if isinstance(args, tuple):
            return cls(*args)

        return cls(args)

    @classmethod
    def find(
        cls, url, component=False, or_fail=False
    ) -> Union["Submission", SubmissionComponent, None]:
        """Returns a [Submission](#) for the given URL

        # Arguments
        url: String, filesystem URL
        component: Component to be returned if the URL is a submission containing multiple components.
                   For example, set to 0 or -1 to retrieve first or last in the collection respectively
        or_fail: Boolean, by default None is returned if the submission does not exist.
                 If True, an Exception will be raised instead
        """
        _url = parse_storage_url(url if isinstance(url, str) else url.url)
        if _url["component_id"] is None:
            # submission
            try:
                submission = cls.create(url)
                if component is not False:
                    return submission.components[component]
                return submission
            except ValueError:
                if or_fail:
                    raise
                return None
        else:
            # component
            try:
                return SubmissionComponent.create(url)
            except ValueError:
                if or_fail:
                    raise
                return None

    @classmethod
    def find_many(cls, url) -> SubmissionCollection:
        """Searches given URL recursively to return a collection of its submissions

        # Arguments
        url: String, filesystem URL
        """
        from ..index.native_index import NativeIndex

        return NativeIndex().add_from_storage(url).find_all()

    def file(self, filepath, default=sentinel, reload=False):
        """Returns the content of a file in the storage

        # Arguments
        filepath: Relative filepath
        default: Optional default if file cannot be found.
        reload: If True, cache will be ignored.
        """
        if filepath not in self._cache or reload is not False:
            try:
                self._cache[filepath] = self._model.file(filepath)
            except FileNotFoundError:
                if default is not sentinel:
                    return default
                raise

        return self._cache[filepath]

    @property
    def url(self) -> str:
        """Returns the file system URL"""
        return self._model.url

    @property
    def unique_id(self) -> str:
        if "unique_id" not in self._cache:
            self._cache["unique_id"] = (
                self.submission_id + "_" + self.components[0].component_id
            )
        return self._cache["unique_id"]

    @property
    def submission_id(self) -> str:
        """6-digit submission ID, e.g. F4K3r6"""
        return self.file("execution.json")["submission_id"]

    @property
    def experiment_name(self) -> Optional[str]:
        """Experiment name"""
        return self.file("execution.json")["experiment_name"]

    @property
    def project_name(self) -> Optional[str]:
        """Project name"""
        return self.file("execution.json")["project_name"]

    @property
    def seed(self) -> int:
        """Returns the global random seed used in the experiment"""
        return self.file("execution.json")["seed"]

    @property
    def timestamp(self):
        """Returns the timestamp of the experiment"""
        return self.file("execution.json")["timestamp"]

    @property
    def code_backup(self):
        """True if code backup is available"""
        return self.file("code.json")["code_backup"]

    @property
    def code_diff(self):
        """Git diff"""
        return self.file("code.diff")

    @property
    def code_version(self):
        """Returns information about the source code version as a dictionary

        ```
        project:
          path: VCS url
          commit: Commit hash or None
          is_dirty: Whether everything has been commited to VCS
        vendor: Dict of vendor project information with the same structure as above
        ```
        """
        if "code_version" not in self._cache:
            self._cache["code_version"] = config_map(
                self.file("code.json")["code_version"]
            )
        return self._cache["code_version"]

    @property
    def started_at(self):
        """Start of execution"""
        if "started_at" not in self._cache:
            self._cache["started_at"] = pendulum.parse(
                self.file("execution.json")["started_at"]
            )
        return self._cache["started_at"]

    @property
    def finished_at(self):
        """Finish time of the execution or False if not finished"""
        if self._cache.get("finished_at", False) is False:
            finished_at = self.components.map(lambda c: c.finished_at)
            if False in finished_at:
                self._cache["finished_at"] = False
            else:
                self._cache["finished_at"] = finished_at.sort(reverse=True).first()
                # notify model
                self._model.submit("finished_at", self._cache["finished_at"])
        return self._cache["finished_at"]

    def is_finished(self):
        """True if finishing time has been written"""
        return bool(self.finished_at)

    def is_started(self):
        """True if starting time has been written"""
        return bool(self.started_at)

    @property
    def host(self):
        """Returns information on the experiment host"""
        if "host" not in self._cache:
            self._cache["host"] = config_map(self.file("host.json"))
        return self._cache["host"]

    @property
    def components(self) -> SubmissionComponentCollection:
        """List of components"""
        if "components" not in self._cache:
            self._cache["components"] = SubmissionComponentCollection(
                [
                    SubmissionComponent(
                        self._model.submission_component_model(
                            os.path.join(self.url, component)
                        ),
                        submission=self,
                    )
                    for component in self.file("execution.json")["components"]
                ]
            )

        return self._cache["components"]

    @property
    def submissions(self) -> SubmissionCollection:
        """Returns a collection of derived experiments"""
        return SubmissionCollection(
            [
                Submission(self._model.submission_model(url))
                for url in self._model.submissions()
            ]
        )

    @property
    def ancestor(self) -> Optional["Submission"]:
        """Returns parent experiment or None if experiment is independent"""
        if self.url.find("/submissions/") == -1:
            return None
        try:
            model = self._model.submission_model(
                self.url.rsplit("/submissions/", maxsplit=1)[0]
            )
            if not model.exists():
                return None
            return Submission(model)
        except ValueError:
            return None

    @property
    def model(self):
        return self._model

    @property
    def view(self):
        """Returns the registered view"""
        return get_view("submission", self)

    def __getattr__(self, item):
        view = get_view("submission", self, name=item)
        if view is not None:
            return view

        raise AttributeError(
            f"{self.__class__.__name__} object has no attribute {item}"
        )

    def serialize(self):
        return {
            "submission_id": self.submission_id,
            "experiment_name": self.experiment_name,
            "project_name": self.project_name,
            "experiment": self,
            "started_at": self.started_at,
        }

    def __len__(self):
        """Returns the number of components in this experiment"""
        return len(self.file("execution.json")["components"])

    def __iter__(self):
        yield from self.components

    def __str__(self):
        return self.__repr__()

    def __repr__(self):
        return f"Submission <{self.submission_id}>"
