from typing import TYPE_CHECKING, Any, Dict, List, Optional, Tuple, Union

import collections
import copy
import re

import omegaconf
from machinable.errors import ConfigurationError
from machinable.types import ComponentType, VersionType
from machinable.utils import Jsonable, unflatten_dict, update_dict
from omegaconf import DictConfig, OmegaConf
from pydantic.dataclasses import dataclass

if TYPE_CHECKING:
    from machinable.element import Element


def _resolve_config_methods(
    obj: Any, config: Union[str, dict, list, tuple]
) -> Any:
    if isinstance(config, list):
        return [_resolve_config_methods(obj, v) for v in config]

    if isinstance(config, tuple):
        return (_resolve_config_methods(obj, v) for v in config)

    if isinstance(config, dict):
        return {k: _resolve_config_methods(obj, v) for k, v in config.items()}

    if isinstance(config, str):
        fn_match = re.match(r"(?P<method>\w+)\s?\((?P<args>.*)\)", config)
        if fn_match is not None:
            definition = config
            method = "config_" + fn_match.groupdict()["method"]
            args = fn_match.groupdict()["args"]

            if not hasattr(obj, method):
                raise AttributeError(
                    f"Config method {definition} specified but {type(obj).__name__}.{method}() does not exist."
                )

            # Using eval is evil, but in this case there is probably not enough at stake
            # to justify the implementation of a proper parser
            return eval(  # pylint: disable=eval-used
                "obj." + method + "(" + args + ")"
            )

    return config


def normversion(version: VersionType = None) -> List[Union[str, dict]]:
    if not isinstance(version, (list, tuple)):
        version = [version]

    def _valid(item):
        if item is None or item == {}:
            # skip
            return False

        if not isinstance(item, (collections.Mapping, str)):
            raise ValueError(
                f"Invalid version. Expected str or dict but found {item}"
            )

        return True

    return [v for v in version if _valid(v)]


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

        for slot, component in self.config.get("__uses", {}).items():
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

            __config = copy.deepcopy(self.__config)
            __version = copy.deepcopy(self.__version)

            # we assign the raw resolved config to allow config_methods to access it
            self._config = OmegaConf.create(__config)

            self.on_before_configure(self._config)

            # resolve config and version
            OmegaConf.resolve(self._config)
            resolved_config = _resolve_config_methods(
                self, OmegaConf.to_container(self._config)
            )

            resolved_version = []
            for ver in __version:
                if isinstance(ver, dict):
                    ver = OmegaConf.create(ver)
                    ver = OmegaConf.to_container(ver, resolve=True)
                    ver = unflatten_dict(ver)
                    ver = _resolve_config_methods(
                        self,
                        ver,
                    )

                resolved_version.append(ver)

            # parse slots
            available_slots = {
                key[1:-1]: value
                for key, value in resolved_config.items()
                if key.startswith("<") and key.endswith(">")
            }

            # validate uses
            if not resolved_config.pop("_dynamic_slots_", False):
                for use in resolved_config.get("__uses", {}):
                    if use not in available_slots:
                        raise ConfigurationError(
                            f"'{self.__module__}' has no slot '{use}'"
                        )

            slot_update = {}
            for slot, slot_config in available_slots.items():
                if slot_config is None:
                    continue
                if isinstance(slot_config, (list, str)):
                    slot_config = {"_default_": slot_config}
                if slot not in resolved_config.get("__uses", {}):
                    # default available?
                    default = slot_config.pop("_default_", None)
                    if default is not None:
                        if "__uses" not in resolved_config:
                            resolved_config["__uses"] = {}
                        resolved_config["__uses"][slot] = normversion(default)
                if slot in resolved_config.get("__uses", {}):
                    slot_update = update_dict(slot_update, slot_config)

            resolved_config = OmegaConf.merge(resolved_config, slot_update)

            # compose configuration update
            config_update = {}
            for version in resolved_version:
                if isinstance(version, str) and version.startswith("~"):
                    # from local version
                    name = version[1:]
                    path = name.split(":")
                    version = {}
                    level = resolved_config
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

            # remove versions and slots
            config = {
                k: v
                for k, v in resolved_config.items()
                if not (
                    k.startswith("~") or (k.startswith("<") and k.endswith(">"))
                )
            }

            # apply update
            config = OmegaConf.merge(config, config_update)

            # computed configuration transform
            self.on_configure(config)

            slot_version = {
                name: copy.deepcopy(config.get(name, {}))
                for name in resolved_config.get("__uses", {})
            }

            # parse config if config class is available
            if hasattr(self.__class__, "Config"):
                config["__schematized"] = True

                class SchemaConf:
                    extra = "forbid"

                schema = dataclass(config=SchemaConf)(
                    getattr(self.__class__, "Config")
                ).__pydantic_model__

                parsed = schema(
                    **{
                        k: v
                        for k, v in OmegaConf.to_container(config).items()
                        if not (
                            k.startswith("__")
                            or k in resolved_config.get("__uses", {})
                        )
                    }
                )

                config = OmegaConf.create(parsed.dict())
            else:
                config["__schematized"] = False

            # add introspection data
            config["__uses"] = resolved_config.get("__uses", {})
            config["__raw"] = __config
            config["__component"] = self.__class__.__module__
            config["__version"] = __version
            config["__resolved_version"] = resolved_version
            config["__slot_update"] = slot_update
            config["__update"] = config_update

            # make config property accessible for slot components
            self._config = config

            # resolve slot components
            self._resolved_components = {}
            for name, component in self.components.items():
                # we prepend the version to allow for slot component overrides
                component.__version = [slot_version[name]] + component.__version
                config[name] = component.config

            # disallow further transformation
            OmegaConf.set_readonly(config, True)

        return self._config

    def on_before_configure(self, config: DictConfig) -> None:
        """Configuration event operating on the raw configuration

        This may be used to apply computed configuration updates

        Do not use to validate the configuration but use validators in the config schema
        that are applied at a later stage.
        """

    def on_configure(self, config: DictConfig) -> None:
        """Configuration event

        This may be used to apply computed configuration updates

        Do not use to validate the configuration but use validators in the config schema
        that are applied at a later stage.
        """

    def __reduce__(self) -> Union[str, Tuple[Any, ...]]:
        return (self.__class__, (self.__config, self.__version))
