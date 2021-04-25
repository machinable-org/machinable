from typing import Optional, Union

import os

import arrow
from machinable.collection.submission import SubmissionCollection
from machinable.config.mapping import config_map
from machinable.filesystem import parse_storage_url
from machinable.submission.models import SubmissionModel
from machinable.submission.views.views import get as get_view
from machinable.utils.utils import sentinel


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
    ) -> Union["Submission", None]:
        """Returns a [Submission](#) for the given URL

        # Arguments
        url: String, filesystem URL
        or_fail: Boolean, by default None is returned if the submission does not exist.
            If True, an Exception will be raised instead
        """
        _url = parse_storage_url(url if isinstance(url, str) else url.url)
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

    @classmethod
    def find_many(cls, url) -> SubmissionCollection:
        """Searches given URL recursively to return a collection of its submissions

        # Arguments
        url: String, filesystem URL
        """
        from ..index.native_index import NativeIndex

        return NativeIndex().add_from_storage(url).find_all()

    def file(self, filepath, default=sentinel, reload=None):
        """Returns the content of a file in the submission's storage

        # Arguments
        filepath: Relative filepath
        default: Optional default if file does not exist
        reload: If True, cache will be ignored. If datetime, file will be reloaded
                if cached version is older than the date
        """
        if reload is None:
            finished_at = self.finished_at
            if finished_at is False:
                reload = True
            else:
                reload = finished_at

        if "_files" not in self._cache:
            self._cache["_files"] = {}

        if isinstance(reload, pendulum.DateTime):
            try:
                loaded_at = self._cache["_files"][filepath]["loaded_at"]
                # buffer reloading by 1 second
                reload = reload >= loaded_at.add(seconds=1)
            except KeyError:
                reload = True

        if filepath not in self._cache or reload:
            try:
                self._cache[filepath] = self._model.file(filepath)
                if filepath not in self._cache["_files"]:
                    self._cache["_files"][filepath] = {}
                self._cache["_files"][filepath]["loaded_at"] = arrow.now()
            except FileNotFoundError:
                if default is not sentinel:
                    return default
                raise

        return self._cache[filepath]

    @property
    def nickname(self) -> str:
        """Returns the submission's nickname"""
        return ""

    @property
    def url(self) -> str:
        """Returns the storage URL"""
        return self._model.url

    @property
    def path(self) -> str:
        """Returns the relative storage path"""
        return ""

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

    def data(self, name=None, default=sentinel):
        """Retrieves a data object from the submission

        # Arguments
        name: Name of the data object. If None, a list of available objects is returned
        """
        if name is None:
            with open_fs(self.url) as filesystem:
                return filesystem.listdir("data")

        return self.file(os.path.join("data", name), default)

    @property
    def config(self):
        """Returns the component config"""
        if "config" not in self._cache:
            self._cache["config"] = config_map(
                self.file("component.json")["config"]
            )
        return self._cache["config"]

    @property
    def flags(self):
        """Returns the component flags"""
        if "flags" not in self._cache:
            self._cache["flags"] = config_map(
                self.file("component.json")["flags"]
            )
        return self._cache["flags"]

    @property
    def tuning(self):
        """True if experiment is a tuning experiment"""
        return self.flags.TUNING

    @property
    def components(self):
        if "components" not in self._cache:
            self._cache["components"] = [
                config_map(component)
                for component in self.file("components.json")
            ]

        return self._cache["components"]

    def log(self):
        """Returns the content of the log file"""
        if "log" in self._cache:
            return self._cache["log"]

        log = self.file("log.txt")

        if self.is_finished():
            self._cache["log"] = log

        return log

    def output(self):
        """Returns the content of the log file"""
        if "output" in self._cache:
            return self._cache["output"]

        output = self.file("output.log")

        if self.is_finished():
            self._cache["output"] = output

        return output

    @property
    def records(self):
        """Returns the record interface"""
        return self.get_records("default")

    def has_records(self, scope="default"):
        """Returns True if records of given scope exist"""
        with open_fs(self.url) as filesystem:
            return filesystem.exists(f"records/{scope}.jsonl")

    def get_records(self, scope=None):
        """Returns a record collection

        # Arguments
        scope: The name of the record scope. If None, list of all available scopes will be returned
        """
        if scope is None:
            # return list of available scopes
            try:
                with open_fs(self.url) as filesystem:
                    scopes = filesystem.listdir("records")
                    return [s[:-6] for s in scopes if s.endswith(".jsonl")]
            except FileNotFoundError:
                return []

        if "records." + scope in self._cache:
            return self._cache["records." + scope]

        records = []
        try:
            with open_fs(self.url) as filesystem:
                if filesystem.isfile(f"records/{scope}.jsonl"):
                    with jsonlines.Reader(
                        filesystem.open(f"records/{scope}.jsonl")
                    ) as reader:
                        for record in reader.iter():
                            # schema
                            records.append(record)
        except FileNotFoundError:
            pass
        records = RecordCollection(records)

        if self.is_finished():
            self._cache["records." + scope] = records

        return records

    def timing(self, mode="iteration", end=None, return_type="seconds"):
        """Get timing statistics about the records

        # Arguments
        mode: String, 'iteration', 'avg' or 'total' that determines whether the last iteration, the average iteration
            or the total time is collected
        end: Mixed, end of the timespan; if None, datetime.now() is used
        return_type: String, specifying the return format 'seconds', 'words', or 'period' (pendulum.Period object)

        Returns: See return_type
        """
        end = as_datetime(end)

        if mode == "iteration":
            if self._meta_data["updated_at"] is not None:
                start = self._meta_data["updated_at"]
            else:
                start = self._meta_data["created_at"]
            elapsed = start.diff(end)
        elif mode == "total":
            elapsed = self._meta_data["created_at"].diff(end)
        elif mode == "avg":
            start = self._meta_data["created_at"]
            if self._meta_data["length"] > 0:
                elapsed = start.diff(end) / self._meta_data["length"]
            else:
                elapsed = start.diff(end)
        else:
            raise ValueError(
                f"Invalid mode: '{mode}'; must be 'iteration', 'avg' or 'total'."
            )

        if return_type == "seconds":
            seconds = elapsed.in_seconds()
            if seconds <= 0:
                return 1e-15  # guard against division by zero
            return seconds
        elif return_type == "words":
            return elapsed.in_words()
        elif return_type == "period":
            return elapsed
        else:
            raise ValueError(
                f"Invalid return_type: '{return_type}'; must be 'seconds', 'words' or 'period'."
            )

    @property
    def status(self):
        if "status" in self._cache:
            return self._cache["status"]

        try:
            status = config_map(
                {
                    k: arrow.get(v) if isinstance(v, str) else False
                    for k, v in self._model.file("status.json").items()
                }
            )
        except FileNotFoundError:
            status = {
                "started_at": False,
                "finished_at": False,
                "heartbeat_at": False,
            }

        if status["finished_at"] is not False:
            self._cache["status"] = status

        return status

    @property
    def started_at(self):
        """Returns the starting time"""
        return self.status["started_at"]

    @property
    def heartbeat_at(self):
        """Returns the last heartbeat time"""
        return self.status["heartbeat_at"]

    @property
    def finished_at(self):
        """Returns the finishing time"""
        return self.status["finished_at"]

    def is_finished(self):
        """True if finishing time has been written"""
        return bool(self.status["finished_at"])

    def is_started(self):
        """True if starting time has been written"""
        return bool(self.status["started_at"])

    def is_active(self):
        """True if not finished and last heartbeat occurred less than 30 seconds ago"""
        if not self.status["heartbeat_at"]:
            return False

        return (not self.is_finished()) and self.status["heartbeat_at"].diff(
            arrow.now()
        ).in_seconds() < 30

    def is_incomplete(self):
        """Shorthand for is_started() and not (is_active() or is_finished())"""
        return self.is_started() and not (
            self.is_active() or self.is_finished()
        )

    # execution

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
            self._cache["started_at"] = arrow.get(
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
                self._cache["finished_at"] = finished_at.sort(
                    reverse=True
                ).first()
                # notify model
                self._model.submit("finished_at", self._cache["finished_at"])
        return self._cache["finished_at"]

    @property
    def engine(self):
        """Returns information on the engine"""
        if "engine" not in self._cache:
            self._cache["engine"] = config_map(self.file("engine.json"))
        return self._cache["engine"]

    @property
    def state(self):
        """Returns information of component state"""
        if "state" in self._cache:
            return self._cache["state"]

        state = config_map(self.file("state.json"))
        if self.is_finished():
            self._cache["state"] = state

        return state

    @property
    def host(self):
        """Returns information of the host"""
        if "host" not in self._cache:
            self._cache["host"] = config_map(self.file("host.json"))
        return self._cache["host"]

    @property
    def execution_host(self):
        """Returns information on the experiment host"""
        if "host" not in self._cache:
            self._cache["host"] = config_map(self.file("host.json"))
        return self._cache["host"]

    @property
    def peers(self):
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
            "started_at": self.started_at,
            "heartbeat_at": self.heartbeat_at,
            "finished_at": self.finished_at,
            "url": self.url,
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
