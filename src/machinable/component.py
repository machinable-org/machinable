from typing import TYPE_CHECKING, Any, List, Optional, Union

import random
import sys
import threading

import arrow
from machinable.group import Group
from machinable.settings import get_settings

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

from typing import Dict

from machinable import errors, schema
from machinable.collection import ComponentCollection, ExecutionCollection
from machinable.element import Element, get_dump, get_lineage
from machinable.interface import Interface, belongs_to, belongs_to_many
from machinable.project import Project
from machinable.storage import Storage
from machinable.types import DatetimeType, TimestampType, VersionType
from machinable.utils import load_file, save_file

if TYPE_CHECKING:
    from machinable.execution import Execution


class Component(Interface):
    kind = "Component"
    default = get_settings().default_component

    def __init__(
        self,
        version: VersionType = None,
        uses: Union[None, "Interface", List["Interface"]] = None,
        derived_from: Optional["Interface"] = None,
    ):
        super().__init__(version=version, uses=uses, derived_from=derived_from)
        self.__model__ = schema.Component(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            lineage=get_lineage(self),
        )
        self.__model__._dump = get_dump(self)

    @belongs_to
    def group():
        return Group

    @belongs_to_many(key="execution_history")
    def executions() -> ExecutionCollection:
        from machinable.execution import Execution

        return Execution

    @belongs_to(key="execution_history", cached=False)
    def execution() -> "Execution":
        from machinable.execution import Execution

        return Execution

    def launch(self) -> Self:
        from machinable.execution import Execution

        execution = Execution.get()

        execution.add(self)

        if Execution.is_connected():
            # commit only, defer execution
            self.commit()
        else:
            execution.dispatch()

        return self

    @classmethod
    def collect(cls, components) -> "ComponentCollection":
        """Returns a collection of components"""
        return ComponentCollection(components)

    @property
    def resources(self) -> Optional[Dict]:
        if self.execution is None:
            return None
        return self.execution.load_file(f"resources-{self.id}.json", None)

    def dispatch(self) -> Self:
        """Dispatch the component lifecycle"""
        try:
            self.on_before_dispatch()

            self.on_seeding()

            # meta-data
            writes_meta_data = (
                self.on_write_meta_data() is not False and self.is_mounted()
            )
            if writes_meta_data:
                self.mark_started()
                self.save_file(
                    "host.json",
                    data=Project.get().provider().get_host_info(),
                )

            def beat():
                t = threading.Timer(15, beat)
                t.daemon = True
                t.start()
                self.on_heartbeat()
                if self.on_write_meta_data() is not False and self.is_mounted():
                    self.update_heartbeat()
                return t

            heartbeat = beat()

            self.__call__()

            self.on_success()
            self.on_finish(success=True)

            if writes_meta_data:
                self.update_heartbeat(mark_finished=True)

            if heartbeat is not None:
                heartbeat.cancel()

            self.on_after_dispatch(success=True)
        except BaseException as _ex:  # pylint: disable=broad-except
            self.on_failure(exception=_ex)
            self.on_finish(success=False)
            self.on_after_dispatch(success=False)
            raise errors.ComponentException(
                f"{self.__class__.__name__} dispatch failed"
            ) from _ex

    @property
    def host_info(self) -> Optional[Dict]:
        return self.load_file("host.json", None)

    def cached(self) -> bool:
        return self.is_finished()

    def derive(
        self,
        module: Union[str, Element, None] = None,
        version: VersionType = None,
        predicate: Optional[str] = get_settings().default_predicate,
        **kwargs,
    ) -> "Component":
        if module is None or predicate is None:
            return self.make(module, version, derived_from=self, **kwargs)

        return self.derived.singleton(
            module, version, predicate, derived_from=self, **kwargs
        )

    def dispatch_code(self, inline: bool = True) -> Optional[str]:
        storage = Storage.get().as_json().replace('"', '\\"')
        code = f"""
        from machinable import Project, Storage, Component
        from machinable.errors import StorageError
        Project('{Project.get().path()}').__enter__()
        Storage.from_json('{storage}').__enter__()
        component__ = Component.find('{self.uuid}')
        component__.dispatch()
        """

        if inline:
            code = code.replace("\n        ", ";")[1:-1]
            return f'{sys.executable} -c "{code}"'

        return code.replace("        ", "")[1:-1]

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

    # life cycle

    def __call__(self) -> None:
        """Main event"""

    def on_before_commit(self) -> Optional[bool]:
        """Event triggered before the commit of the component"""

    def on_before_dispatch(self) -> Optional[bool]:
        """Event triggered before the dispatch of the component"""

    def on_success(self):
        """Lifecycle event triggered iff execution finishes successfully"""

    def on_finish(self, success: bool):
        """Lifecycle event triggered right before the end of the component execution

        # Arguments
        success: Whether the execution finished sucessfully
        """

    def on_failure(self, exception: Exception) -> None:
        """Lifecycle event triggered iff the execution finished with an exception

        # Arguments
        exception: Execution exception
        """

    def on_after_dispatch(self, success: bool):
        """Lifecycle event triggered at the end of the dispatch.

        This is triggered independent of whether the execution has been successful or not.

        # Arguments
        success: Whether the execution finished sucessfully
        """

    def on_seeding(self):
        """Lifecycle event to implement custom seeding using `self.seed`"""
        if self.execution:
            random.seed(self.execution.seed)

    def on_write_meta_data(self) -> Optional[bool]:
        """Event triggered before meta-data such as creation time etc. is written to the storage

        Return False to prevent writing of meta-data
        """

    def on_heartbeat(self) -> None:
        """Event triggered on heartbeat every 15 seconds"""

    def group_as(self, group: Union[Group, str]) -> Self:
        # todo: allow group modifications after execution
        # todo: self._assert_editable()

        if isinstance(group, str):
            group = Group(group)
        if not isinstance(group, Group):
            raise ValueError(
                f"Expected group, but found: {type(group)} {group}"
            )
        group.push_related("components", self)
        self.push_related("group", group)

        return self
