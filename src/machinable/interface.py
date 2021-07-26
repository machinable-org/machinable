from typing import TYPE_CHECKING, Any, Dict, Optional, Union

import sys
import traceback

from machinable import errors
from machinable.component import Component
from machinable.types import VersionType
from machinable.utils import Events, apply_seed

if TYPE_CHECKING:
    from machinable.element import Element
    from machinable.engine.engine import Engine
    from machinable.experiment import Experiment


class Interface(Component):  # pylint: disable=too-many-public-methods
    """Interface base class"""

    def __init__(
        self,
        config: dict,
        version: VersionType = None,
        parent: Union["Element", "Component", None] = None,
    ):
        super().__init__(config, version, parent)
        self._events: Events = Events()
        self._experiment: Optional["Experiment"] = parent

    @property
    def experiment(self) -> Optional["Experiment"]:
        return self._experiment

    @experiment.setter
    def experiment(self, element: "Experiment") -> None:
        self._experiment = element

    def default_resources(self, engine: "Engine") -> Optional[dict]:
        """Default resources"""

    def dispatch(self):
        """Execute the interface lifecycle"""
        try:
            self.on_dispatch()

            if self.experiment.is_mounted():
                self.experiment.mark_started()
                self._events.on("heartbeat", self.experiment.update_heartbeat)
                self._events.heartbeats(seconds=15)
                self.experiment.save_host_info()

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
            for component in self.components.values():
                on_destroy = getattr(component, "on_destroy", None)
                if callable(on_destroy):
                    on_destroy()

            self.on_destroy()
            if self.experiment.is_mounted():
                self.experiment.update_heartbeat(mark_finished=True)

            self.on_after_destroy()

            return result
        except BaseException as _ex:  # pylint: disable=broad-except
            self.on_failure(exception=_ex)
            self.on_finish(success=False, result=_ex)
            failure_message = "".join(
                traceback.format_exception(
                    etype=type(_ex), value=_ex, tb=_ex.__traceback__
                )
            )
            raise errors.ExecutionFailed(
                f"{self.__class__.__name__} dispatch failed: {failure_message}"
            ) from _ex

    def set_seed(self, seed: Optional[int] = None) -> bool:
        """Applies a random seed

        # Arguments
        seed: Integer, random seed. If None, self.experiment.seed will be used

        To prevent the automatic seeding, you can overwrite
        the on_seeding event and return False
        """
        if seed is None:
            seed = self.experiment.seed

        return apply_seed(seed)

    # life cycle

    def on_init(self):
        """Event when interface is initialised."""

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
