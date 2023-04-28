from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union

import os
import random
import stat
import sys

import arrow
from machinable import errors, schema
from machinable.collection import (
    ComponentCollection,
    ElementCollection,
    ExecutionCollection,
    RecordCollection,
)
from machinable.element import (
    Element,
    belongs_to,
    defaultversion,
    get_dump,
    get_lineage,
    has_many,
    normversion,
)
from machinable.errors import ConfigurationError
from machinable.group import Group
from machinable.interface import Interface
from machinable.project import Project
from machinable.settings import get_settings
from machinable.storage.storage import Storage
from machinable.types import DatetimeType, TimestampType, VersionType
from machinable.utils import (
    Events,
    generate_seed,
    sentinel,
    timestamp_to_directory,
)

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

if TYPE_CHECKING:
    from machinable.execution import Execution
    from machinable.record import Record


class Component(Interface):  # pylint: disable=too-many-public-methods
    kind = "Component"
    default = get_settings().default_component

    def __init__(
        self,
        version: VersionType = None,
        seed: Union[int, None] = None,
        derived_from: Optional["Component"] = None,
        uses: Union[None, Element, List[Element]] = None,
    ):
        super().__init__(version=version, uses=uses)
        if seed is None:
            seed = generate_seed()
        self.__model__ = schema.Component(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            seed=seed,
            lineage=get_lineage(self),
        )
        self.__model__._dump = get_dump(self)
        if derived_from is not None:
            self.__model__.derived_from_id = derived_from.id
            self.__model__.derived_from_timestamp = derived_from.timestamp
            self.__related__["ancestor"] = derived_from
        self._events: Events = Events()

    @belongs_to
    def group():
        return Group

    @has_many
    def derived() -> ComponentCollection:
        """Returns a collection of derived components"""
        return Component, ComponentCollection, False

    @belongs_to
    def ancestor() -> Optional["Component"]:
        """Returns parent component or None if component is independent"""
        return Component

    @classmethod
    def collect(cls, components) -> ComponentCollection:
        """Returns a collection of components"""
        return ComponentCollection(components)

    @classmethod
    def from_model(cls, model: schema.Component) -> "Component":
        return super().from_model(model)

    def __reduce__(self) -> Union[str, Tuple[Any, ...]]:
        return (self.__class__, ("",), self.serialize())

    def _assert_editable(self):
        if self.is_mounted():
            raise ConfigurationError(
                "Component can not be modified as it has already been executed. "
                "Use .derive() or Component(derived_from) to derive a modified component."
            )

    def _clear_caches(self) -> None:
        self._config = None
        self.__model__.config = None

    def group_as(self, group: Union[Group, str]) -> "Component":
        # todo: allow group modifications after execution
        self._assert_editable()

        if isinstance(group, str):
            group = Group(group)
        if not isinstance(group, Group):
            raise ValueError(
                f"Expected group, but found: {type(group)} {group}"
            )
        group.__related__.setdefault("components", ComponentCollection())
        group.__related__["components"].append(self)
        self.__related__["group"] = group

        return self

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

    def version(
        self, version: VersionType = sentinel, overwrite: bool = False
    ) -> List[Union[str, dict]]:
        if version is sentinel:
            return self.__model__.version

        self._assert_editable()

        if overwrite:
            self.__model__.version = normversion(version)
        else:
            self.__model__.version.extend(normversion(version))

        self._clear_caches()

        return self.__model__.version

    def commit(self) -> "Component":
        self.on_before_commit()

        Storage.get().commit(self)

        return self

    def records(self, scope="default") -> RecordCollection:
        if not self.is_mounted():
            return RecordCollection()

        if f"records.{scope}" in self._cache:
            return self._cache[f"records.{scope}"]

        records = RecordCollection(
            self.__model__._storage_instance.retrieve_records(self, scope)
        )

        if self.is_finished():
            self._cache[f"records.{scope}"] = records

        return records

    def record(self, scope="default") -> "Record":
        from machinable.record import Record

        if f"record.{scope}" not in self._cache:
            self._cache[f"record.{scope}"] = Record(self, scope)

        return self._cache[f"record.{scope}"]

    def mark_started(
        self, timestamp: Optional[TimestampType] = None
    ) -> Optional[DatetimeType]:
        if self.is_finished():
            return None
        return self.__model__._storage_instance.mark_started(self, timestamp)

    def update_heartbeat(
        self,
        timestamp: Union[float, int, DatetimeType, None] = None,
        mark_finished=False,
    ) -> Optional[DatetimeType]:
        if self.is_finished():
            return None
        self.__model__._storage_instance.update_heartbeat(
            self, timestamp, mark_finished
        )

    def output(self, incremental: bool = False) -> Optional[str]:
        """Returns the output log"""
        if not self.is_mounted():
            return None
        if incremental:
            read_length = self._cache.get("output_read_length", 0)
            if read_length == -1:
                return ""
            output = self.__model__._storage_instance.retrieve_output(self)
            if output is None:
                return None

            if self.is_finished():
                self._cache["output_read_length"] = -1
            else:
                self._cache["output_read_length"] = len(output)
            return output[read_length:]

        if "output" in self._cache:
            return self._cache["output"]

        output = self.__model__._storage_instance.retrieve_output(self)

        if self.is_finished():
            self._cache["output"] = output

        return output

    @property
    def seed(self) -> int:
        return self.__model__.seed

    @property
    def timestamp(self) -> int:
        return self.__model__.timestamp

    def created_at(self) -> Optional[DatetimeType]:
        if self.timestamp is None:
            return None

        return arrow.get(self.timestamp)

    def started_at(self) -> Optional[DatetimeType]:
        """Returns the starting time"""
        if not self.is_mounted():
            return None
        return self.__model__._storage_instance.retrieve_status(self, "started")

    def heartbeat_at(self):
        """Returns the last heartbeat time"""
        if not self.is_mounted():
            return None
        return self.__model__._storage_instance.retrieve_status(
            self, "heartbeat"
        )

    def finished_at(self):
        """Returns the finishing time"""
        if not self.is_mounted():
            return None
        return self.__model__._storage_instance.retrieve_status(
            self, "finished"
        )

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
        return self.is_finished() or is_active()

    def is_incomplete(self):
        """Shorthand for is_started() and not (is_active() or is_finished())"""
        return self.is_started() and not (
            self.is_active() or self.is_finished()
        )

    def dispatch(self) -> Self:
        """Dispatch the component lifecycle"""
        try:
            self.on_before_dispatch()

            self.on_seeding()

            # meta-data
            if self.on_write_meta_data() is not False and self.is_mounted():
                self.mark_started()
                self._events.on("heartbeat", self.update_heartbeat)
                self._events.heartbeats(seconds=15)
                if self.execution:
                    self.execution.save_file(
                        "env.json",
                        data=Project.get().provider().get_host_info(),
                    )

            self.__call__()

            self.on_success()
            self.on_finish(success=True)

            # finalize meta data
            self._events.heartbeats(None)
            if self.on_write_meta_data() is not False and self.is_mounted():
                self.update_heartbeat(mark_finished=True)

            self.on_after_dispatch(success=True)
        except BaseException as _ex:  # pylint: disable=broad-except
            self.on_failure(exception=_ex)
            self.on_finish(success=False)
            self.on_after_dispatch(success=False)

            raise errors.ExecutionFailed(
                f"{self.__class__.__name__} dispatch failed"
            ) from _ex

    def cached(self) -> bool:
        return self.is_finished()

    # life cycle

    def __call__(self) -> None:
        """Main event"""

    def on_before_commit(self) -> Optional[bool]:
        """Event triggered before the commit of the component"""

    def on_before_dispatch(self) -> Optional[bool]:
        """Event triggered before the dispatch of the component"""

    def on_seeding(self):
        """Lifecycle event to implement custom seeding using `self.seed`"""
        random.seed(self.seed)

    def on_write_meta_data(self) -> Optional[bool]:
        """Event triggered before meta-data such as creation time etc. is written to the storage

        Return False to prevent writing of meta-data
        """

    def on_success(self):
        """Lifecycle event triggered iff execution finishes successfully"""

    def on_finish(self, success: bool):
        """Lifecycle event triggered right before the end of the component execution

        # Arguments
        success: Whether the execution finished sucessfully
        """

    def on_failure(self, exception: errors.MachinableError):
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

    def __repr__(self):
        return f"Component [{self.__model__.id}]"

    def __str__(self):
        return self.__repr__()

    def __eq__(self, other):
        return self.id == other.id and self.timestamp == other.timestamp

    def __ne__(self, other):
        return self.id != other.id or self.timestamp != other.timestamp
