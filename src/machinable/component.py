from __future__ import annotations

from typing import TYPE_CHECKING, Any, List, Optional, Union

import random
import sys

from machinable.group import Group
from machinable.settings import get_settings

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

from typing import Dict

from machinable.collection import ComponentCollection, ExecutionCollection
from machinable.element import Element
from machinable.interface import Interface, belongs_to, has_many
from machinable.project import Project
from machinable.storage import Storage
from machinable.types import VersionType

if TYPE_CHECKING:
    from machinable.execution import Execution


class Component(Interface):
    kind = "Component"
    default = get_settings().default_component

    @has_many
    def executions() -> Optional[ExecutionCollection["Execution"]]:
        from machinable.execution import Execution

        return Execution

    @belongs_to(cached=False)
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
        if self.execution is None:
            return False
        return self.execution.is_finished()

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
        component__ = Component.find('{self.id}', timestamp={self.timestamp})
        component__.dispatch()
        """

        if inline:
            code = code.replace("\n        ", ";")[1:-1]
            return f'{sys.executable} -c "{code}"'

        return code.replace("        ", "")[1:-1]

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

    def group_as(self, group: Union[Group, str]) -> Self:
        # todo: allow group modifications after execution
        self._assert_editable()

        if isinstance(group, str):
            group = Group(group)
        if not isinstance(group, Group):
            raise ValueError(
                f"Expected group, but found: {type(group)} {group}"
            )
        group.__related__["components"].append(self)
        self.__related__["group"] = group

        return self

    @belongs_to
    def group():
        return Group
