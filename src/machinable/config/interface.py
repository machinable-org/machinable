from typing import List, Tuple, Union

import copy
import inspect
from collections import OrderedDict

import yaml
from flatten_dict import unflatten
from machinable.config.mapping import config_map
from machinable.config.parser import parse_mixins
from machinable.experiment.experiment import Experiment
from machinable.settings import get_settings
from machinable.utils.dicts import update_dict
from machinable.utils.importing import ModuleClass
from machinable.utils.utils import call_with_context


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


class ConfigInterface:
    def __init__(self, parsed_config, version=None):
        self.data = parsed_config
        self.version = version or []
        self.schema_validation = get_settings()["schema_validation"]

    def _get_version(self, name, config):
        # from mixin
        if name.startswith("_") and name.endswith("_"):
            try:
                return copy.deepcopy(self.data["mixins"][name[1:-1]]["config"])
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

    def component(self, name: str, version=None, flags=None) -> dict:
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
        if "_evaluate" not in config["config"]:
            config["config"]["_evaluate"] = self.data["_evaluate"]

        # un-alias
        origin = self.data["components"]["@"][name]

        # collect versions
        config["versions"] = []
        versions = copy.deepcopy(self.version)
        if version is not None:
            # merge local update to global updates
            versions.append(
                {"arguments": {"components": copy.deepcopy(version)}}
            )
        version_updates = _collect_updates(versions)

        # parse mixins
        default_mixins = config["config"].pop("_mixins_", None)

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
                        self.data["imports"]["mixins"][
                            vendor + "." + mixin["name"]
                        ]
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
                    + self.data["imports"]["mixins"][vendor + ".@"].get(
                        mixin["name"]
                    )
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
                            + self.data["imports"]["mixins"][
                                mixin["vendor"] + ".@"
                            ][mixin["name"]]
                        )
                    except KeyError:
                        raise KeyError(
                            f"Dependent mixin '{mixin['vendor'] + '.' + mixin['name']}' not found."
                        )
                else:
                    try:
                        mixin_args = copy.deepcopy(
                            self.data["mixins"][mixin["name"]]
                        )
                        mixin_spec["origin"] = self.data["mixins"]["@"].get(
                            mixin["name"]
                        )
                    except KeyError:
                        raise KeyError(
                            f"Mixin '{mixin['name']}' not found. Is it registered in the machinable.yaml?\n"
                            "Registered mixins:\n\t- "
                            + "\n\t- ".join(
                                filter(
                                    lambda x: x != "@",
                                    self.data["mixins"].keys(),
                                )
                            )
                        )

            if mixin["overrides"]:
                # mixin overrides config
                config["config"] = update_dict(
                    config["config"], mixin_args["config"]
                )
            else:
                # config overrides mixin
                config["config"] = update_dict(
                    mixin_args["config"], config["config"]
                )

            mixin_specs.append(mixin_spec)

        config["config"]["_mixins_"] = mixin_specs

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
                    k = self._get_version(k, config["config"])
                elif isinstance(k, dict):
                    # evaluate computed properties
                    for key in k.keys():
                        if callable(k[key]):
                            k[key] = call_with_context(
                                k[key],
                                component=config,
                                config=config_map(config["config"]),
                                flags=config_map(config["flags"]),
                            )
                # unflatten
                if k.get("_unflatten", True):
                    k = unflatten(k, splitter="dot")

                # merge with version
                version = update_dict(version, k)

        try:
            config["config"] = update_dict(
                config["config"],
                version,
                preserve_schema=self.schema_validation,
            )
        except KeyError as e:
            raise KeyError(
                "Trying to override a key that is not present in the machinable.yaml: "
                f"{getattr(e, 'message', str(e))!s} "
                "To ignore this error, disable the schema_validation setting."
            ) from e

        # remove versions
        config["config"] = {
            k: v for k, v in config["config"].items() if not k.startswith("~")
        }

        return config
