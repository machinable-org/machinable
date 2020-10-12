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


def collect_updates(version):
    collection = []
    for update in version:
        arguments = update["arguments"]

        if not isinstance(arguments, tuple):
            arguments = (arguments,)

        collection.extend(arguments)

    return collection


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

    def _get_version(self, name, config, current=None):
        # from yaml file
        if name.endswith(".yaml") or name.endswith(".json"):
            with open(name) as f:
                return yaml.load(f, Loader=yaml.FullLoader)

        # from mixin
        if name.startswith("_") and name.endswith("_"):
            try:
                return copy.deepcopy(self.data["mixins"][name[1:-1]]["args"])
            except KeyError:
                raise KeyError(
                    f"Mixin '{name}' not available.\n"
                    f"Did you register it under 'mixins'?\n"
                )

        # from yaml string
        if not name.startswith("~"):
            return yaml.load(name, Loader=yaml.FullLoader)

        # from local version
        if name in config:
            version = copy.deepcopy(config[name])
            if not current:
                return version
            else:
                # nested lookup
                try:
                    return update_dict(copy.deepcopy(current[name]), version)
                except KeyError:
                    return version

        if current:
            # nested lookup
            try:
                return copy.deepcopy(current[name])
            except KeyError:
                # ignore non-existing nested lookups
                return {}

        raise KeyError(
            f"Version '{name}' could not be found.\n"
            f"Available versions: {[f for f in config.keys() if f.startswith('~')]}\n"
        )

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

    def get_component(self, name, version=None, flags=None):
        if name is None:
            return None

        if name not in self.data["components"]:
            raise ValueError(
                f"Component '{name}' not found. Is it registered in the machinable.yaml?"
            )

        if self.default_class is not None:
            self.data["components"][name]["class"] = self.default_class

        if isinstance(self.data["components"][name]["class"], ModuleClass):
            self.data["components"][name]["class"].default_class = self.default_class

        # de-reference
        config = copy.deepcopy(self.data["components"][name])

        # flags
        config["flags"] = flags if flags is not None else {}

        # name
        config["name"] = name

        # introspection
        config["flags"]["NAME"] = name
        config["flags"]["MODULE"] = config["module"]

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

        # mixins
        for i, mixin in enumerate(parse_mixins(config["args"].get("_mixins_"))):
            mixin_info = {"name": mixin["name"]}

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
                mixin_info["origin"] = (
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
                        mixin_info["origin"] = (
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
                        mixin_info["origin"] = self.data["mixins"]["@"].get(
                            mixin["name"]
                        )
                    except KeyError:
                        raise KeyError(
                            f"Mixin '{mixin['name']}' not found. Is it registered under 'mixins'?"
                        )

            # the mixin config can be overwritten by the local config so we update the mixin arg and write it back
            config["args"] = update_dict(mixin_args["args"], config["args"], copy=True)

            # write information
            config["args"]["_mixins_"][i] = mixin_info

        # parse updates

        # merge local update to global updates
        config["versions"] = []
        versions = copy.deepcopy(self.version)
        if version is not None:
            versions.append({"arguments": {"components": copy.deepcopy(version)}})

        version = {}
        for updates in collect_updates(versions):
            # select components/node subsection
            update = updates.get("components", None)
            if update is None:
                continue

            if not isinstance(update, tuple):
                update = (update,)

            for k in update:
                # load arguments from machinable.yaml
                if isinstance(k, str):
                    config["versions"].append(k)
                    k = self._get_version(k, config["args"], version)
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

        config["args"] = update_dict(
            config["args"], version, preserve_schema=self.schema_validation
        )

        # remove unused versions
        config["args"] = {
            k: v
            for k, v in config["args"].items()
            if not k.startswith("~") or k in config["versions"]
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
                subcomponent.name, subcomponent.version, subcomponent.flags
            )
            if component_config is not None:
                components_config.append(component_config)

        return node_config, components_config
