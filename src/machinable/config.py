__all__ = ["Field", "validator", "RequiredField"]
from typing import TYPE_CHECKING, Dict, Optional, Tuple, Union, Any
from pydantic import BaseModel, Field, validator
from pydantic.dataclasses import dataclass
from inspect import isclass
import collections
import re

if TYPE_CHECKING:
    from machinable.element import Element


RequiredField = Field("???")


def from_element(element: "Element") -> Optional[BaseModel]:
    if not isclass(element):
        element = element.__class__

    if not hasattr(element, "Config"):
        return None

    schema = getattr(element, "Config")

    class SchemaConf:
        extra = "forbid"

    model = dataclass(config=SchemaConf)(schema).__pydantic_model__

    return model


def match_method(defition: str) -> Optional[Tuple[str, str]]:
    fn_match = re.match(r"(?P<method>\w+)\s?\((?P<args>.*)\)", defition)
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
