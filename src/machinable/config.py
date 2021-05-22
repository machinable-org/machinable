from typing import Any, Mapping, Optional, Union

import copy
import os
import re

import yaml
from machinable.errors import ConfigurationError
from machinable.utils import sentinel, unflatten_dict, update_dict


class Loader(yaml.SafeLoader):
    def __init__(self, stream, cwd="./"):
        if isinstance(stream, str):
            self._root = cwd
        else:
            # from filestream
            self._root = os.path.split(stream.name)[0]

        super().__init__(stream)

    def include(self, node):
        target = self.construct_scalar(node)

        if target.startswith("$/"):
            target = target[2:]

        filename = (
            target
            if os.path.isabs(target)
            else os.path.join(self._root, target)
        )

        return from_file(filename)


# Support $/ notation for includes
Loader.add_constructor("!include", Loader.include)
Loader.add_implicit_resolver(
    "!include", re.compile(r"\$\/([^#^ ]*)"), first=None
)

# Support scientific number formats
Loader.add_implicit_resolver(
    "tag:yaml.org,2002:float",
    re.compile(
        """^(?:
        [-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+]?[0-9]+)?
        |[-+]?(?:[0-9][0-9_]*)(?:[eE][-+]?[0-9]+)
        |\\.[0-9_]+(?:[eE][-+][0-9]+)?
        |[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*
        |[-+]?\\.(?:inf|Inf|INF)
        |\\.(?:nan|NaN|NAN))$""",
        re.X,
    ),
    list("-+0123456789."),
)


def from_string(text: str, cwd="./") -> dict:
    config = yaml.load(text, lambda stream: Loader(stream, cwd))

    if "+" not in config:
        return config

    includes = config.pop("+")

    if not isinstance(includes, list):
        includes = [includes]
    for include in includes:
        if isinstance(include, str) and include.startswith("$/"):
            target = include[2:]
            filename = (
                target if os.path.isabs(target) else os.path.join(cwd, target)
            )
            include = from_file(filename)
        if not isinstance(include, Mapping):
            raise ConfigurationError(
                f"Include must be a mapping. {include} given."
            )

        config = update_dict(config, include)

    return config


def from_file(filename: str, default: Any = sentinel) -> Union[dict, Any]:
    if not os.path.isfile(filename):
        if default is not sentinel:
            return default
        return None

    with open(filename) as f:
        text = f.read()

    return from_string(text, os.path.abspath(os.path.dirname(filename)))


def parse(config: dict, components: Optional[dict] = None) -> dict:
    if components is None:
        components = {}
    modules = {}
    for section, elements in config.items():
        # todo: use regex to validate section string
        if ":" not in section or elements is None:
            continue

        if not isinstance(elements, Mapping):
            raise ConfigurationError(
                f"Invalid configuration under '{section}'. Expected mapping but found {type(elements).__name__}."
            )

        component_kind, prefix = section.split(":")

        for key, data in elements.items():
            if data is None:
                data = {}

            if not isinstance(data, Mapping):
                raise ConfigurationError(
                    f"Invalid configuration for component '{key}'. Expected mapping but found {type(data).__name__}."
                )

            # resolve dot notation
            if data.pop("_unflatten", True):
                data = unflatten_dict(data, copy=True)

            # todo: regex validation of key

            alias = None
            if key.find("=") != -1:
                key, alias = key.split("=")
                if alias in modules:
                    raise ConfigurationError(
                        f"Alias '{alias}' for '{key.split('^')[0]}' is ambiguous"
                    )

            parent = None
            lineage = []
            if key.find("^") != -1:
                # resolve inheritance
                key, parent = key.split("^")

                # find in current scope, considering aliases
                inherited = None
                for candidate in modules.values():
                    if (
                        candidate["module"] == parent
                        or candidate["key"] == parent
                        or candidate["alias"] == parent
                    ):
                        inherited = candidate
                if inherited is None:
                    # search in global scope, using full module name only
                    inherited = components.get(parent, None)
                if inherited is None:
                    raise ConfigurationError(
                        f"Parent component '^{parent}' of '{key}' does not exist."
                    )

                # push standard name to lineage
                lineage += [inherited["name"]] + inherited["lineage"]
                # inherit the parent's configuration
                # todo: deepcopy might be too conservative here
                data = update_dict(
                    copy.deepcopy(inherited["config_data"]), data
                )

            module = key if prefix == "" else prefix + "." + key

            modules[module] = {
                # note that the key specifies the full module path that may
                # change when imported from a vendor project while name
                # always specifies the module path relative to the project
                # the config is defined in
                "name": module,
                "module": module,
                "kind": component_kind,
                "prefix": prefix,
                "key": key,
                "alias": alias,
                "parent": parent,
                "lineage": lineage,
                "config_data": data,
            }

    return modules


def prefix(config: dict, module_prefix: str) -> dict:
    return {
        module_prefix
        + "."
        + data["module"]: {
            **data,
            "module": module_prefix + "." + data["module"],
        }
        for data in config.values()
    }
