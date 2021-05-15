from typing import Any, List, Optional, Union

import copy
import inspect
import re

from machinable.errors import ConfigurationError
from machinable.utils import Jsonable, unflatten_dict, update_dict
from omegaconf import DictConfig, OmegaConf
from pydantic import BaseModel


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


class Component(Jsonable):
    """
    Component base class. All machinable components inherit from this class.
    """

    def __init__(
        self,
        spec: dict,
        version: Union[str, dict, None, List[Union[str, dict, None]]] = None,
    ):
        # defensive deep-copy
        self.__spec: dict = copy.deepcopy(spec)
        if not isinstance(version, (list, tuple)):
            version = [version]
        self.__version: Union[str, dict, None, List[Union[str, dict, None]]] = [
            v for v in version if (v is not None and v != {})
        ]
        self.__config: Optional[DictConfig] = None

    def serialize(self) -> dict:
        return {"spec": self.__spec, "version": self.__version}

    @classmethod
    def unserialize(cls, serialized: dict) -> "Component":
        return cls(**serialized)

    @classmethod
    def make(
        cls,
        version: Union[str, dict, None, List[Union[str, dict, None]]] = None,
    ):
        from machinable.project import Project

        return Project.get().get_component(cls.__module__, version)

    @property
    def config(self) -> DictConfig:
        """Component configuration"""
        if self.__config is None:
            # register resolvers
            for name, method in inspect.getmembers(
                self,
                predicate=lambda x: bool(
                    inspect.isfunction(x) or inspect.ismethod(x)
                ),
            ):
                if name.startswith("resolver_") and len(name) > 9:
                    OmegaConf.register_new_resolver(
                        name=name[9:], resolver=method, replace=True
                    )

            # we assign the raw resolved config to allow config_methods to access it
            self.__config = OmegaConf.resolve(
                OmegaConf.create(self.__spec["config"])
            )

            # resolve config and version
            resolved_config = _resolve_config_methods(
                self, OmegaConf.to_container(self.__config)
            )
            resolved_version = [
                _resolve_config_methods(
                    self,
                    unflatten_dict(
                        OmegaConf.to_container(
                            OmegaConf.resolve(OmegaConf.create(v))
                        )
                    ),
                )
                if isinstance(v, dict)
                else v
                for v in self.__version
            ]

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
                            u = {
                                k: copy.deepcopy(v)
                                for k, v in level.items()
                                if not k.startswith("~")
                            }
                            version = update_dict(version, u)
                    except KeyError as _e:
                        raise ConfigurationError(
                            f"'~{name}' could not be resolved."
                        ) from _e

                config_update = update_dict(config_update, version)

            # remove versions
            config = {
                k: v
                for k, v in resolved_config.items()
                if not k.startswith("~")
            }

            # apply update
            config = OmegaConf.unsafe_merge(config, config_update)

            # computed configuration transform
            self.on_configure(config)

            # apply schema if available
            if hasattr(self.__class__, "Config"):
                schema = type(
                    self.__class__.__name__ + "ConfigSchema",
                    (getattr(self.__class__, "Config", None), BaseModel),
                    {},
                )
                config = OmegaConf.create(
                    dict(schema(**OmegaConf.to_container(config)))
                )
                # todo: verify that config model has not added any values
                # that are not defined in the machinable.yaml

            # disallow further transformation
            OmegaConf.set_readonly(config, True)

            self.__config = config

        return self.__config

    def on_configure(self, config: DictConfig) -> None:
        """Configuration event

        This may be used to apply computed configuration updates

        Do not use to validate the configuration but use validators in the config schema
        that are applied at a later stage.
        """
