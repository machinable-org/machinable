import copy
import inspect
from collections import OrderedDict

import yaml
from flatten_dict import unflatten

from ..config.mapping import config_map
from ..core.settings import get_settings
from ..experiment import ExperimentComponent
from ..utils.dicts import update_dict
from ..utils.importing import ModuleClass
from .parser import parse_mixins


def _collect_updates(version):
    collection = []
    for update in version:
        arguments = update["arguments"]

        if not isinstance(arguments, tuple):
            arguments = (arguments,)

        collection.extend(
            [
                a["components"]
                if isinstance(a["components"], tuple)
                else (a["components"],)
                for a in arguments
                if "components" in a
            ]
        )

    return collection


def _mark_mixin_as_override(mixin):
    if isinstance(mixin, str):
        mixin = dict(name=mixin, overrides=True)
    if isinstance(mixin, dict):
        mixin["overrides"] = mixin.get("overrides", True)
    return mixin


def mapped_config(config):
    if isinstance(config, list):
        return [mapped_config(c) for c in config]
    config["config"] = config["args"]
    return config_map(config)


class ConfigInterface:
    def __init__(self, parsed_config, version=None, default_class=None):
        self.data = parsed_config
        if version is None:
            version = []
        self.version = version
        self.default_class = default_class
        self.schema_validation = get_settings()["schema_validation"]

    @staticmethod
    def call_with_context(function, component, components=None, resources=None):
        signature = inspect.signature(function)
        payload = OrderedDict()

        for index, (key, parameter) in enumerate(signature.parameters.items()):
            if parameter.kind is not parameter.POSITIONAL_OR_KEYWORD:
                # disallow *args and **kwargs
                raise TypeError(
                    f"Method only allows simple positional or keyword arguments,"
                    f"for example lambda(node, components, resources)"
                )

            if key == "component":
                payload["component"] = mapped_config(component)
            elif key == "config":
                payload["config"] = config_map(component["args"])
            elif key == "flags":
                payload["flags"] = config_map(component["flags"])
            elif components is not None and key == "components":
                payload["components"] = mapped_config(components)
            elif resources is not None and key == "resources":
                payload["resources"] = resources
            else:
                raise ValueError(
                    f"Unrecognized argument: '{key}'. "
                    f"Experiment directory takes the following arguments: "
                    f"'node', 'components' and 'resources'"
                )

        return function(**payload)

    def _get_version(self, name, config):
        # from mixin
        if name.startswith("_") and name.endswith("_"):
            try:
                return copy.deepcopy(self.data["mixins"][name[1:-1]]["args"])
            except KeyError:
                raise KeyError(
                    f"Mixin '{name}' not available.\n"
                    f"Did you register it under 'mixins'?\n"
                )

        # from local version
        version = {}
        path = name[1:].split(":")
        level = config
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
            return version
        except KeyError:
            pass

        raise KeyError(
            f"Version '{name}' could not be found.\n"
            f"Available versions: {[f for f in config.keys() if f.startswith('~')]}\n"
        )

    def get_component(self, name, version=None, flags=None):
        if name is None:
            return None

        if name not in self.data["components"]:
            raise ValueError(
                f"Component '{name}' not found. Is it registered in the machinable.yaml?\n"
                "Registered components:\n\t- "
                + "\n\t- ".join(
                    filter(lambda x: x != "@", self.data["components"].keys())
                )
            )

        if self.default_class is not None:
            self.data["components"][name]["class"] = self.default_class

        if isinstance(self.data["components"][name]["class"], ModuleClass):
            self.data["components"][name]["class"].default_class = self.default_class

        # de-reference
        config = copy.deepcopy(self.data["components"][name])

        # flags
        config["flags"] = update_dict(config["flags"], flags)

        # name
        config["name"] = name

        # introspection
        config["flags"]["NAME"] = name
        config["flags"]["MODULE"] = config["module"]
        config["flags"]["VERSIONING"] = []

        # output redirection
        if "OUTPUT_REDIRECTION" not in config["flags"]:
            config["flags"]["OUTPUT_REDIRECTION"] = "SYS_AND_FILE"
        if config["flags"]["OUTPUT_REDIRECTION"] not in (
            "SYS_AND_FILE",
            "DISABLED",
            "FILE_ONLY",
            "SYS_AND_FILE",
            "DISCARD",
        ):
            raise ValueError(
                f"Invalid OUTPUT_REDIRECTION mode: {config['flags']['OUTPUT_REDIRECTION']}"
            )

        # carry over global evaluation config
        if "_evaluate" not in config["args"]:
            config["args"]["_evaluate"] = self.data["_evaluate"]

        # un-alias
        origin = self.data["components"]["@"][name]

        # collect versions
        config["versions"] = []
        versions = copy.deepcopy(self.version)
        if version is not None:
            # merge local update to global updates
            versions.append({"arguments": {"components": copy.deepcopy(version)}})
        version_updates = _collect_updates(versions)

        # parse mixins
        default_mixins = config["args"].pop("_mixins_", None)

        # check for default mixins overrides in version
        mixins = None
        for update in version_updates:
            for k in update:
                if not isinstance(k, dict):
                    continue
                override = k.pop("_mixins_", None)
                if override is not None:
                    mixins = override

        if mixins is None:
            mixins = default_mixins
        else:
            if default_mixins is None:
                default_mixins = []
            if not isinstance(default_mixins, (list, tuple)):
                default_mixins = [default_mixins]
            merged = []
            for m in mixins:
                if m == "^":
                    merged.extend(default_mixins)
                else:
                    merged.append(_mark_mixin_as_override(m))
            mixins = merged

        mixin_specs = []
        for mixin in parse_mixins(mixins):
            mixin_spec = {"name": mixin["name"]}

            if mixin["name"].startswith("+."):
                raise AttributeError(
                    f"Mixin import '{mixin['name']}' is ambiguous. "
                    f"Please register it in the mixins section and use a unique alias."
                )

            if origin.startswith("+."):
                vendor = origin.split(".")[1]

                # consider import mixins
                try:
                    mixin_args = copy.deepcopy(
                        self.data["imports"]["mixins"][vendor + "." + mixin["name"]]
                    )
                except KeyError:
                    raise KeyError(
                        f"Dependent mixin '{vendor + '.' + mixin['name']}' of '{origin}' not found."
                    )

                # un-alias
                mixin_spec["origin"] = (
                    "+."
                    + vendor
                    + "."
                    + self.data["imports"]["mixins"][vendor + ".@"].get(mixin["name"])
                )
            else:
                if "vendor" in mixin:
                    try:
                        mixin_args = copy.deepcopy(
                            self.data["imports"]["mixins"][
                                mixin["vendor"] + "." + mixin["name"]
                            ]
                        )
                        mixin_spec["origin"] = (
                            "+."
                            + mixin["vendor"]
                            + "."
                            + self.data["imports"]["mixins"][mixin["vendor"] + ".@"][
                                mixin["name"]
                            ]
                        )
                    except KeyError:
                        raise KeyError(
                            f"Dependent mixin '{mixin['vendor'] + '.' + mixin['name']}' not found."
                        )
                else:
                    try:
                        mixin_args = copy.deepcopy(self.data["mixins"][mixin["name"]])
                        mixin_spec["origin"] = self.data["mixins"]["@"].get(
                            mixin["name"]
                        )
                    except KeyError:
                        raise KeyError(
                            f"Mixin '{mixin['name']}' not found. Is it registered in the machinable.yaml?\n"
                            "Registered mixins:\n\t- "
                            + "\n\t- ".join(
                                filter(lambda x: x != "@", self.data["mixins"].keys())
                            )
                        )

            if mixin["overrides"]:
                # mixin overrides config
                config["args"] = update_dict(config["args"], mixin_args["args"])
            else:
                # config overrides mixin
                config["args"] = update_dict(mixin_args["args"], config["args"])

            mixin_specs.append(mixin_spec)

        config["args"]["_mixins_"] = mixin_specs

        # parse updates
        version = {}
        for update in version_updates:
            for k in update:
                if k is None:
                    continue
                if isinstance(k, str):
                    config["versions"].append(k)
                    if k.startswith("~"):
                        config["flags"]["VERSIONING"].append(k[1:])
                    k = self._get_version(k, config["args"])
                elif isinstance(k, dict):
                    # evaluate computed properties
                    for key in k.keys():
                        if callable(k[key]):
                            k[key] = self.call_with_context(k[key], config)

                # unflatten
                if k.get("_unflatten", True):
                    k = unflatten(k, splitter="dot")

                # merge with version
                version = update_dict(version, k)

        try:
            config["args"] = update_dict(
                config["args"], version, preserve_schema=self.schema_validation
            )
        except KeyError as e:
            raise KeyError(
                "Trying to override a key that is not present in the machinable.yaml: "
                f"{getattr(e, 'message', str(e))!s} "
                "To ignore this error, disable the schema_validation setting."
            ) from e

        # remove versions
        config["args"] = {
            k: v for k, v in config["args"].items() if not k.startswith("~")
        }

        return config

    def get(self, component, components=None):
        component = ExperimentComponent.create(component)
        node_config = self.get_component(
            component.name, component.version, component.flags
        )

        if components is None:
            return node_config

        components_config = []
        for c in components:
            subcomponent = ExperimentComponent.create(c)
            component_config = self.get_component(
                subcomponent.name,
                subcomponent.version,
                subcomponent.flags,
            )
            if component_config is not None:
                components_config.append(component_config)

        return node_config, components_config
