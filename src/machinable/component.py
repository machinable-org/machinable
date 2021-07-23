from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union

import collections
import copy
import re

import omegaconf
from machinable.collection import collect
from machinable.errors import ConfigurationError
from machinable.types import ComponentType, VersionType
from machinable.utils import Jsonable, unflatten_dict, update_dict
from omegaconf import DictConfig, OmegaConf
from pydantic.dataclasses import dataclass

if TYPE_CHECKING:
    from machinable.element import Element


def _rewrite_config_methods(
    config: Union[collections.Mapping, str, list, tuple]
) -> Any:
    if isinstance(config, list):
        return [_rewrite_config_methods(v) for v in config]

    if isinstance(config, tuple):
        return (_rewrite_config_methods(v) for v in config)

    if isinstance(config, collections.Mapping):
        return {k: _rewrite_config_methods(v) for k, v in config.items()}

    if isinstance(config, str):
        fn_match = re.match(r"(?P<method>\w+)\s?\((?P<args>.*)\)", config)
        if fn_match is not None:
            function = fn_match.groupdict()["method"]
            args = fn_match.groupdict()["args"]
            return '${config_method:"' + function + '","' + args + '"}'

    return config


class ConfigMethod:
    def __init__(self, component: "Component") -> None:
        self.component = component

    def __call__(self, function, args) -> Any:
        definition = f"{function}({args})"
        method = f"config_{function}"

        if hasattr(self.component, method):
            prefix = "self.component."
        elif hasattr(self.component.parent, method):
            prefix = "self.component.parent."
        else:
            raise AttributeError(
                f"Config method {definition} specified but {type(self.component).__name__}.{method}() does not exist."
            )

        # Using eval is evil, but in this case there is probably not enough at stake
        # to justify the implementation of a proper parser
        try:
            return eval(  # pylint: disable=eval-used
                prefix + method + "(" + args + ")"
            )
        except Exception as _ex:
            raise ConfigurationError(
                f"{_ex} in config method {type(self.component).__name__}.{method}()"
            ) from _ex


def normversion(version: VersionType = None) -> List[Union[str, dict]]:
    if not isinstance(
        version,
        (
            list,
            tuple,
            omegaconf.listconfig.ListConfig,
        ),
    ):
        version = [version]

    def _valid(item):
        if item is None or item == {}:
            # skip
            return False

        if not isinstance(item, (collections.Mapping, str)):
            raise ValueError(
                f"Invalid version. Expected str or dict but found {type(item).__name__}: {item}"
            )

        return True

    def _norm(item):
        if isinstance(item, collections.Mapping):
            # convert to dict
            return OmegaConf.to_container(OmegaConf.create(item))
        return item

    return [_norm(v) for v in version if _valid(v)]


def compact(
    component: Union[str, List[Union[str, dict, None]]],
    version: VersionType = None,
) -> ComponentType:
    if isinstance(component, (list, tuple, omegaconf.listconfig.ListConfig)):
        component, *default_version = component
        if not isinstance(version, (list, tuple)):
            version = [version]
        version = list(default_version) + version

    if not isinstance(component, str):
        raise ValueError(
            f"Invalid component, expected str but found <{type(component).__name__}>: {component}"
        )

    return [component] + normversion(version)


def extract(
    compact_component: Union[str, List[Union[str, dict]], None]
) -> Tuple[Optional[str], Optional[List[Union[str, dict]]]]:
    if compact_component is None:
        return None, None

    if isinstance(compact_component, str):
        return compact_component, None

    if not isinstance(compact_component, (list, tuple)):
        raise ValueError(
            f"Invalid component defintion. Expected list or str but found {compact_component}"
        )

    if len(compact_component) == 0:
        raise ValueError(
            f"Invalid component defintion. Expected str or non-empty list."
        )

    if not isinstance(compact_component[0], str):
        raise ValueError(
            f"Invalid component defintion. First element in list has to be a string."
        )

    if len(compact_component) == 1:
        return compact_component[0], None

    return compact_component[0], normversion(compact_component[1:])


def _internal_key(key):
    return key.startswith("_") and key.endswith("_")


class Component(Jsonable):
    """
    Component base class. All machinable components inherit from this class.
    """

    default: Optional["Component"] = None

    def __init__(
        self,
        config: dict,
        version: VersionType = None,
        parent: Union["Element", "Component", None] = None,
    ):
        self.__config = config
        self.__version = normversion(version)
        self.__parent = parent
        self._config: Optional[DictConfig] = None
        self._resolved_components: Dict[str, "Component"] = {}

    @property
    def components(self) -> Dict[str, "Component"]:
        from machinable.project import Project

        for slot, component in self.config.get("_uses_", {}).items():
            if slot not in self._resolved_components:
                self._resolved_components[slot] = Project.get().get_component(
                    component[0], component[1:], parent=self
                )

        return self._resolved_components

    @property
    def element(self) -> "Element":
        if isinstance(self.__parent, Component):
            return self.__parent.element

        return self.__parent

    @property
    def parent(self) -> Optional["Component"]:
        return self.__parent if isinstance(self.__parent, Component) else None

    def serialize(self) -> dict:
        return {
            "config": self.__config,
            "version": self.__version,
        }

    @classmethod
    def unserialize(cls, serialized: dict) -> "Component":
        return cls(**serialized)

    @classmethod
    def make(
        cls,
        name: Optional[str] = None,
        version: VersionType = None,
        slots: Optional[dict] = None,
        parent: Union["Element", "Component", None] = None,
    ) -> "Component":
        if name is None:
            if (
                cls.__module__.startswith("machinable.component")
                and cls.__name__ == "Component"
            ):
                raise ValueError("You have to provide a component name.")

            name = cls.__module__

        from machinable.project import Project

        return Project.get().get_component(name, version, slots, parent)

    @classmethod
    def set_default(
        cls,
        name: Optional[str] = None,
        version: VersionType = None,
    ) -> None:
        cls.default = compact(name, version)

    @property
    def config(self) -> DictConfig:
        """Component configuration"""
        if self._config is None:
            # register resolvers
            for name in dir(self):
                if name.startswith("resolver_") and len(name) > 9:
                    method = getattr(self, name, None)
                    if callable(method):
                        OmegaConf.register_new_resolver(
                            name=name[9:], resolver=method, replace=True
                        )

            # config method resolver
            OmegaConf.register_new_resolver(
                name="config_method", resolver=ConfigMethod(self), replace=True
            )

            __config = copy.deepcopy(self.__config)
            __version = copy.deepcopy(self.__version)

            lineage = copy.deepcopy(self.__config.get("_lineage_", []))
            uses = copy.deepcopy(self.__config.get("_uses_", {}))
            # parse slots
            available_slots = {
                key[1:-1]: value
                for key, value in __config.items()
                if key.startswith("<") and key.endswith(">")
            }

            dynamic_uses = False
            if "_dynamic_uses_" in __config:
                dynamic_uses = __config.pop("_dynamic_uses_")
            # validate uses
            if not dynamic_uses:
                for use in uses:
                    if use not in available_slots:
                        raise ConfigurationError(
                            f"'{self.__module__}' has no slot '{use}'"
                        )

            # we assign the raw config
            self._config = OmegaConf.create(__config)

            self.on_before_configure(self._config)

            slot_update = {}
            for slot, slot_config in available_slots.items():
                if slot_config is None:
                    continue
                if not isinstance(slot_config, collections.Mapping):
                    slot_config = {"_default_": slot_config}
                if slot not in uses:
                    # default available?
                    default = slot_config.get("_default_", None)
                    if default is not None:
                        uses[slot] = normversion(default)
                if slot in uses:
                    slot_update = update_dict(slot_update, slot_config)

            self._config = OmegaConf.merge(self._config, slot_update)

            # compose configuration update
            config_update = {}
            for version in __version:
                if isinstance(version, collections.Mapping):
                    version = unflatten_dict(version)
                elif isinstance(version, str) and version.startswith("~"):
                    # from local version
                    name = version[1:]
                    path = name.split(":")
                    version = {}
                    level = self._config
                    try:
                        for key in path:
                            level = level["~" + key]
                            # extract config on this level
                            patch = {
                                k: copy.deepcopy(v)
                                for k, v in level.items()
                                if not k.startswith("~")
                            }
                            version = update_dict(version, patch)
                    except KeyError as _e:
                        raise ConfigurationError(
                            f"'~{name}' could not be resolved."
                        ) from _e

                config_update = update_dict(config_update, version)

            # apply update
            self._config = OmegaConf.merge(self._config, config_update)

            # remove versions and uses
            config = {
                k: v
                for k, v in OmegaConf.to_container(self._config).items()
                if not (
                    k.startswith("~") or (k.startswith("<") and k.endswith(">"))
                )
            }

            # enable config methods
            self._config = OmegaConf.create(_rewrite_config_methods(config))

            # computed configuration transform
            self.on_configure()

            # resolve config
            config = OmegaConf.to_container(self._config, resolve=True)

            slot_version = {
                name: copy.deepcopy(config.get(name, {})) for name in uses
            }

            # parse config if config class is available
            if hasattr(self.__class__, "Config"):
                config["_schematized_"] = True

                class SchemaConf:
                    extra = "forbid"

                schema = dataclass(config=SchemaConf)(
                    getattr(self.__class__, "Config")
                ).__pydantic_model__

                parsed = schema(
                    **{
                        k: v
                        for k, v in config.items()
                        if not (_internal_key(k) or k in uses)
                    }
                )

                config = parsed.dict()
            else:
                config["_schematized_"] = False

            # add introspection data
            config["_lineage_"] = lineage
            config["_uses_"] = uses
            config["_raw_"] = self.__config
            config["_component_"] = self.__class__.__module__
            config["_version_"] = self.__version
            config["_slot_update_"] = slot_update
            config["_update_"] = config_update

            # make config property accessible for slot components
            self._config = OmegaConf.create(config)

            # resolve slot components
            self._resolved_components = {}
            for name, component in self.components.items():
                # we prepend the version to allow for slot component overrides
                component.__version = [slot_version[name]] + component.__version
                self._config[name] = component.config

            # disallow further transformation
            OmegaConf.set_readonly(self._config, True)

        return self._config

    def on_before_configure(self, config: DictConfig) -> None:
        """Configuration event operating on the raw configuration

        This may be used to apply computed configuration updates

        Do not use to validate the configuration but use validators in the config schema
        that are applied at a later stage.
        """

    def on_configure(self) -> None:
        """Configuration event

        This may be used to apply computed configuration updates

        Do not use to validate the configuration but use validators in the config schema
        that are applied at a later stage.
        """

    def __reduce__(self) -> Union[str, Tuple[Any, ...]]:
        return (self.__class__, (self.__config, self.__version))
