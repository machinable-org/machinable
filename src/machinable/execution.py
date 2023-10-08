from typing import Any, Dict, List, Optional, Union

import copy
import os
import sys
import time

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

from typing import Literal

import arrow
from machinable import schema
from machinable.collection import ComponentCollection, ExecutionCollection
from machinable.component import Component
from machinable.element import extract, get_dump, get_lineage
from machinable.errors import ExecutionFailed
from machinable.interface import Interface, has_many, has_one
from machinable.schedule import Schedule
from machinable.types import (
    DatetimeType,
    ElementType,
    TimestampType,
    VersionType,
)
from machinable.utils import save_file, update_dict

_allowed_status = ["started", "heartbeat", "finished", "resumed"]


def _assert_allowed(status: str):
    if status not in _allowed_status:
        raise ValueError(
            f"Invalid status '{status}'; must be one of {_allowed_status}"
        )


StatusType = Literal["started", "heartbeat", "finished", "resumed"]


class Execution(Interface):
    kind = "Execution"
    default = None

    def __init__(
        self,
        version: VersionType = None,
        resources: Optional[Dict] = None,
        schedule: Union[Schedule, ElementType, None] = None,
    ):
        super().__init__(version)
        self.__model__ = schema.Execution(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            resources=resources,
            lineage=get_lineage(self),
        )
        self.__model__._dump = get_dump(self)
        if schedule is not None:
            if not isinstance(schedule, Schedule):
                schedule = Schedule.make(*extract(schedule))
            self.push_related("schedule", schedule)
        self._executable_ = None

    @classmethod
    def collect(cls, executions) -> "ExecutionCollection":
        return ExecutionCollection(executions)

    def compute_context(self) -> Optional[Dict]:
        return None  # do not retrieve existing execution

    def on_compute_predicate(self) -> Dict:
        return {"resources": self.__model__.resources}

    @has_one
    def schedule() -> "Schedule":
        return Schedule

    @has_many(key="execution_history")
    def executables() -> ComponentCollection:
        return Component

    def executable(
        self, executable: Optional[Component] = None
    ) -> Optional[Component]:
        if self._executable_ is not None:
            return self._executable_

        # auto-select executable if only one is available
        if len(self.executables) == 1:
            return self.executables[0]

        if executable is not None:
            return executable

        raise ValueError(
            "No executable selected. Call `execution.of(executable)` first, or pass an executable argument."
        )

    def of(self, executable: Union[None, Component]) -> Self:
        self._executable_ = executable
        return self

    @property
    def pending_executables(self) -> ComponentCollection:
        return self.executables.filter(lambda e: not e.cached())

    def add(
        self,
        executable: Union[Component, List[Component]],
    ) -> Self:
        if isinstance(executable, (list, tuple)):
            for _executable in executable:
                self.add(_executable)
            return self

        if self.executables.contains(lambda x: x == executable):
            return self

        self.push_related("executables", executable)

        return self

    def commit(self) -> Self:
        # ensure that configuration is parsed
        self.executables.map(lambda x: x.config and x.predicate)

        return super().commit()

    def resources(self, executable: Optional["Component"] = None) -> Dict:
        try:
            executable = self.executable(executable)
        except ValueError:
            pass

        resources = {}
        default = copy.deepcopy(self.__model__.resources)

        if executable is None:
            resources = default
        else:
            resources = self.load_file(
                [executable, "resources.json"], default={}
            )

        resources["_default_"] = default

        return resources

    def canonicalize_resources(self, resources: Dict) -> Dict:
        return resources

    def compute_resources(
        self, executable: Optional["Component"] = None
    ) -> Dict:
        default_resources = self.on_compute_default_resources(
            self.executable(executable)
        )

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
                    [executable, "resources.json"],
                    self.compute_resources(executable),
                )
            self.__call__()
            self.on_after_dispatch()
        except BaseException as _ex:  # pylint: disable=broad-except
            raise ExecutionFailed("Execution failed") from _ex

        return self

    def __call__(self) -> None:
        for executable in self.pending_executables:
            executable.dispatch()

    @property
    def host_info(
        self,
        executable: Optional["Component"] = None,
    ) -> Optional[Dict]:
        executable = self.executable(executable)
        return self.load_file([executable.id, "host.json"], None)

    def output(
        self,
        executable: Optional["Component"] = None,
        incremental: bool = False,
    ) -> Optional[str]:
        """Returns the output log"""
        if not self.is_mounted():
            return None

        executable = self.executable(executable)

        p = os.path.join(executable.id, "output.log")

        if incremental:
            read_length = self._cache.get(f"{p}.read_length", 0)
            if read_length == -1:
                return ""
            output = self.load_file(p, None)
            if output is None:
                return None

            if self.is_finished(executable):
                self._cache[f"{p}.read_length"] = -1
            else:
                self._cache[f"{p}.read_length"] = len(output)
            return output[read_length:]

        if p in self._cache:
            return self._cache[p]

        output = self.load_file(p, None)

        if self.is_finished(executable):
            self._cache[p] = output

        return output

    def stream_output(
        self,
        executable: Optional["Component"] = None,
        refresh_every: Union[int, float] = 1,
        stream=print,
    ):
        executable = self.executable(executable)
        try:
            while not self.is_started(executable) or self.is_active(executable):
                output = self.output(executable, incremental=True)
                if output:
                    stream(output)
                time.sleep(refresh_every)
        except KeyboardInterrupt:
            pass

    def update_status(
        self,
        executable: Optional["Component"] = None,
        status: StatusType = "heartbeat",
        timestamp: Optional[TimestampType] = None,
    ) -> TimestampType:
        _assert_allowed(status)
        executable = self.executable(executable)

        if timestamp is None:
            timestamp = arrow.now()
        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)

        # resumed event can occur multiple times
        multiple = status == "resumed"

        save_file(
            self.local_directory(executable.id, f"{status}_at"),
            str(timestamp) + ("\n" if multiple else ""),
            mode="a" if multiple else "w",
        )

        return timestamp

    def retrieve_status(
        self,
        executable: Optional["Component"] = None,
        status: StatusType = "heartbeat",
    ) -> Optional[DatetimeType]:
        _assert_allowed(status)
        executable = self.executable(executable)

        status = self.load_file([executable, f"{status}_at"], default=None)
        if status is None:
            return None

        multiple = status == "resumed"

        if multiple:
            # can have multiple rows, return latest
            status = status.strip("\n").split("\n")[-1]

        try:
            return arrow.get(status)
        except arrow.ParserError:
            return None

    def started_at(
        self, executable: Optional["Component"] = None
    ) -> Optional[DatetimeType]:
        """Returns the starting time"""
        if not self.is_mounted():
            return None
        return self.retrieve_status(self.executable(executable), "started")

    def resumed_at(
        self,
        executable: Optional["Component"] = None,
    ) -> Optional[DatetimeType]:
        """Returns the resumed time"""
        if not self.is_mounted():
            return None
        return self.retrieve_status(self.executable(executable), "resumed")

    def heartbeat_at(self, executable: Optional["Component"] = None):
        """Returns the last heartbeat time"""
        if not self.is_mounted():
            return None
        return self.retrieve_status(self.executable(executable), "heartbeat")

    def finished_at(
        self,
        executable: Optional["Component"] = None,
    ):
        """Returns the finishing time"""
        if not self.is_mounted():
            return None
        return self.retrieve_status(self.executable(executable), "finished")

    def is_finished(
        self,
        executable: Optional["Component"] = None,
    ):
        """True if finishing time has been written"""
        return bool(self.finished_at(self.executable(executable)))

    def is_started(
        self,
        executable: Optional["Component"] = None,
    ):
        """True if starting time has been written"""
        return bool(
            self.started_at(
                self.executable(executable),
            )
        )

    def is_resumed(
        self,
        executable: Optional["Component"] = None,
    ):
        """True if resumed time has been written"""
        return bool(
            self.resumed_at(
                self.executable(executable),
            )
        )

    def is_active(
        self,
        executable: Optional["Component"] = None,
    ):
        """True if not finished and last heartbeat occurred less than 30 seconds ago"""
        executable = self.executable(executable)
        if not self.heartbeat_at(
            executable,
        ):
            return False

        return (not self.is_finished(executable)) and (
            (arrow.now() - self.heartbeat_at(executable)).seconds < 30
        )

    def is_live(
        self,
        executable: Optional["Component"] = None,
    ):
        """True if active or finished"""
        executable = self.executable(executable)
        return self.is_finished(executable) or self.is_active(executable)

    def is_incomplete(
        self,
        executable: Optional["Component"] = None,
    ):
        """Shorthand for is_started() and not is_live()"""
        executable = self.executable(executable)
        return self.is_started(executable) and not self.is_live(executable)

    def on_verify_schedule(self) -> bool:
        """Event to verify compatibility of the schedule"""
        if self.schedule is None:
            return True

        return False

    def on_before_dispatch(self) -> Optional[bool]:
        """Event triggered before dispatch of an execution

        Return False to prevent the dispatch
        """

    def on_after_dispatch(self) -> None:
        """Event triggered after the dispatch of an execution"""

    def on_compute_default_resources(
        self, executable: "Component"
    ) -> Optional[Dict]:
        """Event triggered to compute default resources"""

    @property
    def seed(self) -> int:
        return self.__model__.seed

    def __iter__(self):
        yield from self.executables

    def __exit__(self, *args, **kwargs):
        try:
            self.dispatch()
        finally:
            super().__exit__()

    def __repr__(self) -> str:
        return "Execution"
