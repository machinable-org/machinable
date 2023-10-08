__all__ = ["Field", "field_validator", "Model"]
from typing import TYPE_CHECKING, Any, Optional, Tuple, Union

import collections
import re
import warnings
from dataclasses import asdict, dataclass, is_dataclass
from inspect import isclass

import omegaconf
from pydantic import BaseModel, Field, field_validator

if TYPE_CHECKING:
    from machinable.element import Element


class _ModelPrototype(BaseModel):
    pass


def from_element(element: "Element") -> Tuple[dict, Optional[BaseModel]]:
    if not isclass(element):
        element = element.__class__

    if not hasattr(element, "Config"):
        return {}, None

    config = getattr(element, "Config")

    # free-form
    if isinstance(config, collections.abc.Mapping):
        return config, None

    # pydantic model
    if isinstance(config, type(_ModelPrototype)):
        with warnings.catch_warnings(record=True):  # ignore pydantic warnings
            return config().model_dump(), config

    # ordinary class
    if not is_dataclass(config):
        config = dataclass(config)

    # dataclass
    return asdict(config()), None


def match_method(definition: str) -> Optional[Tuple[str, str]]:
    fn_match = re.match(r"(?P<method>\w+)\s?\((?P<args>.*)\)", definition)
    if fn_match is None:
        return None

    function = fn_match.groupdict()["method"]
    args = fn_match.groupdict()["args"]
    return function, args


def rewrite_config_methods(
    config: Union[collections.abc.Mapping, str, list, tuple]
) -> Any:
    if isinstance(config, list):
        return [rewrite_config_methods(v) for v in config]

    if isinstance(config, tuple):
        return (rewrite_config_methods(v) for v in config)

    if isinstance(config, collections.abc.Mapping):
        return {k: rewrite_config_methods(v) for k, v in config.items()}

    if isinstance(config, str) and match_method(config):
        # todo: take advatage of walrus operator in Python 3.8
        function, args = match_method(config)
        return '${config_method:"' + function + '","' + args + '"}'

    return config


def to_dict(dict_like):
    if isinstance(dict_like, (omegaconf.DictConfig, omegaconf.ListConfig)):
        return omegaconf.OmegaConf.to_container(dict_like)

    if isinstance(dict_like, (list, tuple)):
        return dict_like.__class__([k for k in dict_like])

    if not isinstance(dict_like, collections.abc.Mapping):
        return dict_like

    return {k: to_dict(v) for k, v in dict_like.items()}
