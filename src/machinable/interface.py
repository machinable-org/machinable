from typing import TYPE_CHECKING, Optional, Union

from machinable.component import Component
from machinable.storage.storage import Storage
from machinable.types import VersionType
from machinable.utils import Events

if TYPE_CHECKING:
    from machinable.engine.engine import Engine


def get_slots(interface: "Interface"):
    pass


class Interface(Component):
    """Interface base class"""

    def __init__(self, component: dict, version: VersionType = None):
        super().__init__(component, version)
        self._storage: Optional[Storage] = None
        self._events: Events = Events()

    def default_resources(self, engine: "Engine") -> Optional[dict]:
        """Default resources"""

    def on_init(self):
        """Event when interface is """

    def dispatch(
        self,
        actor_reference=None,
        lifecycle=True,
    ):
        # Prepares and dispatches the components lifecycle and returns its result
        try:
            self.on_start()

            self._actor_config = actor_reference

            if self.node is None and self.on_seeding() is not False:
                self.set_seed()

            components_config = []
            storage_config = {"url": "mem://"}

            self.on_init_storage(storage_config)

            self.storage = Storage.make(storage_config)

            self.on_after_init_storage(storage_config)

            self.component_status["started_at"] = str(arrow.now())
            self.component_status["finished_at"] = False
            self.refresh_status(log_errors=True)

            if not storage_config["url"].startswith("mem://"):
                OutputRedirection.apply(
                    self.flags["OUTPUT_REDIRECTION"],
                    self.storage.get_stream,
                    self.storage.get_path("output.log"),
                )

            if not self.storage.has_file("host.json"):
                self.storage.save_file("host.json", get_host_info())
            if not self.storage.has_file("component.json"):
                self.storage.save_file("component.json", self.serialize())
            if not self.storage.has_file("components.json"):
                self.storage.save_file(
                    "components.json",
                    [component.serialize() for component in self.components]
                    if self.components
                    else [],
                )
            self.component_state.save(self)

            if self.node is None:
                self.events.heartbeats(seconds=self.flags.get("HEARTBEAT", 15))
                self.events.on("heartbeat", self.refresh_status)

            if self.on_init_components(components_config) is not False:
                components = []
                index = 0
                for component_config in components_config:
                    if (
                        self.on_init_components(component_config, index)
                        is not False
                    ):
                        components.append(
                            component_config["class"](
                                config=copy.deepcopy(
                                    component_config["config"]
                                ),
                                flags=copy.deepcopy(component_config["flags"]),
                                node=self,
                            )
                        )
                        self.on_after_init_components(components[-1], index)
                        index += 1

                self.on_after_init_components(components)
            else:
                components = None

            if not lifecycle:
                return components

            self.create(components)

            if self.node is None:
                set_process_title(repr(self))

            status = self.execute()
            self.destroy()

            self.on_success(status)
            self.on_finish(status, success=True)
        except (KeyboardInterrupt, SystemExit):
            status = machinable.errors.ExecutionInterrupt(
                reason="user_interrupt",
                message="The components execution has been interrupted by the user or system.",
            )
            self.on_failure(status)
            self.on_finish(status, success=False)
        except BaseException as ex:
            status = machinable.errors.ExecutionFailed(
                reason="exception",
                message=f"The following exception occurred: {ex}\n{exception_to_str(ex)}",
            )
            self.on_failure(status)
            self.on_finish(status, success=False)
        finally:
            OutputRedirection.revert()

        return status

    def create(self, components=None):
        """Creates the components

        ::: tip
        This method is triggered automatically. However, sub-component creation can be suppressed in the on_create
        event of the node component. See [on_create](#on_create) for details.
        :::

        Triggers create events of the lifecycle

        # Arguments
        components: Optional list of sub components instances that are used by the components
        """
        self.on_before_create()

        if components is not None:
            self.components = components

        # prepare sub components and invoke on_create event
        inject_components(self, self.components, self.on_create)

        self.on_after_create()

        self.component_state.created = True
        self.component_state.save(self)

    def execute(self):
        """Executes the components

        Triggers execution events and writes execution meta-data

        ::: tip
        Execution is triggered automatically for node components only.
        :::
        """
        self.on_before_execute()

        try:
            status = self.on_execute()
        except (KeyboardInterrupt, StopIteration) as e:
            status = e

        # if on_iterate is not overwritten ...
        if hasattr(self.on_execute_iteration, "_deactivated") or self.flags.get(
            "TUNING", False
        ):
            # on_execute becomes execute event
            pass
        else:
            # otherwise, we enable the iteration paradigm
            iteration = -1
            while True:
                iteration += 1
                self.flags.ITERATION = iteration
                self.on_before_execute_iteration(iteration)

                try:
                    callback = self.on_execute_iteration(iteration)
                    self.on_after_execute_iteration(iteration)
                except (KeyboardInterrupt, StopIteration):
                    callback = StopIteration

                if callback is StopIteration:
                    break

        self.on_after_execute()

        self.component_state.executed = True
        self.component_state.save(self)

        return status

    def destroy(self):
        """Destroys the components

        Triggers destroy events

        ::: tip
        This method is triggered automatically.
        :::
        """
        self.on_before_destroy()

        self.events.heartbeats(None)

        if self.components and len(self.components) > 0:
            for component in self.components:
                if (
                    component.component_state.created
                    and not component.component_state.destroyed
                ):
                    component.destroy()

        self.on_destroy()

        self.component_state.destroyed = True
        self.component_state.save(self)

        # write finished status (not triggered in the case of an unhandled exception)
        self.component_status["finished_at"] = str(arrow.now())
        self.refresh_status(log_errors=True)

        self.on_after_destroy()

    def refresh_status(self, log_errors=False):
        """Updates the status.json file with a heartbeat at the current time"""
        if not self.storage:
            return False

        try:
            self.component_status["heartbeat_at"] = str(arrow.now())
            self.storage.save_file("status.json", self.component_status)
        except (OSError, Exception) as ex:
            if log_errors:
                self.log.error(
                    f"Could not write status information. {exception_to_str(ex)}"
                )

            return ex

        return True

    def set_seed(self, seed=None) -> bool:
        """Applies a global random seed

        # Arguments
        seed: Integer, random seed. If None, self.flags.SEED will be used

        To prevent the automatic seeding, you can overwrite
        the on_seeding event and return False
        """
        if seed is None:
            seed = self.flags.get("SEED")

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
            timestep: int = len(self.component_state.checkpoints)

        if path is None:
            if not self.storage:
                raise ValueError("You need to specify a checkpoint path")

            fs_prefix, basepath = self.storage.config["url"].split("://")
            if fs_prefix != "osfs":
                # todo: support non-local filesystems via automatic sync
                raise NotImplementedError(
                    "Checkpointing to non-os file systems is currently not supported."
                )
            checkpoint_path = self.storage.get_path("checkpoints", create=True)
            path = os.path.join(os.path.expanduser(basepath), checkpoint_path)

        checkpoint = self.on_save(path, timestep)

        self.component_state.checkpoints.append(
            {"timestep": timestep, "path": path, "checkpoint": checkpoint}
        )
        self.component_state.save(self)

        return checkpoint

    def restore_checkpoint(self, checkpoint):
        """Restores a checkpoint

        # Arguments
        filepath: Checkpoint filepath
        """
        if self.storage is not None:
            self.log.info(f"Restoring checkpoint `{checkpoint}`")
        return self.on_restore(checkpoint)

    # life cycle

    def on_start(self):
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
        """Lifecycle event triggered during components creation

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
        pass

    def on_save(self, checkpoint_path: str, timestep: int) -> Union[bool, str]:
        """Implements the checkpoint functionality of the components

        # Arguments
        checkpoint_path: String, target directory
        timestep: Integer, counting number of checkpoint

        # Returns
        Returns the name of the checkpoint file or path. Return False to indicate that checkpoint has not been saved.
        """
        pass

    def on_restore(self, checkpoint):
        """Implements the restore checkpoint functionality of the components

        # Arguments
        checkpoint: Checkpoint specification
        timestep: Integer, counting number of checkpoint

        # Returns
        Return False to indicate that checkpoint has not been restored.
        """
        pass

    def on_init_components(
        self, components_config, index: Optional[int] = None
    ):
        """Lifecycle event triggered during components initialisation

        Return False to prevent the components instantiation"""
        pass

    def on_after_init_components(self, components, index: Optional[int] = None):
        """Lifecycle event triggered after components initialisation"""
        pass

    def on_init_storage(self, storage_config: dict):
        """Lifecycle event triggered at write initialisation"""
        pass

    def on_after_init_storage(self, storage_config: dict):
        """Lifecycle event triggered when storage is available"""

    def on_after_create(self):
        """Lifecycle event triggered after components creation"""
        pass

    def on_before_execute(self):
        """Lifecycle event triggered before components execution"""
        pass

    def on_execute(self):
        """Lifecycle event triggered at components execution

        ::: tip
        This event and all other execution events are triggered in node components only
        :::
        """
        pass

    def on_before_execute_iteration(self, iteration: int):
        """Lifecycle event triggered before an execution iteration"""
        pass

    def on_execute_iteration(self, iteration: int):
        """Lifecycle event triggered at execution iteration

        Allows to implement repeating iterations

        The method is repeatedly called until StopIteration is returned or raised; iteration is increased on each call
        The iteration number is also available class-wide under self.flags.ITERATION

        # Arguments
        iteration: Integer, iteration number that automatically increases in every iteration starting from 0
        """
        pass

    # disable unless overridden
    on_execute_iteration._deactivated = True

    def on_after_execute_iteration(self, iteration: int):
        """Lifecycle event triggered after execution iteration"""
        pass

    def on_after_execute(self):
        """Lifecycle event triggered after execution"""
        pass

    def on_before_destroy(self):
        """Lifecycle event triggered before components destruction"""
        pass

    def on_destroy(self):
        """Lifecycle event triggered at components destruction"""
        pass

    def on_after_destroy(self):
        """Lifecycle event triggered after components destruction"""
        pass

    def on_finish(self, result, success):
        """Lifecycle event triggered right before the end of the component execution

        # Arguments
        success: Whether the execution finished sucessfully
        """

    def on_success(self, result):
        """Lifecycle event triggered iff execution finishes successfully

        # Arguments
        result: Return value of on_execute event
        """

    def on_failure(self, result):
        """Lifecycle event triggered iff execution finished with an exception

        # Arguments
        result: Execution exception
        """
