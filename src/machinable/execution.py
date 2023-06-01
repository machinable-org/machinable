from typing import Any, Dict, List, Optional, Union

import copy
import sys

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

from machinable import schema
from machinable.collection import ComponentCollection
from machinable.component import Component
from machinable.element import extract, get_dump, get_lineage
from machinable.errors import ExecutionFailed
from machinable.interface import Interface, has_many, has_one
from machinable.project import Project
from machinable.schedule import Schedule
from machinable.settings import get_settings
from machinable.types import ElementType, VersionType
from machinable.utils import sentinel, update_dict


class Execution(Interface):
    kind = "Execution"
    default = get_settings().default_execution

    def __init__(
        self,
        version: VersionType = None,
        resources: Optional[Dict] = None,
        schedule: Union[
            Schedule, ElementType, None
        ] = get_settings().default_schedule,
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
        self._starred_predicates = {"resources": None}

    def compute_predicate(self) -> Dict:
        predicates = super().compute_predicate()
        predicates["resources"] = self.__model__.resources
        return predicates

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

        return super().commit()

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
                executable.save_file(
                    f"resources-{self.id}.json",
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

    def __iter__(self):
        yield from self.executables

    def __exit__(self, *args, **kwargs):
        self.dispatch()

        super().__exit__()

    def __repr__(self) -> str:
        return "Execution"
