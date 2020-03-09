from typing import Union, Type, Tuple
import copy
from collections import OrderedDict


class TaskComponent:

    def __init__(self, name, version=None, checkpoint=None, flags=None):
        """Task component

        # Arguments
        name: String, the name of the component as defined in the machinable.yaml
        version: dict|String, a configuration update to override its default config
        checkpoint: String, optional URL to a checkpoint file from which the component will be restored

        # Examples
        ```python
        component = TaskComponent('models.linear_regression', {'alpha': 0.1})
        ```
        """
        self.name = name
        self.version = version
        self.checkpoint = checkpoint
        if flags is None:
            flags = {}
        if isinstance(checkpoint, str):
            flags['CHECKPOINT'] = checkpoint
        self.flags = flags

    @classmethod
    def create(cls, args: Union[Type, str, Tuple]):
        """Creates a component from arguments

        # Returns
        machinable.Component
        """
        if isinstance(args, cls):
            return args

        if args is None:
            return cls(name=None)

        if isinstance(args, str):
            return cls(name=args)

        if isinstance(args, tuple):
            return cls(*args)

        raise ValueError(f'Invalid arguments: {args}')

    def unpack(self):
        if isinstance(self.version, list):
            return [__class__(self.name, v, self.checkpoint) for v in self.version]

        return self

    def __str__(self):
        if self.name is None:
            return 'None'

        return f'Component({self.name})'

    def __repr__(self):
        if self.name is None:
            return 'machinable.C(None)'

        return f'machinable.C(name={self.name}, version={self.version}, flags={self.flags}'


class Task:
    """Defines an execution schedule for available components. The task interface is fluent,
    methods can be chained in arbitrary order.

    # Arguments
    component: Optional String or ``tuple`` component definition to add to the task

    # Example
    ```python
    import machinable as ml
    linear_regression = ml.Task().component('mnist').repeat(3)
    # or using the shorthand where component arguments are passed into the constructor
    linear_regression = ml.Task('mnist').repeat(3)
    ```
    """

    def __init__(self, component=None):
        self._cache = None
        self._specs = OrderedDict()

        if isinstance(component, str):
            self.component(component)
        elif isinstance(component, tuple):
            self.component(*component)

    @classmethod
    def create(cls, args):
        """Creates a task instance"""
        if isinstance(args, cls):
            return args

        if args is None:
            return cls()

        if isinstance(args, str):
            return cls().component(args)

        if isinstance(args, tuple):
            return cls().component(*args)

    def _spec(self, field, arguments, multiple=False, **kwargs):
        self._cache = None

        if 'self' in arguments:
            del arguments['self']
        value = dict({
            'field': field,
            'arguments': arguments,
            'multiple': multiple
        }, **kwargs)
        if multiple:
            if field not in self._specs:
                self._specs[field] = []
            value['id'] = len(self._specs[field])
            self._specs[field].append(value)
        else:
            self._specs[field] = value

        return self

    @property
    def specification(self):
        if self._cache is not None:
            return self._cache

        # auto-complete
        spec = self._specs.copy()
        spec.setdefault('name', None)
        spec.setdefault('nodes', [])
        spec.setdefault('repeats', [])
        spec.setdefault('version', [])

        self._cache = spec

        return spec

    @specification.setter
    def specification(self, specs):
        self._cache = None
        self._specs = specs

    # fluent interface

    def copy(self):
        """Returns a copy of the current task object
        """
        task = __class__()
        task.specification = self.specification.copy()
        return task

    def name(self, name):
        """Specifies a name of the current task that may help to manage its results later

        # Arguments
        name: String, the name of the task
        """
        self._specs['name'] = name
        return self

    def component(self, node, children=None, resources=None):
        """Adds a component to the task

        # Arguments
        node: machinable.TaskComponent specifying the node component
        children: optional list of machinable.Component, supplementary components for this node
        resources: dict, specifies the [Ray](http://ray.readthedocs.io/) resources that are available to the
            actor if used. Has no effect in local execution mode.

        # Examples
        ```python
        import machinable as ml
        task = ml.Task().component(('mnist', version='~shuffled', resources={'num_gpus': 2}))
        ```
        """
        component = TaskComponent.create(node).unpack()

        if isinstance(component, list):
            for comp in component:
                self.component(comp, children, resources)
            return self

        if not isinstance(children, list):
            children = [children]

        for i, child in enumerate(children):
            unpacked_children = TaskComponent.create(child).unpack()
            if isinstance(unpacked_children, list):
                # cross-product with all other children
                for unpacked_child in unpacked_children:
                    reduced = [children[before] for before in range(i)] \
                               + [unpacked_child] \
                               + [children[after] for after in range(i+1, len(children))]
                    self.component(component, reduced, resources)
                return self

        return self._spec('nodes',
                          {'component': component, 'children': children, 'resources': resources},
                          multiple=True)

    def version(self, config=None, **kwargs):
        """Applies a configuration update

        Selected components use the default configuration as specified in the machinable.yaml.
        Versioning allows for configuration overrides using dictionaries or defined version patterns.
        The versions here are applied globally to all components in this task. If you
        want to apply the version locally, use the version parameter in the local method.

        # Arguments
        config: Configuration update represented as dictionary

        # Examples
        ```python
        import machinable as ml
        task = ml.Task().component('evolution').component('sgd')
        # use a dictionary to override configuration values
        task.version({'data': {'shuffle': True}, 'children': {'lr': 0.01}})
        # or kwargs
        task.version(data={'shuffle': True}, children={'lr': 0.01})
        # use a specified version of the machinable.yaml
        task.version(data='~shuffled')
        # use a mixin configuration
        task.version(data='_mnist_')
        ```
        """
        if config is None:
            config_version = copy.deepcopy(kwargs)
        else:
            if isinstance(config, dict):
                config_version = copy.deepcopy(config)
            else:
                config_version = {
                    'component': copy.deepcopy(config)
                }

        self._spec('version', config_version, multiple=True)

        return self

    # proliferation

    def repeat(self, k, name='REPEAT', mode='independent'):
        """Repeats the task k times

        Schedules the current task multiple times and injects the flags REPEAT_NUMBER and REPEAT_SEED to the
        node instances.

        # Arguments
        k: Integer, the number of repetitions
        name: String, flag prefix, e.g. '{name}_SEED' etc. Defaults to REPEAT

        # Examples
        ```python
        import machinable as ml
        # five independent runs of the same node
        ml.Task().component('regression').repeat(5)
        ```
        """
        return self._spec('repeats', locals(), multiple=True)

    def split(self, k, name='SPLIT', mode='independent'):
        """Splits the task k times

        Schedules the current task k times and injects appropriate flags SPLIT_NUMBER and SPLIT_SEED to the
        node instances. Note that machinable does not split the nodes automatically. The user
        has to implement the algorithmic splitting based on the flag information. For example, to implement
        a cross-validation algorithm the node should split the data using the split seed in the flag
        SPLIT_SEED and use the split that is specified in the flag SPLIT_NUMBER.

        # Arguments
        k: Integer, the number of splits
        name: String, flag prefix, e.g. '{name}_SEED' etc. Defaults to SPLIT

        # Examples
        ```python
        import machinable as ml
        # five independent runs of the same node
        ml.Task().component('regression').repeat(5)
        ```
        """
        return self._spec('repeats', dict(locals(), split=True), multiple=True)

    # execution

    def dry(self, verbosity=1):
        """Marks the execution as simulation without actual execution

        # Arguments
        verbosity: ``Integer`` determining the level of output detail
        """
        return self._spec('dry', locals())

    def confirm(self, each=False, timeout=None):
        """Adds a confirmation step before execution

        ::: warning
        This feature is currently under development and not ready for wider use
        :::

        # Arguments
        each: Boolean, if True each sub-execution has to be confirmed individually
        timeout: Optional timeout in seconds after which the execution will be confirmed
        """
        return self._spec('confirm', locals())

    def tune(self, stop=None, config=None, num_samples=1, **kwargs):
        """Schedules for hyperparameter tuning

        Uses [Ray tune](https://ray.readthedocs.io/en/latest/tune.html).
        Components need to implement on_execute_iteration event that becomes tune trainable. The record writer
        can be used as usual. In particular, record fields may be used in stop conditions.

        ::: warning
        Tuning integration is experimental. Please report any issues that you encounter.
        :::

        # Arguments
        stop: dict, the stopping criteria. The keys may be any field in self.records of the node,
            whichever is reached first. Defaults to empty dict.
        config: dict, algorithm-specific configuration for Tune variant generation (e.g. env, hyperparams).
            Defaults to empty dict. Custom search algorithms may ignore this.
        num_samples: Integer, Number of times to sample from the hyperparameter space. Defaults to 1.
            If grid_search is provided as an argument, the grid will be repeated num_samples of times.
        **kwargs: Additional options passed to
            [ray.tune.run](https://ray.readthedocs.io/en/latest/tune-package-ref.html#ray.tune.run)

        Please refer to the documentation of [Ray](https://ray.readthedocs.io) to learn more.
        """
        return self._spec('tune', locals())

    def export(self, path=None, overwrite=False):
        """Marks the task as export.

        When executed, machinable converts the task into a plain Python project
        that can be executed without machinable.

        ::: warning
        This feature may not work reliably in all circumstances and project use cases
        :::

        # Arguments
        path: String, directory where exported task will be stored. If None defaults to 'exports' in the
            current working directory
        overwrite: Boolean, whether to overwrite an existing export.
        """
        return self._spec('export', locals())
