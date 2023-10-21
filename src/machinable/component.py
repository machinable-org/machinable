from typing import TYPE_CHECKING, List, Optional, Union

import os
import random
import sys
import threading

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

from typing import Dict

from machinable import errors, schema
from machinable.collection import ComponentCollection, ExecutionCollection
from machinable.element import _CONNECTIONS as connected_elements
from machinable.element import get_dump, get_lineage
from machinable.index import Index
from machinable.interface import Interface, belongs_to, belongs_to_many
from machinable.project import Project
from machinable.storage import Storage
from machinable.types import VersionType
from machinable.utils import generate_seed

if TYPE_CHECKING:
    from machinable.execution import Execution


class Component(Interface):
    kind = "Component"
    default = None

    def __init__(
        self,
        version: VersionType = None,
        uses: Union[None, "Interface", List["Interface"]] = None,
        derived_from: Optional["Interface"] = None,
        seed: Union[int, None] = None,
    ):
        super().__init__(version=version, uses=uses, derived_from=derived_from)
        if seed is None:
            seed = generate_seed()
        self.__model__ = schema.Component(
            kind=self.kind,
            module=self.__model__.module,
            config=self.__model__.config,
            version=self.__model__.version,
            seed=seed,
            lineage=get_lineage(self),
        )
        self.__model__._dump = get_dump(self)
        self._current_execution_context = None

    @property
    def current_execution_context(self) -> "Execution":
        if self._current_execution_context is None:
            from machinable.execution import Execution

            self._current_execution_context = Execution.get()
        return self._current_execution_context

    @belongs_to_many(key="execution_history")
    def executions() -> ExecutionCollection:
        from machinable.execution import Execution

        return Execution

    @property
    def execution(self) -> "Execution":
        from machinable.execution import Execution

        related = None
        if self.is_mounted():
            # if mounted, search for related, most recent execution
            related = Index.get().find_related(
                relation="Execution.Component.execution_history",
                uuid=self.uuid,
                inverse=True,
            )

            if related is not None and len(related) > 0:
                related = Interface.find_by_id(
                    sorted(related, key=lambda x: x.timestamp, reverse=True)[
                        0
                    ].uuid
                )
            else:
                related = None

        # use context if no related execution was found
        if related is None:
            if Execution.is_connected():
                related = Execution.get()
            else:
                related = self.current_execution_context

        related.of(self)

        return related

    def launch(self) -> Self:
        from machinable.execution import Execution

        if Execution.is_connected():
            # commit only, defer execution
            Execution.get().add(self)
            self.commit()
        else:
            self.current_execution_context.add(self)
            self.current_execution_context.dispatch()

        return self

    @property
    def seed(self) -> int:
        return self.__model__.seed

    @property
    def nickname(self) -> str:
        return self.__model__.nickname

    @classmethod
    def collect(cls, components) -> "ComponentCollection":
        return ComponentCollection(components)

    def dispatch(self) -> Self:
        """Dispatch the component lifecycle"""
        writes_meta_data = (
            self.on_write_meta_data() is not False and self.is_mounted()
        )
        try:
            self.on_before_dispatch()

            self.on_seeding()

            # meta-data
            if writes_meta_data:
                if not self.execution.is_started():
                    self.execution.update_status(status="started")
                else:
                    self.execution.update_status(status="resumed")

                self.execution.save_file(
                    [self.id, "host.json"],
                    data=Project.get().provider().get_host_info(),
                )

            def beat():
                t = threading.Timer(15, beat)
                t.daemon = True
                t.start()
                self.on_heartbeat()
                if self.on_write_meta_data() is not False and self.is_mounted():
                    self.execution.update_status(status="heartbeat")
                return t

            heartbeat = beat()

            self.__call__()

            self.on_success()
            self.on_finish(success=True)

            if heartbeat is not None:
                heartbeat.cancel()

            if writes_meta_data:
                self.execution.update_status(status="finished")
                self.cached(True, reason="finished")

            self.on_after_dispatch(success=True)
        except BaseException as _ex:  # pylint: disable=broad-except
            self.on_failure(exception=_ex)
            self.on_finish(success=False)
            self.on_after_dispatch(success=False)
            raise errors.ComponentException(
                f"{self.__class__.__name__} dispatch failed"
            ) from _ex
        finally:
            if writes_meta_data:
                # propagate changes
                for storage in Storage.connected():
                    storage.update(self)

    def cached(
        self, cached: Optional[bool] = None, reason: str = "user"
    ) -> bool:
        if cached is None:
            return self.load_file("cached", None) is not None
        elif cached is True:
            self.save_file("cached", str(reason))
            return True
        elif cached is False:
            os.remove(self.local_directory("cached"), ignore_errors=True)

        return cached

    def dispatch_code(self, inline: bool = True) -> Optional[str]:
        connections = [f"Project('{Project.get().path()}').__enter__()"]
        for kind, elements in connected_elements.items():
            if kind in ["Project", "Execution"]:
                continue
            for element in elements:
                jn = element.as_json().replace('"', '\\"').replace("'", "\\'")
                connections.append(f"Element.from_json('{jn}').__enter__()")
        context = "\n".join(connections)
        code = f"""
        from machinable import Project, Element, Component
        {context}
        component__ = Component.find_by_id('{self.uuid}')
        component__.dispatch()
        """

        if inline:
            code = code.replace("\n        ", ";")[1:-1]
            return f'{sys.executable} -c "{code}"'

        return code.replace("        ", "")[1:-1]

    # life cycle

    def __call__(self) -> None:
        ...

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
        random.seed(self.seed)

    def on_write_meta_data(self) -> Optional[bool]:
        """Event triggered before meta-data such as creation time etc. is written to the storage

        Return False to prevent writing of meta-data
        """

    def on_heartbeat(self) -> None:
        """Event triggered on heartbeat every 15 seconds"""
