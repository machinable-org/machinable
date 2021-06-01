from typing import TYPE_CHECKING, Any, Dict, Optional, Union

from functools import partial

from machinable import errors
from machinable.component import Component
from machinable.storage.storage import Storage
from machinable.types import VersionType
from machinable.utils import Events, apply_seed

if TYPE_CHECKING:
    from machinable.engine.engine import Engine
    from machinable.experiment import Experiment


class Interface(Component):  # pylint: disable=too-many-public-methods
    """Interface base class"""

    def __init__(self, config: dict, version: VersionType = None):
        super().__init__(config, version)
        self._storage: Optional[Storage] = None
        self._events: Events = Events()
        self._experiment: Optional["Experiment"] = None

    @property
    def experiment(self) -> Optional["Experiment"]:
        return self._experiment

    def default_resources(self, engine: "Engine") -> Optional[dict]:
        """Default resources"""

    def dispatch(
        self, experiment: "Experiment", storage: Optional[Storage] = None
    ):
        """Execute the interface lifecycle"""
        if storage is None and experiment.is_mounted():
            storage = experiment.__model__._storage_instance

        self._experiment = experiment
        self._storage = storage

        try:
            self.on_dispatch()

            self.on_init(**experiment.components())

            if self.on_seeding() is not False:
                self.set_seed()

            if self._storage is not None:
                self._events.on(
                    "heartbeat",
                    partial(
                        self._storage.update_heartbeat,
                        storage_id=self.experiment.__model__._storage_id,
                    ),
                )
                self._events.heartbeats(seconds=15)

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
            self._events.heartbeats(None)
            for component in experiment.components().values():
                on_destroy = getattr(component, "on_destroy", None)
                if callable(on_destroy):
                    on_destroy()

            self.on_destroy()
            if self._storage is not None:
                self._storage.update_heartbeat(mark_finished=True)

            self.on_after_destroy()

            self.on_success(result=status)
            self.on_finish(success=True)
        except (KeyboardInterrupt, SystemExit) as _interrupt:
            status = errors.ExecutionInterrupt(
                message="The components execution has been interrupted by the user or system.",
            )
            status.__cause__ = _interrupt
            self.on_failure(exception=status)
            self.on_finish(success=False, result=status)
        except BaseException as _ex:  # pylint: disable=broad-except
            status = errors.ExecutionFailed(
                reason="exception",
                message=f"Execution failed",
            )
            status.__cause__ = _ex
            self.on_failure(exception=status)
            self.on_finish(success=False, result=status)

        return status

    def set_seed(self, seed=None) -> bool:
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
            if self._storage is None:
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

    def on_dispatch(self):
        """Lifecycle event triggered at the very beginning of the component dispatch"""

    def on_init(self):
        """Event when interface is initialised

        The method can declare arguments to handle components explicitly. For example, the signature
        ``on_create(self, node, alias_of_child_1, alias_of_child_2=None)`` declares that components
        accepts two sub components with alias ``alias_of_child_1`` and ``alias_of_child_2`` where
        the latter is declared optional. If the alias starts with an underscore ``_`` the components lifecycle
        will not be triggered automatically.

        The function signature may also be used to annotate expected types, for example:

        ```python
        on_create(self, node: DistributedExperiment, model: DistributedModel = None):
            self.experiment = node
            self.model = model
        ```
        Note, however, that the type annotation will not be enforced.
        """

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
