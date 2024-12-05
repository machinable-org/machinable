from typing import Any, Dict, List, Optional, Union

import copy
import os
import sys
import threading
import time

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

from typing import Literal

import arrow
from machinable import errors, schema
from machinable.collection import ComponentCollection, ExecutionCollection
from machinable.component import Component
from machinable.element import _CONNECTIONS as connected_elements
from machinable.element import extract, get_dump, get_lineage
from machinable.errors import ExecutionFailed
from machinable.index import Index
from machinable.interface import Interface, belongs_to, has_one
from machinable.project import Project
from machinable.schedule import Schedule
from machinable.storage import Storage
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
        self._resources = None
        self._defer_launch = False
        self._executables = ComponentCollection()
        self._of = None

    @belongs_to(key="execution_history")
    def component() -> "Component":
        return Component

    @property
    def executables(self) -> ComponentCollection:
        return self._executables

    def deferred(self, defer: bool = True):
        self._defer_launch = defer
        return self

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

    @has_one
    def component(self) -> Optional[Component]:
        return Component

    @property
    def pending_executables(self) -> ComponentCollection:
        return self.executables.filter(lambda e: not e.cached())

    def on_add(self, executable: Component):
        """Event when executable is added"""

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

        self.on_add(executable)

        self.executables.append(executable)

        self.push_related("execution_history", executable)

        return self

    def commit(self) -> Self:
        # ensure that configuration is parsed
        for executable in self.pending_executables:
            assert executable.config is not None

        for executable in self.pending_executables:
            executable.commit()
            self.of(executable).commit()

        return self

    def of(self, executable):
        instance = self.clone()
        instance._deferred_data = self._deferred_data.copy()
        instance._of = executable
        return instance

    def local_directory(self, *append: str, create: bool = False) -> str:
        if self.__model__._from_directory is not None:
            directory = self.__model__._from_directory
        else:
            if self._of is None:
                directory = ""
            else:
                from machinable.index import Index

                directory = Index.get().local_directory(
                    self._of.uuid, self.uuid, *append
                )

        if create:
            os.makedirs(directory, exist_ok=True)

        return directory

    def canonicalize_resources(self, resources: Dict) -> Dict:
        return resources

    def computed_resources(
        self, executable: Optional["Component"] = None
    ) -> Optional[Dict]:
        if self._resources is None:
            # check if resources have been computed
            resources = self.load_file("computed_resources.json", default=None)
            if resources is None:
                resources = self._compute_resources()
                self.save_file("computed_resources.json", resources)

            self._resources = resources

        return self._resources

    def _compute_resources(self) -> Dict:
        default_resources = self.on_compute_default_resources(self.component)

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

    def launch(self) -> Self:
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
            self.pending_executables.map(lambda e: self.computed_resources(e))
            self.__call__()
            self.on_after_dispatch()
        except BaseException as _ex:  # pylint: disable=broad-except
            raise ExecutionFailed("Execution failed") from _ex

        return self

    def __call__(self) -> None:
        for executable in self.pending_executables:
            self.dispatch(executable)

    def dispatch(self, component) -> Self:
        """Dispatch the component lifecycle"""
        writes_meta_data = (
            component.on_write_meta_data() is not False
            and component.is_mounted()
        )
        try:
            component.on_before_dispatch()

            component.on_seeding()

            # meta-data
            if writes_meta_data:
                if not self.is_started():
                    self.of(component).update_status(status="started")
                else:
                    self.of(component).update_status(status="resumed")

                self.of(component).save_file(
                    "host.json",
                    data=Project.get().provider().get_host_info(),
                )

            def beat():
                t = threading.Timer(15, beat)
                t.daemon = True
                t.start()
                component.on_heartbeat()
                if writes_meta_data:
                    self.of(component).update_status(status="heartbeat")
                return t

            heartbeat = beat()

            component.__call__()

            component.on_success()
            component.on_finish(success=True)

            if heartbeat is not None:
                heartbeat.cancel()

            if writes_meta_data:
                self.of(component).update_status(status="finished")
                component.cached(True, reason="finished")

            component.on_after_dispatch(success=True)
        except BaseException as _ex:
            component.on_failure(exception=_ex)
            component.on_finish(success=False)
            component.on_after_dispatch(success=False)
            raise errors.ComponentException(
                f"{self.__class__.__name__} dispatch failed"
            ) from _ex
        finally:
            if writes_meta_data:
                # propagate changes
                for storage in Storage.connected():
                    storage.update(component)

    def dispatch_code(
        self,
        component: Component,
        inline: bool = True,
        project_directory: Optional[str] = None,
        python: Optional[str] = None,
    ) -> Optional[str]:
        if project_directory is None:
            project_directory = Project.get().path()
        if python is None:
            python = sys.executable
        lines = [
            "from machinable import Project, Element, Component, Execution"
        ]
        # context
        lines.append(f"Project('{project_directory}').__enter__()")
        for kind, elements in connected_elements.items():
            if kind in ["Project", "Execution"]:
                continue
            for element in elements:
                jn = element.as_json().replace('"', '\\"').replace("'", "\\'")
                lines.append(f"Element.from_json('{jn}').__enter__()")
        # dispatch
        lines.append(
            f"c_ = Component.from_directory('{os.path.abspath(component.local_directory())}')"
        )
        lines.append(
            f"e_ = Execution.from_directory('{os.path.abspath(self.local_directory())}')"
        )
        lines.append("e_.dispatch(c_)")

        if inline:
            code = ";".join(lines)
            return f'{python} -c "{code}"'

        self._of = component

        return "\n".join(lines)

    @property
    def host_info(self) -> Optional[Dict]:
        return self.load_file("host.json", None)

    def output_filepath(self) -> str:
        return self.local_directory("output.log")

    def output(
        self,
        incremental: bool = False,
    ) -> Optional[str]:
        """Returns the output log"""
        if not self.is_mounted():
            return None

        p = os.path.join("output.log")

        if incremental:
            read_length = self._cache.get(f"{p}.read_length", 0)
            if read_length == -1:
                return ""
            output = self.load_file(p, None)
            if output is None:
                return None

            if self.is_finished():
                self._cache[f"{p}.read_length"] = -1
            else:
                self._cache[f"{p}.read_length"] = len(output)
            return output[read_length:]

        if p in self._cache:
            return self._cache[p]

        output = self.load_file(p, None)

        if self.is_finished():
            self._cache[p] = output

        return output

    def stream_output(
        self,
        executable: Optional["Component"] = None,
        refresh_every: Union[int, float] = 1,
        stream=print,
    ):
        try:
            while not self.is_started() or self.is_active():
                output = self.output(incremental=True)
                if output:
                    stream(output)
                time.sleep(refresh_every)
        except KeyboardInterrupt:
            pass

    def update_status(
        self,
        status: StatusType = "heartbeat",
        timestamp: Optional[TimestampType] = None,
    ) -> TimestampType:
        _assert_allowed(status)

        if timestamp is None:
            timestamp = arrow.now()
        if isinstance(timestamp, arrow.Arrow):
            timestamp = arrow.get(timestamp)

        # resumed event can occur multiple times
        multiple = status == "resumed"

        save_file(
            self.local_directory(f"{status}_at"),
            str(timestamp) + ("\n" if multiple else ""),
            mode="a" if multiple else "w",
        )

        return timestamp

    def retrieve_status(
        self,
        status: StatusType = "heartbeat",
    ) -> Optional[DatetimeType]:
        _assert_allowed(status)

        status = self.load_file([f"{status}_at"], default=None)
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

    def started_at(self) -> Optional[DatetimeType]:
        """Returns the starting time"""
        if not self.is_mounted():
            return None
        return self.retrieve_status("started")

    def resumed_at(
        self,
    ) -> Optional[DatetimeType]:
        """Returns the resumed time"""
        if not self.is_mounted():
            return None
        return self.retrieve_status("resumed")

    def heartbeat_at(self):
        """Returns the last heartbeat time"""
        if not self.is_mounted():
            return None
        return self.retrieve_status("heartbeat")

    def finished_at(
        self,
    ):
        """Returns the finishing time"""
        if not self.is_mounted():
            return None
        return self.retrieve_status("finished")

    def is_finished(
        self,
    ):
        """True if finishing time has been written"""
        return bool(self.finished_at())

    def is_started(
        self,
    ):
        """True if starting time has been written"""
        return bool(self.started_at())

    def is_resumed(
        self,
    ):
        """True if resumed time has been written"""
        return bool(self.resumed_at())

    def is_active(
        self,
    ):
        """True if not finished and last heartbeat occurred less than 30 seconds ago"""
        if self.is_finished():
            return False

        if not (heartbeat := self.heartbeat_at()):
            return False

        return (arrow.now() - heartbeat).seconds < 30

    def is_live(
        self,
    ):
        """True if active or finished"""
        return self.is_finished() or self.is_active()

    def is_incomplete(
        self,
    ):
        """Shorthand for is_started() and not is_live()"""
        return self.is_started() and not self.is_live()

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

    def on_before_commit(self, executable):
        """Event hook before interface is committed."""

    def on_commit(self, executable):
        """Event hook during interface commit when uuid, config, context
        and predicate have been computed and commit is about to be performed"""

    @property
    def seed(self) -> int:
        return self.__model__.seed

    def __iter__(self):
        yield from self.executables

    def __exit__(self, *args):
        if len(args) == 3 and any(map(lambda x: x is not None, args)):
            # error occurred
            super().__exit__()
        elif self._defer_launch:
            super().__exit__()
        else:
            try:
                self.launch()
            finally:
                super().__exit__()
