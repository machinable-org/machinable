from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union

import os
import random
import stat
import sys

import arrow
from machinable import errors, schema
from machinable.collection import (
    ElementCollection,
    ExecutionCollection,
    ExperimentCollection,
    RecordCollection,
)
from machinable.element import (
    Element,
    belongs_to,
    defaultversion,
    get_lineage,
    has_many,
    normversion,
)
from machinable.errors import ConfigurationError
from machinable.group import Group
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

if TYPE_CHECKING:
    from machinable.execution import Execution
    from machinable.record import Record


class Experiment(Element):  # pylint: disable=too-many-public-methods
    kind = "Experiment"
    default = get_settings().default_experiment

    def __init__(
        self,
        version: VersionType = None,
        seed: Union[int, None] = None,
        derived_from: Optional["Experiment"] = None,
        uses: Union[None, Element, List[Element]] = None,
    ):
        super().__init__(version=version)
        if seed is None:
            seed = generate_seed()
        self.__model__ = schema.Experiment(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            seed=seed,
            lineage=get_lineage(self),
        )
        if derived_from is not None:
            self.__model__.derived_from_id = derived_from.experiment_id
            self.__model__.derived_from_timestamp = derived_from.timestamp
            self.__related__["ancestor"] = derived_from
        self._events: Events = Events()
        self.__related__["uses"] = ElementCollection()
        if uses:
            self.use(uses)

    @belongs_to
    def group():
        return Group

    @belongs_to
    def project():
        from machinable.project import Project

        return Project

    @has_many
    def derived() -> ExperimentCollection:
        """Returns a collection of derived experiments"""
        return Experiment, ExperimentCollection, False

    @belongs_to
    def ancestor() -> Optional["Experiment"]:
        """Returns parent experiment or None if experiment is independent"""
        return Experiment

    @has_many
    def executions() -> "ExecutionCollection":
        from machinable.execution import Execution

        return Execution, ExecutionCollection

    @belongs_to
    def execution() -> "Execution":
        from machinable.execution import Execution

        return Execution, False

    def launch(self) -> "Experiment":
        from machinable.execution import Execution

        execution = Execution.get()

        execution.add(self)

        if Execution.is_connected():
            # commit only, defer execution
            self.commit()
        else:
            execution()

        return self

    @has_many
    def uses() -> "ElementCollection":
        return Element, ElementCollection

    @classmethod
    def collect(cls, experiments) -> ExperimentCollection:
        """Returns a collection of experiments"""
        return ExperimentCollection(experiments)

    @classmethod
    def from_model(cls, model: schema.Experiment) -> "Experiment":
        return super().from_model(model)

    def __reduce__(self) -> Union[str, Tuple[Any, ...]]:
        return (self.__class__, ("",), self.serialize())

    def _assert_editable(self):
        if self.is_mounted():
            raise ConfigurationError(
                "Experiment can not be modified as it has already been executed. "
                "Use .derive() or Experiment(derived_from) to derive a modified experiment."
            )

    def _clear_caches(self) -> None:
        self._config = None
        self.__model__.config = None

    def use(self, use: Union[Element, List[Element]]) -> "Experiment":
        self._assert_editable()

        if isinstance(use, (list, tuple)):
            for _use in use:
                self.use(_use)
            return self

        if not isinstance(use, Element):
            raise ValueError(f"Expected element, but found: {type(use)} {use}")

        self.__related__["uses"].append(use)

        return self

    def group_as(self, group: Union[Group, str]) -> "Experiment":
        # todo: allow group modifications after execution
        self._assert_editable()

        if isinstance(group, str):
            group = Group(group)
        if not isinstance(group, Group):
            raise ValueError(
                f"Expected group, but found: {type(group)} {group}"
            )
        group.__related__.setdefault("experiments", ExperimentCollection())
        group.__related__["experiments"].append(self)
        self.__related__["group"] = group

        return self

    def derive(
        self,
        module: Optional[str] = None,
        version: VersionType = None,
        predicate: Optional[str] = get_settings().default_predicate,
        **kwargs,
    ) -> "Experiment":
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

    def commit(self) -> "Experiment":
        self.on_before_commit()

        Storage.get().commit(self)

        return self

    @property
    def experiment_id(self) -> str:
        return self.__model__.experiment_id

    @property
    def resources(self) -> Optional[Dict]:
        if self.execution is None:
            return None
        return self.execution.load_file(
            f"resources-{self.experiment_id}.json", None
        )

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

    def __call__(self) -> None:
        if self.is_finished():
            return None

        self.dispatch()

    def dispatch(self) -> "Experiment":
        """Dispatch the experiment lifecycle"""
        try:
            self.on_dispatch()

            self.on_seeding()

            if self.on_write_meta_data() is not False and self.is_mounted():
                self.mark_started()
                self._events.on("heartbeat", self.update_heartbeat)
                self._events.heartbeats(seconds=15)
                if self.execution:
                    self.execution.save_file(
                        "env.json",
                        data=Project.get().provider().get_host_info(),
                    )

            # create
            self.on_before_create()
            self.on_create()
            self.on_after_create()

            # execute
            self.on_before_execute()
            self.on_execute()
            self.on_after_execute()

            self.on_success()
            self.on_finish(success=True)

            # destroy
            self.on_before_destroy()
            self._events.heartbeats(None)
            self.on_destroy()
            if self.on_write_meta_data() is not False and self.is_mounted():
                self.update_heartbeat(mark_finished=True)

            self.on_after_destroy()

            self.on_after_dispatch()
        except BaseException as _ex:  # pylint: disable=broad-except
            self.on_failure(exception=_ex)
            self.on_finish(success=False)

            self.on_after_dispatch()

            raise errors.ExecutionFailed(
                f"{self.__class__.__name__} dispatch failed"
            ) from _ex

        return self

    # life cycle

    def on_write_meta_data(self) -> Optional[bool]:
        """Event triggered before meta-data such as creation time etc. is written to the storage

        Return False to prevent writing of meta-data
        """

    def on_before_dispatch(self) -> Optional[bool]:
        """Event triggered before the dispatch of the experiment"""

    def on_before_commit(self) -> Optional[bool]:
        """Event triggered before the commit of the experiment"""

    def on_dispatch(self):
        """Lifecycle event triggered at the very beginning of the component dispatch"""

    def on_seeding(self):
        """Lifecycle event to implement custom seeding using `self.seed`"""
        random.seed(self.seed)

    def on_before_create(self):
        """Lifecycle event triggered before components creation"""

    def on_create(self):
        """Lifecycle event triggered during components creation"""

    def on_after_create(self):
        """Lifecycle event triggered after components creation"""

    def on_before_execute(self):
        """Lifecycle event triggered before components execution"""

    def on_execute(self) -> Any:
        """Lifecycle event triggered at components execution"""
        return True

    def on_after_execute_iteration(self, iteration: int):
        """Lifecycle event triggered after execution iteration"""

    def on_after_execute(self):
        """Lifecycle event triggered after execution"""

    def on_before_destroy(self):
        """Lifecycle event triggered before components destruction"""

    def on_destroy(self):
        """Lifecycle event triggered at components destruction"""

    def on_after_destroy(self):
        """Lifecycle event triggered after components destruction"""

    def on_finish(self, success: bool):
        """Lifecycle event triggered right before the end of the component execution

        # Arguments
        success: Whether the execution finished sucessfully
        result: Return value of on_execute event
        """

    def on_success(self):
        """Lifecycle event triggered iff execution finishes successfully

        # Arguments
        result: Return value of on_execute event
        """

    def on_failure(self, exception: errors.MachinableError):
        """Lifecycle event triggered iff the execution finished with an exception

        # Arguments
        exception: Execution exception
        """

    def on_after_dispatch(self):
        """Lifecycle event triggered at the end of the dispatch.

        This is triggered independent of whether the execution has been successful or not."""

    # exports

    def dispatch_code(self, inline: bool = True) -> Optional[str]:
        storage = Storage.get().as_json().replace('"', '\\"')
        code = f"""
        from machinable import Project, Storage, Experiment
        from machinable.errors import StorageError
        Project('{Project.get().path()}').__enter__()
        Storage.from_json('{storage}').__enter__()
        experiment__ = Experiment.find('{self.experiment_id}', timestamp={self.timestamp})
        experiment__()
        """

        if inline:
            code = code.replace("\n        ", ";")[1:-1]
            return f'{sys.executable} -c "{code}"'

        return code.replace("        ", "")[1:-1]

    def __repr__(self):
        return f"Experiment [{self.__model__.experiment_id}]"

    def __str__(self):
        return self.__repr__()

    def __eq__(self, other):
        return (
            self.experiment_id == other.experiment_id
            and self.timestamp == other.timestamp
        )

    def __ne__(self, other):
        return (
            self.experiment_id != other.experiment_id
            or self.timestamp != other.timestamp
        )
