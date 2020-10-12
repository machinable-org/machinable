import copy
import inspect
import os
import re
from collections import OrderedDict
from typing import Dict, List, Optional, Union

import pendulum

from ..config.mapping import ConfigMap, ConfigMethod, config_map
from ..config.parser import parse_mixins
from ..registration import Registration
from ..storage import Storage
from ..storage.log import Log
from ..storage.record import Record
from ..utils.dicts import update_dict
from ..utils.formatting import exception_to_str
from ..utils.host import get_host_info
from ..utils.importing import ModuleClass
from ..utils.system import OutputRedirection, set_process_title
from ..utils.traits import Jsonable
from ..utils.utils import apply_seed
from .events import Events
from .exceptions import ExecutionException
from .mixin import Mixin, MixinInstance


def set_alias(obj, alias, value):
    if isinstance(alias, str) and not hasattr(obj, alias):
        setattr(obj, alias, value)


def inject_components(component, components, on_create):
    signature = inspect.signature(on_create)

    if components is None:
        components = []

    # default: if there are no given parameters, create each component and assign suggested attribute_
    if len(signature.parameters) == 0:
        for index, c in enumerate(components):
            if not c.component_state.created:
                c.create()
            set_alias(component, c.attribute_, c)
            component.flags.COMPONENTS_ALIAS[c.attribute_] = index

        if component.node is not None:
            set_alias(component, component.node.attribute_, component.node)

        on_create()

        return True

    # user defined
    payload = OrderedDict()
    for index, (key, parameter) in enumerate(signature.parameters.items()):
        if parameter.kind is not parameter.POSITIONAL_OR_KEYWORD:
            # ignore *args and **kwargs
            raise TypeError(
                f"on_create only allows simple positional or keyword arguments"
            )

        try:
            c = components[index]
            alias = parameter.name
            if not parameter.name.startswith("_"):
                c.create()
                alias = parameter.name[1:]
            payload[parameter.name] = c
            component.flags.COMPONENTS_ALIAS[alias] = index
        except IndexError:
            if parameter.default is parameter.empty:
                raise TypeError(
                    f"Component {component.__class__.__name__}.on_create requires "
                    f"a component argument '{parameter.name}'. Please specify the "
                    f"component in Experiment.components()."
                )

            payload[parameter.name] = parameter.default

    on_create(**payload)

    return True


def bind_config_methods(obj, config):
    if isinstance(config, list):
        return [bind_config_methods(obj, v) for v in config]

    if isinstance(config, tuple):
        return (bind_config_methods(obj, v) for v in config)

    if isinstance(config, dict):
        for k, v in config.items():
            if k == "_mixins_":
                continue
            config[k] = bind_config_methods(obj, v)
        return config

    if isinstance(config, str):
        # config method
        fn_match = re.match(r"(?P<method>\w+)\s?\((?P<args>.*)\)", config)
        if fn_match is not None:
            definition = config
            method = "config_" + fn_match.groupdict()["method"]
            args = fn_match.groupdict()["args"]

            # local config method
            if getattr(obj, method, False) is not False:
                return ConfigMethod(obj, method, args, definition)

            # global config method
            registration = Registration.get()
            if getattr(registration, method, False) is not False:
                return ConfigMethod(registration, method, args, definition)

            raise AttributeError(
                f"Config method {definition} specified but {type(obj).__name__}.{method}() does not exist."
            )

    return config


class ComponentState(Jsonable):
    def __init__(
        self, created=False, executed=False, destroyed=False, checkpoints=None
    ):
        self.created = created
        self.executed = executed
        self.destroyed = destroyed
        self.checkpoints = checkpoints or []

    def serialize(self):
        return {
            "created": self.created,
            "executed": self.executed,
            "destroyed": self.destroyed,
            "checkpoints": self.checkpoints,
        }

    @classmethod
    def unserialize(cls, serialized):
        return cls(**serialized)

    @staticmethod
    def save(component):
        if component.node is not None or component.storage is None:
            return False
        component.storage.save_file(
            "state.json",
            {
                "component": component.component_state.serialize(),
                "components": [
                    c.component_state.serialize() for c in component.components
                ]
                if component.components is not None
                else None,
            },
            overwrite=True,
        )


class Component(Mixin):
    """
    Component base class. All machinable components must inherit from this class.

    ::: tip
    All components are Mixins by default. However, if you want to explicitly mark your components for Mixin-only use
    consider inheriting from the Mixin base class ``machinable.Mixin``.
    :::
    """

    attribute_ = None

    def __init__(self, config: dict = None, flags: dict = None, node=None):
        """Constructs the components instance.

        The initialisation and its events ought to be side-effect free, meaning the application state is preserved
        as if no execution would have happened.
        """
        on_before_init = self.on_before_init(config, flags, node)
        if isinstance(on_before_init, tuple):
            config, flags, node = on_before_init

        self._node: Optional[Component] = node
        self._components: Optional[List[Component]] = None
        self._storage: Optional[Storage] = None
        self._events: Events = Events()
        self._actor_config = None
        self.__mixin__ = None
        self.component_status = dict()
        self.component_state = ComponentState()

        on_init = self.on_init(config, flags, node)
        if on_init is False:
            return
        if isinstance(on_init, tuple):
            config, flags, node = on_init

        if config is None:
            config = {}

        # we assign the raw config to allow config_methods to access it
        self._config: ConfigMap = config_map(config)

        # resolve config methods
        self._config: ConfigMap = bind_config_methods(self, config)
        self._config: ConfigMap = ConfigMap(
            self.config, _dynamic=False, _evaluate=self.config.get("_evaluate", True)
        )

        self._flags: ConfigMap = config_map(
            update_dict({"TUNING": False, "COMPONENTS_ALIAS": {}}, flags)
        )

        # bind mixins
        for mixin in parse_mixins(self.config.get("_mixins_"), valid_only=True):
            self.bind(mixin.get("origin", mixin["name"]), mixin["attribute"])

        self.on_after_init()

    def bind(self, mixin, attribute):
        """Binds a mixin to the component

        # Arguments
        mixin: Mixin module or class
        attribute: Attribute name, e.g. _my_mixin_
        """
        if isinstance(mixin, str):
            mixin = ModuleClass(mixin.replace("+.", "vendor."), baseclass=Mixin)
        setattr(self, attribute, MixinInstance(self, mixin, attribute))

    @property
    def config(self) -> ConfigMap:
        """Component configuration"""
        return self._config

    @property
    def flags(self) -> ConfigMap:
        """Component flags"""
        return self._flags

    @property
    def node(self) -> Optional["Component"]:
        """Node component or None"""
        return self._node

    @node.setter
    def node(self, value):
        self._node = value

    @property
    def components(self) -> Optional[List["Component"]]:
        """List of sub components or None"""
        return self._components

    @components.setter
    def components(self, value):
        self._components = value

    @property
    def storage(self):
        if self._storage is None and isinstance(self.node, Component):
            # forward to node store if available
            return self.node.storage
        return self._storage

    @storage.setter
    def storage(self, value):
        self._storage = value

    @property
    def record(self) -> Record:
        """Record writer instance"""
        return self.storage.get_records(
            "default",
            events=self.events,
            created_at=self.component_status["started_at"],
        )

    @property
    def log(self) -> Log:
        """Log writer instance"""
        return self.storage.log

    @property
    def events(self) -> Events:
        return self._events

    def __getattr__(self, name):
        # Mixins and dynamic attributes are set during construction; this helps suppressing IDE warnings
        raise AttributeError(
            f"{self.__class__.__name__} component has not attribute {name}"
        )

    def dispatch(
        self,
        components_config: List[Dict],
        storage_config: dict,
        actor_config=None,
        lifecycle=True,
    ):
        # Prepares and dispatches the components lifecycle and returns its result
        try:
            self._actor_config = actor_config

            if self.node is None and self.on_seeding() is not False:
                self.set_seed()

            self.on_init_storage(storage_config)

            self.storage = Storage.create(storage_config)

            self.component_status["started_at"] = str(pendulum.now())
            self.component_status["finished_at"] = False
            self.refresh_status(log_errors=True)

            if not storage_config["url"].startswith("mem://"):
                OutputRedirection.apply(
                    self.flags["OUTPUT_REDIRECTION"],
                    self.storage.get_stream,
                    "output.log",
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
                    if self.on_init_components(component_config, index) is not False:
                        components.append(
                            component_config["class"](
                                config=copy.deepcopy(component_config["args"]),
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
        except (KeyboardInterrupt, SystemExit):
            status = ExecutionException(
                reason="user_interrupt",
                message="The components execution has been interrupted by the user or system.",
            )
        except BaseException as ex:
            status = ExecutionException(
                reason="exception",
                message=f"The following exception occurred: {ex}\n{exception_to_str(ex)}",
            )

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
        self.component_status["finished_at"] = str(pendulum.now())
        self.refresh_status(log_errors=True)

        OutputRedirection.revert()

        self.on_after_destroy()

    def refresh_status(self, log_errors=False):
        """Updates the status.json file with a heartbeat at the current time
        """
        try:
            self.component_status["heartbeat_at"] = str(pendulum.now())
            self.storage.save_file("status.json", self.component_status)
        except (IOError, Exception) as ex:
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

    def save_checkpoint(self, path: str = None, timestep=None) -> Union[bool, str]:
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

    def serialize(self):
        return {
            "config": self.config.toDict(evaluate=True, with_hidden=False),
            "flags": self.flags.toDict(evaluate=True),
        }

    # life cycle

    def on_seeding(self):
        """Lifecycle event to implement custom seeding

        Return False to prevent the default seeding procedure
        """
        pass

    def on_before_init(self, config=None, flags=None, node=None):
        """Lifecycle event triggered before components initialisation"""
        pass

    def on_init(self, config=None, flags=None, node=None):
        """Lifecycle event triggered during components initialisation

        Return False to prevent the default configuration and flag instantiation
        """
        pass

    def on_after_init(self):
        """Lifecycle event triggered after components initialisation"""
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

    def on_init_components(self, components_config, index: Optional[int] = None):
        """Lifecycle event triggered during components initialisation

        Return False to prevent the components instantiation"""
        pass

    def on_after_init_components(self, components, index: Optional[int] = None):
        """Lifecycle event triggered after components initialisation"""
        pass

    def on_init_storage(self, storage_config: Dict):
        """Lifecycle event triggered at write initialisation
        """
        pass

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
        """Lifecycle event triggered before an execution iteration
        """
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

    def __repr__(self):
        if isinstance(self.node, Component):
            return "Sub" + repr(self.node)

        flags = getattr(self, "flags", {})
        r = f"Component <{flags.get('EXPERIMENT_ID', '-')}:{flags.get('UID', '-')}>"
        if self.storage is not None:
            r += f" ({self.storage.get_url()})"
        return r

    def __str__(self):
        return self.__repr__()


class FunctionalComponent:
    def __init__(self, function, node_config=None, node_flags=None):
        self.function = function
        self.node = {"config": None, "flags": None}
        self.set_config(node_config, node_flags)
        self._argument_structure = OrderedDict()

    def __call__(self, config=None, flags=None):
        # virtual constructor
        self.set_config(config, flags)
        return self

    def set_config(self, config, flags):
        if config is None:
            config = {}
        if flags is None:
            flags = {}
        self.node["config"] = copy.deepcopy(config)
        self.node["flags"] = copy.deepcopy(flags)

    def dispatch(self, components_config, storage_config, actor_config=None):
        apply_seed(self.node["flags"].get("SEED"))
        self.node["flags"]["ACTOR"] = actor_config
        components = [
            {"config": copy.deepcopy(c["args"]), "flags": copy.deepcopy(c["flags"]),}
            for c in components_config
        ]

        # analyse argument structure
        signature = inspect.signature(self.function)
        payload = OrderedDict()

        for index, (key, parameter) in enumerate(signature.parameters.items()):
            if parameter.kind is not parameter.POSITIONAL_OR_KEYWORD:
                # disallow *args and **kwargs
                raise TypeError(
                    f"Component only allows simple positional or keyword arguments,"
                    f"for example my_component(component, components, store)"
                )

            if key == "component":
                payload["component"] = config_map(self.node)
            elif key == "components":
                payload["components"] = [
                    config_map(component) for component in components
                ]
            elif key == "storage" or key == "_storage":
                if key == "_storage":
                    payload["storage"] = storage_config
                else:
                    storage = Storage.create(storage_config)
                    storage.save_file("host.json", get_host_info())
                    storage.save_file(
                        "component.json",
                        {"config": self.node["config"], "flags": self.node["flags"]},
                    )
                    storage.save_file(
                        "components.json",
                        [
                            {"config": c["config"], "flags": c["flags"]}
                            for c in components
                        ],
                    )
                    payload["storage"] = storage
            else:
                raise ValueError(
                    f"Unrecognized argument: '{key}'. "
                    f"Components take the following arguments: "
                    f"'component', 'components' and 'store'"
                )

        try:
            return self.function(**payload)
        except (KeyboardInterrupt, SystemExit):
            status = ExecutionException(
                reason="user_interrupt",
                message="The components execution has been interrupted by the user or system.",
            )
        except BaseException as ex:
            status = ExecutionException(
                reason="exception",
                message=f"The following exception occurred: {ex}\n{exception_to_str(ex)}",
            )

        return status
