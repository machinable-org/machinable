from typing import Any, Dict, List, Optional, Union

import copy
import random
import sys

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

import arrow
from machinable import errors, schema
from machinable.collection import ComponentCollection
from machinable.component import Component
from machinable.element import (
    Element,
    defaultversion,
    extract,
    get_dump,
    get_lineage,
)
from machinable.errors import ExecutionFailed
from machinable.interface import Interface, has_many, has_one
from machinable.project import Project
from machinable.schedule import Schedule
from machinable.settings import get_settings
from machinable.storage import Storage
from machinable.types import (
    DatetimeType,
    ElementType,
    TimestampType,
    VersionType,
)
from machinable.utils import (
    generate_seed,
    load_file,
    save_file,
    sentinel,
    update_dict,
)


class Execution(Interface):
    kind = "Execution"
    default = get_settings().default_execution

    def __init__(
        self,
        version: VersionType = None,
        resources: Optional[Dict] = None,
        seed: Union[int, None] = None,
        schedule: Union[
            Schedule, ElementType, None
        ] = get_settings().default_schedule,
    ):
        super().__init__(version)
        if seed is None:
            seed = generate_seed()
        self.__model__ = schema.Execution(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            resources=resources,
            seed=seed,
            lineage=get_lineage(self),
        )
        self.__model__._dump = get_dump(self)
        if schedule is not None:
            if not isinstance(schedule, Schedule):
                schedule = Schedule.make(*extract(schedule))
            self.__related__["schedule"] = schedule

    @property
    def seed(self) -> int:
        return self.__model__.seed

    @property
    def timestamp(self) -> int:
        return self.__model__.timestamp

    @has_one
    def schedule() -> "Schedule":
        return Schedule

    @has_many(key="execution_history")
    def executables() -> ComponentCollection:
        return Component

    @property
    def pending_executables(self) -> ComponentCollection:
        return self.executables.filter(lambda e: not e.cached())

    def add(
        self,
        executable: Union[Component, List[Component]],
        once: bool = False,
    ) -> Self:
        if isinstance(executable, (list, tuple)):
            for _executable in executable:
                self.add(_executable)
            return self

        if once and self.__related__["executables"].contains(
            lambda x: x == executable
        ):
            # already added
            return self

        self.push_related("executables", executable)

        return self

    def commit(self) -> Self:
        # ensure that configuration is parsed
        self.executables.map(lambda x: x.config and x.predicate)

        Storage.get().commit(self)

        return self

    def resources(self, resources: Dict = sentinel) -> Optional[Dict]:
        if resources is sentinel:
            return self.__model__.resources

        self.__model__.resources = resources

        return self.__model__.resources

    def canonicalize_resources(self, resources: Dict) -> Dict:
        return resources

    def default_resources(self, executable: "Component") -> Optional[dict]:
        """Default resources"""

    def compute_resources(self, executable: "Component") -> Dict:
        default_resources = self.default_resources(executable)

        if not self.__model__.resources and default_resources is not None:
            return self.canonicalize_resources(default_resources)

        if self.__model__.resources and not default_resources:
            resources = copy.deepcopy(self.__model__.resources)
            resources.pop("_inherit_defaults", None)
            return self.canonicalize_resources(resources)

        if self.__model__.resources and default_resources:
            resources = copy.deepcopy(self.__model__.resources)
            if resources.pop("_inherit_defaults", True) is False:
                return self.canonicalize_resources(resources)

            # merge with default resources
            defaults = self.canonicalize_resources(default_resources)
            update = self.canonicalize_resources(resources)

            defaults_ = copy.deepcopy(defaults)
            update_ = copy.deepcopy(update)

            # apply removals (e.g. #remove_me)
            removals = [
                k
                for k in update.keys()
                if isinstance(k, str) and k.startswith("#")
            ]
            for removal in removals:
                defaults_.pop(removal[1:], None)
                update_.pop(removal, None)

            return update_dict(defaults_, update_)

        return {}

    def dispatch(self) -> Self:
        if not self.executables:
            return self

        if len(self.pending_executables) == 0:
            return self

        if self.on_before_dispatch() is False:
            return self

        if self.on_verify_schedule() is False:
            raise ExecutionFailed(
                "The execution does not support the specified schedule."
            )

        self.commit()

        try:
            # compute resources
            for executable in self.pending_executables:
                self.save_file(
                    f"resources-{executable.id}.json",
                    self.compute_resources(executable),
                )
            self.save_file(
                "host.json", Project.get().provider().get_host_info()
            )

            self.__call__()
            self.on_after_dispatch()
        except BaseException as _ex:  # pylint: disable=broad-except
            raise ExecutionFailed("Execution failed") from _ex

        return self

    def __call__(self) -> None:
        for executable in self.pending_executables:
            executable.dispatch()

    def on_verify_schedule(self) -> bool:
        """Event to verify compatibility of the schedule"""
        if self.schedule is None:
            return True

        return False

    def on_before_dispatch(self) -> Optional[bool]:
        """Event triggered before dispatch of an execution

        Return False to prevent the dispatch
        """

    def on_before_commit(self) -> Optional[bool]:
        """Event triggered before commit of an execution"""

    def on_after_dispatch(self) -> None:
        """Event triggered after the dispatch of an execution"""

    @property
    def host_info(self) -> Optional[Dict]:
        return self.load_file("host.json", None)

    @property
    def nickname(self) -> str:
        return self.__model__.nickname

    def mark_started(
        self, timestamp: Optional[TimestampType] = None
    ) -> Optional[DatetimeType]:
        if self.is_finished():
            return None

        if timestamp is None:
            timestamp = arrow.now()
        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)

        save_file(
            self.local_directory("started_at"),
            str(timestamp) + "\n",
            # starting event can occur multiple times
            mode="a",
        )

        return timestamp

    def update_heartbeat(
        self,
        timestamp: Union[float, int, DatetimeType, None] = None,
        mark_finished=False,
    ) -> Optional[DatetimeType]:
        if self.is_finished():
            return None
        if timestamp is None:
            timestamp = arrow.now()

        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)

        save_file(
            self.local_directory("heartbeat_at"),
            str(timestamp),
            mode="w",
        )
        if mark_finished:
            save_file(
                self.local_directory("finished_at"),
                str(timestamp),
            )

        return timestamp

    def output(self, incremental: bool = False) -> Optional[str]:
        """Returns the output log"""
        if not self.is_mounted():
            return None
        if incremental:
            read_length = self._cache.get("output_read_length", 0)
            if read_length == -1:
                return ""
            output = self.load_file("output.log", None)
            if output is None:
                return None

            if self.is_finished():
                self._cache["output_read_length"] = -1
            else:
                self._cache["output_read_length"] = len(output)
            return output[read_length:]

        if "output" in self._cache:
            return self._cache["output"]

        output = self.load_file("output.log", None)

        if self.is_finished():
            self._cache["output"] = output

        return output

    def created_at(self) -> Optional[DatetimeType]:
        if self.timestamp is None:
            return None

        return arrow.get(self.timestamp)

    def started_at(self) -> Optional[DatetimeType]:
        """Returns the starting time"""
        if not self.is_mounted():
            return None
        return self._retrieve_status("started")

    def heartbeat_at(self):
        """Returns the last heartbeat time"""
        if not self.is_mounted():
            return None
        return self._retrieve_status("heartbeat")

    def finished_at(self):
        """Returns the finishing time"""
        if not self.is_mounted():
            return None
        return self._retrieve_status("finished")

    def _retrieve_status(self, field: str) -> Optional[DatetimeType]:
        fields = ["started", "heartbeat", "finished"]
        if field not in fields:
            raise ValueError(f"Invalid field: {field}. Must be on of {fields}")
        status = load_file(self.local_directory(f"{field}_at"), default=None)
        if status is None:
            return None
        if field == "started":
            # can have multiple rows, return latest
            status = status.strip("\n").split("\n")[-1]

        try:
            return arrow.get(status)
        except arrow.ParserError:
            return None

    def is_finished(self):
        """True if finishing time has been written"""
        return bool(self.finished_at())

    def is_started(self):
        """True if starting time has been written"""
        return bool(self.started_at())

    def is_active(self):
        """True if not finished and last heartbeat occurred less than 30 seconds ago"""
        if not self.heartbeat_at():
            return False

        return (not self.is_finished()) and (
            (arrow.now() - self.heartbeat_at()).seconds < 30
        )

    def is_live(self):
        """True if active or finished"""
        return self.is_finished() or self.is_active()

    def is_incomplete(self):
        """Shorthand for is_started() and not (is_active() or is_finished())"""
        return self.is_started() and not (
            self.is_active() or self.is_finished()
        )

    def __iter__(self):
        yield from self.executables

    def __exit__(self, *args, **kwargs):
        self.dispatch()

        super().__exit__()

    def __repr__(self) -> str:
        return "Execution"
