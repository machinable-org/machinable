from typing import Dict, Union
import copy
import os
import inspect
import traceback
from inspect import getattr_static
from typing import Optional, List
import datetime
from collections import OrderedDict

from ..observer import Observer
from ..observer.record import Record
from ..observer.log import Log
from ..config import bind_config_methods, parse_mixins
from ..config.mapping import ConfigMap, config_map
from ..config.parser import ModuleClass
from ..utils.utils import apply_seed
from ..utils.dicts import update_dict
from .exceptions import ExecutionException


def set_alias(obj, alias, value):
    if isinstance(alias, str) and not hasattr(obj, alias):
        setattr(obj, alias, value)


def inject_components(component, children, on_create):
    signature = inspect.signature(on_create)

    if children is None:
        children = []

    # default: if there are no given parameters, create each child and assign suggested attribute_
    if len(signature.parameters) == 0:
        for index, child in enumerate(children):
            if not child._component_state.created:
                child.create()
            set_alias(component, child.attribute_, child)
            component.flags.CHILD_ALIAS[child.attribute_] = index

        if component.node is not None:
            set_alias(component, component.node.attribute_, component.node)

        on_create()

        return True

    # user defined
    payload = OrderedDict()
    for index, (key, parameter) in enumerate(signature.parameters.items()):
        if parameter.kind is not parameter.POSITIONAL_OR_KEYWORD:
            # ignore *args and **kwargs
            raise TypeError(f'on_create only allows simple positional or keyword arguments')

        if index == 0 and key != 'node':
            raise TypeError(f"First argument of on_create has to be 'node', received '{key}' instead.")

        if key == 'node':
            payload['node'] = component.node
        else:
            try:
                child = children[index - 1]
                alias = parameter.name
                if not parameter.name.startswith('_'):
                    child.create()
                    alias = parameter.name[1:]
                payload[parameter.name] = child
                component.flags.CHILD_ALIAS[alias] = index - 1
            except IndexError:
                if parameter.default is parameter.empty:
                    raise TypeError(f"Component {component.__class__.__name__}.on_create requires a component "
                                    f"'{parameter.name}' but only {len(children)} were provided.")

                payload[parameter.name] = parameter.default

    on_create(**payload)

    return True


class ComponentState:

    def __init__(self):
        self.checkpoint_counter = 0
        self.created = False
        self.executed = False
        self.destroyed = False


class MixinInstance:

    def __init__(self, controller, mixin_class, attribute):
        self.config = {
            'controller': controller,
            'class': mixin_class,
            'attribute': attribute
        }

    def __getattr__(self, item):
        # lazy-load class
        if isinstance(self.config['class'], ModuleClass):
            self.config['class'] = self.config['class'].load(instantiate=False)

        attribute = getattr(self.config['class'], item, None)

        if attribute is None:
            raise AttributeError(f"Mixin '{self.config['class'].__name__}' has no method '{item}'")

        if isinstance(attribute, property):
            return attribute.fget(self.config['controller'])

        if not callable(attribute):
            return attribute

        if isinstance(getattr_static(self.config['class'], item), staticmethod):
            return attribute

        # if attribute is non-static method we decorate it to pass in the controller

        def bound_method(*args, **kwargs):
            # bind mixin instance to controller for mixin self reference
            self.config['controller'].__mixin__ = getattr(self.config['controller'], self.config['attribute'])
            output = attribute(self.config['controller'], *args, **kwargs)

            return output

        return bound_method


class Mixin:
    """
    Mixin base class. All machinable mixins must inherit from this base class.
    """

    pass


class Component(Mixin):
    """
    Component base class. All machinable components must inherit from this class.

    ::: tip
    All components are Mixins by default. However, if you want to explicitly mark your component for Mixin-only use
    consider inheriting from the Mixin base class ``machinable.Mixin``.
    :::
    """

    attribute_ = None

    def __init__(self, config: dict = None, flags: dict = None, node=None):
        """Constructs the component instance.

        The initialisation and its events are side-effect free, meaning the application state is preserved
        as if no execution would have happened.
        """
        self.on_before_init(config, flags, node)

        self._node: Optional[Component] = node
        self._children: Optional[List[Component]] = None
        self._observer: Optional[Observer] = None
        self._actor_config = None
        self.__mixin__ = None
        self._component_state = ComponentState()

        if self.on_init(config, flags, node) is False:
            return

        if config is None:
            config = {}

        # we assign the raw config to allow config_methods to access it
        self._config: ConfigMap = config_map(config)

        # resolve config methods
        self._config: ConfigMap = bind_config_methods(self, config)
        self._config: ConfigMap = ConfigMap(self.config, _dynamic=False, _evaluate=self.config.get('_evaluate', True))

        self._flags: ConfigMap = config_map(update_dict({'TUNING': False, 'CHILD_ALIAS': {}}, flags))

        # bind mixins
        for mixin in parse_mixins(self.config.get('_mixins_'), valid_only=True):
            self.bind(mixin.get('origin', mixin['name']), mixin['attribute'])

        self.on_after_init()

    def bind(self, mixin, attribute):
        """Binds a mixin to the component

        # Arguments
        mixin: Mixin module or class
        attribute: Attribute name, e.g. _my_mixin_
        """
        if isinstance(mixin, str):
            mixin = ModuleClass(mixin.replace('+.', 'vendor.'), baseclass=Mixin)
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
    def node(self) -> Optional['Component']:
        """Node component or None"""
        return self._node

    @node.setter
    def node(self, value):
        self._node = value

    @property
    def children(self) -> Optional[List['Component']]:
        """List of child components or None"""
        return self._children

    @children.setter
    def children(self, value):
        self._children = value

    @property
    def observer(self) -> Observer:
        if self._observer is None and isinstance(self.node, Component):
            # forward to node observer if available
            return self.node.observer

        """Observer instance"""
        return self._observer

    @observer.setter
    def observer(self, value):
        self._observer = value

    @property
    def record(self) -> Record:
        """Record writer instance"""
        return self.observer.record

    @property
    def log(self) -> Log:
        """Log writer instance"""
        return self.observer.log

    def __getattr__(self, name):
        # Mixins and dynamic attributes are set during construction; this helps suppressing IDE warnings
        raise AttributeError(f'{self.__class__.__name__} component has not attribute {name}')

    def dispatch(self, children_config: List[Dict], observer_config: dict, actor_config=None, lifecycle=True):
        # Prepares and dispatches the component lifecycle and returns its result
        try:
            self._actor_config = actor_config

            if self.node is None and self.on_seeding() is not False:
                self.set_seed()

            if self.on_init_observer(observer_config) is not False:
                observer = Observer(config=observer_config)
                self.on_after_init_observer(observer)
            else:
                observer = None

            if self.on_init_children(children_config) is not False:
                children = []
                index = 0
                for child_config in children_config:
                    if self.on_init_child(child_config, index) is not False:
                        children.append(child_config['class'](
                            config=copy.deepcopy(child_config['args']),
                            flags=copy.deepcopy(child_config['flags']),
                            node=self
                        ))
                        self.on_after_init_child(children[-1], index)
                        index += 1

                self.on_after_init_children(children)
            else:
                children = None

            if not lifecycle:
                return children, observer

            self.create(children, observer)
            status = self.execute()
            self.destroy()
        except (KeyboardInterrupt, SystemExit):
            status = ExecutionException(reason='user_interrupt',
                                        message='The component execution has been interrupted by the user or system.')
        except BaseException as ex:
            trace = ''.join(traceback.format_exception(etype=type(ex), value=ex, tb=ex.__traceback__))
            status = ExecutionException(reason='exception',
                                        message=f"The following exception occurred: {ex}\n{trace}")

        return status

    def create(self, children=None, observer=None):
        """Creates the component

        ::: tip
        This method is triggered automatically. However, child component creation can be suppressed in the on_create
        event of the node component. See [on_create](#on_create) for details.
        :::

        Triggers create events of the lifecycle and restores the component from provided checkpoint if any

        # Arguments
        children: Optional list of child component instances that are used by the component
        observer: Optional observer instance to be used by the component
        """
        self.on_before_create()

        if observer is not None:
            self.observer = observer

        if children is not None:
            self.children = children

        # prepare child components and invoke on_create event
        inject_components(self, self.children, self.on_create)

        checkpoint = self.flags.get('CHECKPOINT', False)
        if checkpoint:
            self.restore_checkpoint(checkpoint)

        self.on_after_create()

        self._component_state.created = True

    def execute(self):
        """Executes the component

        Triggers execution events and writes execution meta-data

        ::: tip
        Execution is triggered automatically for node components only.
        :::
        """
        self.on_before_execute()

        if self.observer:
            self.observer.statistics['on_execute_start'] = datetime.datetime.now()
            self.observer.refresh_meta_data(
                node=self.config.toDict(evaluate=True, with_hidden=False),
                children=[
                    child.config.toDict(evaluate=True, with_hidden=False) for child in self.children
                ] if self.children else [],
                flags={
                    'node': self.flags.toDict(evaluate=True),
                    'children': [child.flags.toDict(evaluate=True) for child in self.children] if self.children else []
                }
            )

        try:
            status = self.on_execute()
        except (KeyboardInterrupt, StopIteration) as e:
            status = e

        # if on_iterate is not overwritten ...
        if hasattr(self.on_execute_iteration, '_deactivated') or self.flags.get('TUNING', False):
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
                    if self.on_after_execute_iteration(iteration) is not False:
                        # trigger records.save() automatically
                        if self.observer and self.observer.has_records() and not self.observer.record.empty():
                            self.observer.record['_iteration'] = iteration
                            self.observer.record.save()
                except (KeyboardInterrupt, StopIteration):
                    callback = StopIteration

                if callback is StopIteration:
                    break

        self.on_after_execute()

        self._component_state.executed = True

        return status

    def destroy(self):
        """Destroys the component

        Triggers destroy events

        ::: tip
        This method is triggered automatically.
        :::
        """
        self.on_before_destroy()

        if self.children and len(self.children) > 0:
            for child in self.children:
                if child._component_state.created and not child._component_state.destroyed:
                    child.destroy()

        self.on_destroy()

        if self.observer:
            self.observer.destroy()

        self.on_after_destroy()

        self._component_state.destroyed = True

    def set_seed(self, seed=None) -> bool:
        """Applies a global random seed

        # Arguments
        seed: Integer, random seed. If None, self.flags.SEED will be used

        To prevent the automatic seeding, you can overwrite
        the on_seeding event and return False
        """
        if seed is None:
            seed = self.flags.get('SEED')

        return apply_seed(seed)

    def save_checkpoint(self, path: str = None, timestep=None) -> Union[bool, str]:
        """Saves component to a checkpoint

        # Arguments
        path: Path where checkpoints should be saved
        timestep: Optional timestep of checkpoint. If None, timestep will count up automatically

        # Returns
        Filepath of the saved checkpoint or False if checkpoint has not been saved
        """
        if timestep is None:
            timestep: int = self._component_state.checkpoint_counter

        if path is None:
            if not self.node.observer:
                raise ValueError('You need to specify a checkpoint path')

            fs_prefix, basepath = self.node.observer.config['storage'].split('://')
            if fs_prefix != 'osfs':
                # todo: support non-local filesystems via automatic sync
                raise NotImplementedError('Checkpointing to non-os file systems is currently not supported.')
            checkpoint_path = self.node.observer.get_path('checkpoints', create=True)
            path = os.path.join(os.path.expanduser(basepath), checkpoint_path)

        checkpoint = self.on_save(path, timestep)

        if checkpoint is not False:
            self._component_state.checkpoint_counter += 1

        return checkpoint

    def restore_checkpoint(self, filepath=None):
        """Restores a checkpoint

        # Arguments
        filepath: Checkpoint filepath
        """
        if self.observer is not None:
            self.observer.log.info(f"Restoring checkpoint {filepath}")
        return self.on_restore(filepath)

    # life cycle

    def on_seeding(self):
        """Lifecycle event to implement custom seeding

        Return False to prevent the default seeding procedure
        """
        pass

    def on_before_init(self, config=None, flags=None, node=None):
        """Lifecycle event triggered before component initialisation"""
        pass

    def on_init(self, config=None, flags=None, node=None):
        """Lifecycle event triggered during component initialisation

        Return False to prevent the default configuration and flag instantiation
        """
        pass

    def on_after_init(self):
        """Lifecycle event triggered after component initialisation"""
        pass

    def on_before_create(self):
        """Lifecycle event triggered before component creation"""
        pass

    def on_create(self):
        """Lifecycle event triggered during component creation

        The method can declare arguments to handle components explicitly. For example, the signature
        ``on_create(self, node, alias_of_child_1, alias_of_child_2=None)`` declares that component
        accepts two child components with alias ``alias_of_child_1`` and ``alias_of_child_2`` where
        the latter is declared optional. If the alias starts with an underscore ``_`` the component lifecycle
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
        """Implements the checkpoint functionality of the component

        # Arguments
        checkpoint_path: String, target directory
        timestep: Integer, counting number of checkpoint

        # Returns
        Returns the name of the checkpoint file or path. Return False to indicate that checkpoint has not been saved.
        """
        pass

    def on_restore(self, checkpoint_file: str):
        """Implements the restore checkpoint functionality of the component

        # Arguments
        checkpoint_path: String, source directory
        timestep: Integer, counting number of checkpoint

        # Returns
        Return False to indicate that checkpoint has not been restored.
        """
        pass

    def on_init_children(self, children_config: List[Dict]):
        """Lifecycle event triggered at child component initialisation

        Return False to prevent the children instantiation
        """
        pass

    def on_init_child(self, child_config: Dict, index: int):
        """Lifecycle event triggered during child component initialisation

        Return False to prevent the child instantiation"""
        pass

    def on_after_init_children(self, children: List):
        """Lifecycle event triggered after child component initialisation"""
        pass

    def on_after_init_child(self, child, index: int):
        """Lifecycle event triggered after child component initialisation"""
        pass

    def on_init_observer(self, observer_config: Dict):
        """Lifecycle event triggered at observer initialisation

        Return False to prevent the default observer instantiation
        """
        pass

    def on_after_init_observer(self, observer: Observer):
        """Lifecycle event triggered after observer initialisation"""
        pass

    def on_after_create(self):
        """Lifecycle event triggered after component creation"""
        pass

    def on_before_execute(self):
        """Lifecycle event triggered before component execution"""
        pass

    def on_execute(self):
        """Lifecycle event triggered at component execution

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
        """Lifecycle event triggered before component destruction"""
        pass

    def on_destroy(self):
        """Lifecycle event triggered at component destruction"""
        pass

    def on_after_destroy(self):
        """Lifecycle event triggered after component destruction"""
        pass
