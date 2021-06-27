from typing import TYPE_CHECKING, Any, Dict, Optional, Union

import sys

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
        self.__use_config = config.get("_uses_", None)
        super().__init__(config, version, parent)
        self.__events: Events = Events()

    @property
    def experiment(self) -> Optional["Experiment"]:
        return self.element

    @property
    def components(self) -> Dict[str, "Component"]:
        return self.experiment.components(defaults=self.__use_config)

    def default_resources(self, engine: "Engine") -> Optional[dict]:
        """Default resources"""

    def dispatch(self):
        """Execute the interface lifecycle"""
        try:
            self.on_dispatch()

            if self.experiment.is_mounted():
                self.experiment.mark_started()
                self.__events.on("heartbeat", self.experiment.update_heartbeat)
                self.__events.heartbeats(seconds=15)

            if self.on_seeding() is not False:
                self.set_seed()

            # create
            self.on_before_create()
            self.on_create()
            self.on_after_create()

            # execute
            self.on_before_execute()
            status = self.on_execute()
            self.on_after_execute()

            # destroy
            self.on_before_destroy()
            self.__events.heartbeats(None)
            for component in self.experiment.components().values():
                on_destroy = getattr(component, "on_destroy", None)
                if callable(on_destroy):
                    on_destroy()

            self.on_destroy()
            if self.experiment.is_mounted():
                self.experiment.update_heartbeat(mark_finished=True)

            self.on_after_destroy()

            self.on_success(result=status)
            self.on_finish(success=True)
        except (KeyboardInterrupt, SystemExit) as _interrupt:
            status = errors.ExecutionInterrupt(
                "The components execution has been interrupted by the user or system.",
                *sys.exc_info(),
            )
            status.__cause__ = _interrupt
            try:
                self.on_failure(exception=status)
                self.on_finish(success=False, result=status)
            except BaseException as _gex:  # pylint: disable=broad-except
                status = errors.ExecutionFailed(
                    "Unhandled exception in on_failure or on_finish",
                    *sys.exc_info(),
                )
                status.__cause__ = _gex
        except BaseException as _ex:  # pylint: disable=broad-except
            status = errors.ExecutionFailed(
                "Execution failed",
                *sys.exc_info(),
            )
            status.__cause__ = _ex
            try:
                self.on_failure(exception=status)
                self.on_finish(success=False, result=status)
            except BaseException as _gex:  # pylint: disable=broad-except
                status = errors.ExecutionFailed(
                    "Unhandled exception in on_failure or on_finish",
                    *sys.exc_info(),
                )
                status.__cause__ = _gex

        return status

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

    def save_checkpoint(
        self, path: str = None, timestep=None
    ) -> Union[bool, str]:
        """Saves components to a checkpoint

        # Arguments
        path: Path where checkpoints should be saved
        timestep: Optional timestep of checkpoint. If None, timestep will count up automatically

        # Returns
        Filepath of the saved checkpoint or False if checkpoint has not been saved
        """
        if timestep is None:
            timestep: int = -1  # TODO

        if path is None:
            if not self.experiment.is_mounted():
                raise ValueError("You need to specify a checkpoint path")

            # checkpoint_path = self.storage.get_path("checkpoints", create=True)
            # path = os.path.join(os.path.expanduser(basepath), checkpoint_path)

        checkpoint = self.on_save(path, timestep)

        return checkpoint

    def restore_checkpoint(self, checkpoint):
        """Restores a checkpoint

        # Arguments
        filepath: Checkpoint filepath
        """
        return self.on_restore(checkpoint)

    # life cycle

    def on_init(self):
        """Event when interface is initialised."""

    def on_dispatch(self):
        """Lifecycle event triggered at the very beginning of the component dispatch"""

    def on_seeding(self):
        """Lifecycle event to implement custom seeding

        Return False to prevent the default seeding procedure
        """
        pass

    def on_before_create(self):
        """Lifecycle event triggered before components creation"""
        pass

    def on_create(self):
        """Lifecycle event triggered during components creation"""

    def on_save(self, checkpoint_path: str, timestep: int) -> Union[bool, str]:
        """Implements the checkpoint functionality of the components

        # Arguments
        checkpoint_path: String, target directory
        timestep: Integer, counting number of checkpoint

        # Returns
        Returns the name of the checkpoint file or path. Return False to indicate that checkpoint has not been saved.
        """
        return False

    def on_restore(self, checkpoint):
        """Implements the restore checkpoint functionality of the components

        # Arguments
        checkpoint: Checkpoint specification
        timestep: Integer, counting number of checkpoint

        # Returns
        Return False to indicate that checkpoint has not been restored.
        """

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
        """

    def on_success(self, result: Optional[Any] = None):
        """Lifecycle event triggered iff execution finishes successfully

        # Arguments
        result: Return value of on_execute event
        """

    def on_failure(self, exception: errors.MachinableError):
        """Lifecycle event triggered iff execution finished with an exception

        # Arguments
        exception: Execution exception
        """
