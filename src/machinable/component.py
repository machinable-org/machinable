from typing import TYPE_CHECKING, List, Optional, Union

import inspect
import os
import random
import sys

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

from typing import Dict

from machinable import schema
from machinable.collection import ComponentCollection, ExecutionCollection
from machinable.element import get_dump, get_lineage
from machinable.index import Index
from machinable.interface import Interface, has_many
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
        self._execution = None

    @has_many(key="execution_history")
    def execution_history() -> ExecutionCollection:
        from machinable.execution import Execution

        return Execution

    @property
    def components(self) -> "ComponentCollection":
        return ComponentCollection([self])

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
                if self._execution is None:
                    self._execution = Execution.get()
                related = self._execution

        return related

    def launch(self) -> Self:
        from machinable.execution import Execution

        self.fetch()

        if Execution.is_connected():
            # stage only, defer execution
            if not self.is_staged():
                self.stage()
            Execution.get().add(self)
        else:
            Execution().add(self).launch()

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

    def cached(
        self, cached: Optional[bool] = None, reason: str = "user"
    ) -> bool:
        if cached is None:
            return self.load_file("cached", None) is not None
        elif cached is True:
            self.save_file("cached", str(reason))
            return True
        elif cached is False:
            try:
                os.remove(self.local_directory("cached"))
            except OSError:
                pass

        return cached

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
