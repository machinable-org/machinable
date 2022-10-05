__all__ = ["Field", "validator", "RequiredField", "Model"]
from typing import TYPE_CHECKING, Any, Callable, Dict, Optional, Tuple, Union

import collections
import re
from inspect import isclass

from pydantic import BaseModel as Model
from pydantic import Field
from pydantic import validator as _validator
from pydantic.dataclasses import dataclass
from pydantic.typing import AnyCallable

if TYPE_CHECKING:
    from machinable.element import Element
    from pydantic.typing import AnyClassMethod


RequiredField = Field("???")


def validator(
    *fields: str,
    pre: bool = False,
    each_item: bool = False,
    always: bool = False,
    check_fields: bool = True,
) -> Callable[[AnyCallable], "AnyClassMethod"]:
    """
    Decorate methods on the class indicating that they should be used to validate fields

    fields: which field(s) the method should be called on
    pre: whether or not this validator should be called before the standard validators (else after)
    each_item: for complex objects (sets, lists etc.) whether to validate individual elements rather than the whole object
    always: whether this method and other validators should be called even if the value is missing
    check_fields: whether to check that the fields actually exist on the model
    """
    return _validator(
        *fields,
        pre=pre,
        each_item=each_item,
        always=always,
        check_fields=check_fields,
        allow_reuse=True,
    )


def from_element(element: "Element") -> Optional[Model]:
    if not isclass(element):
        element = element.__class__

    if not hasattr(element, "Config"):
        return None

    schema = getattr(element, "Config")

    class SchemaConf:
        extra = "forbid"

    model = dataclass(config=SchemaConf)(schema).__pydantic_model__

    return model


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
