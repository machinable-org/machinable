from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union

import copy
import os

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
    apply_seed,
    generate_seed,
    sentinel,
    timestamp_to_directory,
)
from omegaconf import OmegaConf

if TYPE_CHECKING:
    from machinable.execution.execution import Execution
    from machinable.record import Record


class Experiment(Element):  # pylint: disable=too-many-public-methods
    _key = "Experiment"
    default = get_settings().default_experiment

    def __init__(
        self,
        version: VersionType = None,
        resources: Optional[Dict] = None,
        seed: Union[int, None] = None,
        derived_from: Optional["Experiment"] = None,
    ):
        super().__init__(version=version)
        if seed is None:
            seed = generate_seed()
        self.__model__ = schema.Experiment(
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            seed=seed,
        )
        self._deferred_data = {}
        self._deferred_execution_data = {}
        if resources is not None:
            self.resources(resources)
        if derived_from is not None:
            self.__model__.derived_from_id = derived_from.experiment_id
            self.__model__.derived_from_timestamp = derived_from.timestamp
            self.__related__["ancestor"] = derived_from
        self._events: Events = Events()

    @classmethod
    def instance(
        cls,
        module: Optional[str] = None,
        version: VersionType = None,
        resources: Optional[Dict] = None,
        seed: Union[int, None] = None,
        derived_from: Optional["Experiment"] = None,
    ):
        module, version = defaultversion(module, version, cls)

        return super().make(
            module,
            version,
            base_class=Experiment,
            resources=resources,
            seed=seed,
            derived_from=derived_from,
        )

    @classmethod
    def singleton(
        cls,
        module: Optional[str] = None,
        version: VersionType = None,
    ) -> "Experiment":
        return super().singleton(module, version)

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
        from machinable.execution.execution import Execution

        return Execution, ExecutionCollection

    @belongs_to
    def execution() -> "Execution":
        from machinable.execution.execution import Execution

        return Execution, False

    @has_many
    def elements() -> "ElementCollection":
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

    def use(self, element: Union[Element, List[Element]]) -> "Experiment":
        """Adds an element to the experiment

        # Arguments
        element: Element or list of Elements
        """
        self._assert_editable()

        if isinstance(element, (list, tuple)):
            for _element in element:
                self.use(_element)
            return self

        if not isinstance(element, Element):
            raise ValueError(
                f"Expected element, but found: {type(element)} {element}"
            )

        self.__related__.setdefault("elements", ElementCollection())
        self.__related__["elements"].append(element)

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
        resources: Optional[Dict] = None,
        seed: Union[int, None] = None,
    ) -> "Experiment":
        if not self.is_mounted():
            raise ConfigurationError(
                "The experiment you are trying to derive from has not been executed yet"
            )

        experiment = self.make(
            module,
            version,
            base_class=Experiment,
            resources=resources,
            seed=seed,
            derived_from=self,
        )

        return experiment

    def derive_modified(
        self,
        module: str = sentinel,
        version: VersionType = sentinel,
        resources: Optional[Dict] = sentinel,
        seed: Union[int, None] = sentinel,
    ) -> "Experiment":

        if module is sentinel:
            module = self.__model__.module
        if version is sentinel:
            version = self.__model__.version
        if resources is sentinel:
            resources = copy.deepcopy(self.resources())
        if seed is sentinel:
            seed = None

        experiment = self.derive(module, version, resources, seed)

        if self.group:
            experiment.group_as(self.group.clone())

        return experiment

    def derive_singleton(
        self,
        module: Optional[str] = None,
        version: VersionType = None,
    ):
        return self.derived.singleton(module, version) or self.make(
            module,
            version=version,
            derived_from=self,
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

    def execute(
        self, module: Union[str, None] = None, version: VersionType = None
    ) -> "Experiment":
        """Executes the experiment"""
        if self.is_finished():
            return self

        from machinable.execution.execution import Execution

        Execution.instance(module, version=version).use(
            experiment=self
        ).dispatch()

        return self

    def save_host_info(self) -> bool:
        if not self.is_mounted():
            return False

        if self.execution is None:
            return False

        self.save_execution_data(
            "host.json", data=Project.get().provider().get_host_info()
        )

        return True

    def commit(self) -> "Experiment":
        Storage.get().commit(self)

        return self

    @property
    def experiment_id(self) -> str:
        return self.__model__.experiment_id

    def local_directory(
        self, *append: str, create: bool = False
    ) -> Optional[str]:
        if not self.is_mounted():
            return None

        return self.__model__._storage_instance.local_directory(
            self, *append, create=create
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

    def load_file(self, filepath: str, default=None) -> Optional[Any]:
        if not self.is_mounted():
            # has write been deferred?
            if filepath in self._deferred_data:
                return self._deferred_data[filepath]

            return default

        data = self.__model__._storage_instance.retrieve_file(self, filepath)

        return data if data is not None else default

    def save_file(self, filepath: str, data: Any) -> str:
        if os.path.isabs(filepath):
            raise ValueError("Filepath must be relative")

        if not self.is_mounted():
            # defer writes until experiment creation
            self._deferred_data[filepath] = data
            return "$deferred"

        return self.__model__._storage_instance.create_file(
            self, filepath, data
        )

    def save_data(self, filepath: str, data: Any) -> str:
        return self.save_file(os.path.join("data", filepath), data)

    def load_data(self, filepath: str, default=None) -> Optional[Any]:
        return self.load_file(os.path.join("data", filepath), default)

    def save_execution_data(
        self,
        filepath: str,
        data: Any,
        defer: bool = False,
        execution_timestamp: Optional[float] = None,
    ) -> str:
        if defer or self.execution is None:
            # defer writes until next execution creation
            self._deferred_execution_data[filepath] = data
            return "$deferred"

        if execution_timestamp is None:
            execution_timestamp = self.execution.timestamp

        return self.save_file(
            os.path.join(
                f"execution-{timestamp_to_directory(execution_timestamp)}/data",
                filepath,
            ),
            data,
        )

    def load_execution_data(
        self,
        filepath: str,
        default=None,
        execution_timestamp: Optional[float] = None,
    ) -> Optional[Any]:
        if self.execution is None:
            # has write been deferred?
            if filepath in self._deferred_execution_data:
                return self._deferred_execution_data[filepath]

            return default

        if execution_timestamp is None:
            execution_timestamp = self.execution.timestamp

        return self.load_file(
            os.path.join(
                f"execution-{timestamp_to_directory(execution_timestamp)}/data",
                filepath,
            ),
            default,
        )

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

    def resources(self, resources: Dict = sentinel) -> Dict:
        if resources is sentinel:
            return self.load_execution_data("resources.json", default={})

        resources = OmegaConf.to_container(
            OmegaConf.create(copy.deepcopy(resources))
        )
        self.save_execution_data(
            "resources.json",
            resources,
            defer=self.is_started(),  # if the experiment has already been executed, we write to upcoming execution
        )

        return resources

    @property
    def nickname(self) -> str:
        return self.__model__.nickname

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

    def is_incomplete(self):
        """Shorthand for is_started() and not (is_active() or is_finished())"""
        return self.is_started() and not (
            self.is_active() or self.is_finished()
        )

    def default_resources(self, execution: "Execution") -> Optional[dict]:
        """Default resources"""

    def dispatch(self):
        """Execute the interface lifecycle"""
        try:
            if self.is_finished():
                return True

            self.on_dispatch()

            if self.is_mounted():
                self.mark_started()
                self._events.on("heartbeat", self.update_heartbeat)
                self._events.heartbeats(seconds=15)
                self.save_host_info()

            if self.on_seeding() is not False:
                self.set_seed()

            # create
            self.on_before_create()
            self.on_create()
            self.on_after_create()

            # execute
            self.on_before_execute()
            result = self.on_execute()
            self.on_after_execute()

            self.on_success(result=result)
            self.on_finish(success=True, result=result)

            # destroy
            self.on_before_destroy()
            self._events.heartbeats(None)
            self.on_destroy()
            if self.is_mounted():
                self.update_heartbeat(mark_finished=True)

            self.on_after_destroy()

            return result
        except BaseException as _ex:  # pylint: disable=broad-except
            self.on_failure(exception=_ex)
            self.on_finish(success=False, result=_ex)
            raise errors.ExecutionFailed(
                f"{self.__class__.__name__} dispatch failed"
            ) from _ex

    def set_seed(self, seed: Optional[int] = None) -> bool:
        """Applies a random seed

        # Arguments
        seed: Integer, random seed. If None, self.seed will be used

        To prevent the automatic seeding, you can overwrite
        the on_seeding event and return False
        """
        if seed is None:
            seed = self.seed

        return apply_seed(seed)

    # life cycle

    def on_before_dispatch(self) -> Optional[bool]:
        """Event triggered before the dispatch of the experiment

        Return False to prevent the dispatch
        """

    def on_dispatch(self):
        """Lifecycle event triggered at the very beginning of the component dispatch"""

    def on_seeding(self):
        """Lifecycle event to implement custom seeding

        Return False to prevent the default seeding procedure
        """

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

    def on_finish(self, success: bool, result: Optional[Any] = None):
        """Lifecycle event triggered right before the end of the component execution

        # Arguments
        success: Whether the execution finished sucessfully
        result: Return value of on_execute event
        """

    def on_success(self, result: Optional[Any] = None):
        """Lifecycle event triggered iff execution finishes successfully

        # Arguments
        result: Return value of on_execute event
        """

    def on_failure(self, exception: errors.MachinableError):
        """Lifecycle event triggered iff the execution finished with an exception

        # Arguments
        exception: Execution exception
        """

    def __repr__(self):
        return f"Experiment [{self.__model__.experiment_id}]"

    def __str__(self):
        return self.__repr__()
