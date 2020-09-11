import copy
from collections import OrderedDict
from typing import Tuple, Type, Union

from ..utils.importing import resolve_instance
from ..utils.traits import Jsonable
from ..utils.utils import is_valid_module_path


class ExperimentComponent(Jsonable):
    def __init__(self, name, version=None, checkpoint=None, flags=None):
        """Experiment components

        # Arguments
        name: String, the name of the components as defined in the machinable.yaml
        version: dict|String, a configuration update to override its default config
        checkpoint: String, optional URL to a checkpoint file from which the components will be restored
        flags: dict, optional flags dictionary

        # Examples
        ```python
        import machinable as ml
        component = ml.C('models.linear_regression', {'alpha': 0.1})
        ```
        """
        self.name = name
        self.version = version
        self.checkpoint = checkpoint
        if flags is None:
            flags = {}
        flags = flags.copy()
        if isinstance(checkpoint, str):
            flags["CHECKPOINT"] = checkpoint
        self.flags = flags

    @classmethod
    def create(cls, args: Union[Type, str, Tuple, "ExperimentComponent"]):
        """Creates a components from arguments

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

        raise ValueError(f"Invalid arguments: {args}")

    def unpack(self):
        if isinstance(self.version, list):
            return [
                __class__(self.name, v, self.checkpoint, self.flags)
                for v in self.version
            ]

        return self

    def serialize(self):
        return (
            self.name,
            copy.deepcopy(self.version),
            self.checkpoint,
            copy.deepcopy(self.flags),
        )

    @classmethod
    def unserialize(cls, serialized):
        if isinstance(serialized, list):
            serialized = tuple(serialized)
        return cls.create(serialized)

    def __str__(self):
        return f"Component({self.name})"

    def __repr__(self):
        if self.name is None:
            return "machinable.C(None)"

        return f"machinable.C({self.name}, version={self.version}, checkpoint={self.checkpoint}, flags={self.flags})"


_latest = [None]


class Experiment(Jsonable):
    """Defines an execution schedule for available components. The experiment interface is fluent,
    methods can be chained in arbitrary order.

    # Arguments
    components: Optional String or ``tuple`` components definition to add to the experiment

    # Example
    ```python
    import machinable as ml
    linear_regression = ml.Experiment().components('mnist').repeat(3)
    # or using the shorthand where components arguments are passed into the constructor
    linear_regression = ml.Experiment('mnist').repeat(3)
    ```
    """

    def __init__(self):
        self._cache = None
        self._specs = OrderedDict()
        _latest[0] = self

    def __repr__(self):
        spec = self.specification
        r = "Experiment"
        r += f" <{len(spec['components'])}>"
        if spec["name"] is not None:
            r += f" ({spec['name']})"
        return r

    def __str__(self):
        return self.__repr__()

    @classmethod
    def latest(cls):
        return _latest[0]

    @classmethod
    def set_latest(cls, latest):
        _latest[0] = latest

    @classmethod
    def create(cls, args):
        """Creates a experiment instance"""
        if isinstance(args, cls):
            return args

        if args is None:
            return cls()

        resolved = resolve_instance(args, Experiment, "experiments")
        if resolved is not None:
            return resolved

        if isinstance(args, str):
            return cls().components(args)

        if isinstance(args, tuple):
            return cls().components(*args)

        if isinstance(args, list):
            return cls().component(*args)

        raise ValueError(f"Invalid arguments: {args}")

    def _spec(self, field, arguments, multiple=False, **kwargs):
        self._cache = None

        if "self" in arguments:
            del arguments["self"]
        value = dict(
            {"field": field, "arguments": arguments, "multiple": multiple}, **kwargs
        )
        if multiple:
            if field not in self._specs:
                self._specs[field] = []
            value["id"] = len(self._specs[field])
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
        spec.setdefault("components", [])
        spec.setdefault("repeats", [])
        spec.setdefault("version", [])
        spec.setdefault("name", None)

        self._cache = spec

        return spec

    @specification.setter
    def specification(self, specs):
        self._cache = None
        if not isinstance(specs, OrderedDict):
            specs = OrderedDict(specs)
        self._specs = specs

    def serialize(self):
        def serial(x):
            try:
                return x.serialize()
            except AttributeError:
                return x

        serialized = copy.deepcopy(self.specification)
        for i in range(len(serialized["components"])):
            args = serialized["components"][i]["arguments"]
            args["node"] = serial(args["node"])
            args["components"] = [serial(c) for c in args["components"]]

        return serialized

    @classmethod
    def unserialize(cls, serialized):
        for i in range(len(serialized["components"])):
            args = serialized["components"][i]["arguments"]
            args["node"] = ExperimentComponent.unserialize(args["node"])
            args["components"] = [
                ExperimentComponent.unserialize(c) for c in args["components"]
            ]
        task = cls()
        task.specification = serialized
        return task

    # fluent interface

    def copy(self):
        """Returns a copy of the current experiment object
        """
        task = __class__()
        task.specification = self.specification.copy()
        return task

    def name(self, name: str):
        """Sets an experiment name

        # Arguments
        name: String, experiment name.
          Must be a valid Python variable name or path e.g. `my_name` or `example.name` etc.
        """
        if not is_valid_module_path(name):
            raise ValueError(
                "Name must be a valid Python variable name or path e.g. `my_name` or `example.name` etc. "
                f"{name} given."
            )
        self._specs["name"] = name
        self._cache = None

        return self

    def component(
        self, name, version=None, checkpoint=None, flags=None, resources=None
    ):
        """Adds a component to the experiment

        # Arguments
        name: String, the name of the components as defined in the machinable.yaml
        version: dict|String, a configuration update to override its default config
        checkpoint: String, optional URL to a checkpoint file from which the components will be restored
        flags: dict, optional flags to be passed to the component
        resources: dict, specifies the resources that are available to the component.
                   This can be computed by passing in a callable (see below)

        # Examples
        ```python
        import machinable as ml
        experiment = ml.Experiment().component(name='models.linear_regression', version={'alpha': 0.1})
        ```

        # Dynamic resource computation

        You can condition the resource specification on the configuration, for example:
        ```python
        resources = lambda(engine, component, components): {'gpu': component.config.num_gpus }
        ```
        The arguments of the callable are:
        engine - The engine instance
        component - The full component specification (config, flags, module)
        components - List of sub-component specifications
        """
        return self.components(
            node=ExperimentComponent(name, version, checkpoint, flags),
            resources=resources,
        )

    def components(self, node, components=None, resources=None):
        """Adds a component with sub-components to the experiment

        # Arguments
        node: machinable.ExperimentComponent specifying the node components
        components: optional list of machinable.Component, supplementary components for this node
        resources: dict, specifies the resources that are available to the component

        # Examples
        ```python
        import machinable as ml
        experiment = ml.Experiment().components(
            node=('mnist', version='~shuffled'),                # main component
            components=['resnet', ('resnext', {'lr': 3e-4})]    # sub-components
            resources={'num_gpus': 2}
        )
        ```
        """
        component = ExperimentComponent.create(node).unpack()

        if isinstance(component, list):
            for comp in component:
                self.components(comp, components, resources)
            return self

        if not isinstance(components, list):
            components = [ExperimentComponent.create(components)]

        for i, comp in enumerate(components):
            unpacked_components = ExperimentComponent.create(comp).unpack()
            if isinstance(unpacked_components, list):
                # cross-product with all other components
                for unpacked_component in unpacked_components:
                    reduced = (
                        [components[before] for before in range(i)]
                        + [unpacked_component]
                        + [components[after] for after in range(i + 1, len(components))]
                    )
                    self.components(component, reduced, resources)
                return self

        return self._spec(
            "components",
            {"node": component, "components": components, "resources": resources},
            multiple=True,
        )

    def version(self, config=None):
        """Applies a configuration update

        Selected components use the default configuration as specified in the machinable.yaml.
        Versioning allows for configuration overrides using dictionaries or defined version patterns.
        The versions here are applied globally to all components in this experiment. If you
        want to apply the version locally, use the version parameter in the local method.

        # Arguments
        config: Configuration update dictionary

        # Examples
        ```python
        from machinable import Experiment
        experiment = Experiment().components('evolution').components('sgd')
        # use a dictionary to override configuration values
        experiment.version({'data': {'shuffle': True}, 'lr': 0.01})
        ```
        """
        # We wrap the version under a components key to allow for future extension where
        #  overrides are specific to main or sub-components only etc.
        config_version = {"components": copy.deepcopy(config)}
        self._spec("version", config_version, multiple=True)

        return self

    # proliferation

    def repeat(self, k, name="REPEAT", mode="independent"):
        """Repeats the experiment k times

        Schedules the current experiment multiple times and injects the flags REPEAT_NUMBER and REPEAT_SEED to the
        node instances.

        # Arguments
        k: Integer, the number of repetitions
        name: String, flag prefix, e.g. '{name}_SEED' etc. Defaults to REPEAT

        # Examples
        ```python
        import machinable as ml
        # five independent runs of the same node
        ml.Experiment().components('regression').repeat(5)
        ```
        """
        return self._spec("repeats", locals(), multiple=True)

    def split(self, k, name="SPLIT", mode="independent"):
        """Splits the experiment k times

        Schedules the current experiment k times and injects appropriate flags SPLIT_NUMBER and SPLIT_SEED to the
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
        ml.Experiment().components('regression').repeat(5)
        ```
        """
        return self._spec("repeats", dict(locals(), split=True), multiple=True)

    def tune(self, *args, **kwargs):
        """Schedules for hyperparameter tuning

        Components need to implement on_execute_iteration event that becomes tune training step. The record writer
        can be used as usual. In particular, record fields may be used in stop conditions.

        ::: warning
        Tuning integration is experimental. Please report any issues that you encounter.
        :::

        # Arguments

        The arguments differ based on the used engine.

        - Ray engine: Uses [Ray tune](https://ray.readthedocs.io/en/latest/tune.html)
          ([Argument reference](https://ray.readthedocs.io/en/latest/tune/api_docs/execution.html#tune-run))
        """
        return self._spec("tune", locals())
