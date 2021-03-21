from typing import List, Optional, Tuple, Union

import copy
import inspect
import mimetypes
import os
import pickle
import sys
import time
from collections import OrderedDict

import pendulum
import yaml
from flatten_dict import unflatten
from machinable.config.loader import from_callable as load_config_from_callable
from machinable.config.loader import from_file as load_config_file
from machinable.config.loader import from_string as load_config_from_string
from machinable.config.mapping import config_map
from machinable.config.parser import parse_mixins, parse_module_list
from machinable.project.manager import fetch_imports
from machinable.settings import get_settings
from machinable.utils.dicts import update_dict
from machinable.utils.formatting import exception_to_str, msg
from machinable.utils.importing import ModuleClass, import_module_from_directory
from machinable.utils.traits import Jsonable
from machinable.utils.utils import (
    call_with_context,
    is_valid_module_path,
    is_valid_variable_name,
)
from machinable.utils.vcs import get_commit, get_diff, get_root_commit


class Project(Jsonable):
    def __init__(self, directory: Optional[str] = None, parent=None):
        super().__init__()
        if directory is None:
            directory = os.getcwd()
        self.directory: str = directory
        self._name: Optional[str] = None
        self._parent: Optional[Project] = parent
        self._schema_validation = get_settings()["schema_validation"]

        self._config_file: str = "machinable.yaml"
        self._vendor_caching = get_settings()["cache"].get("imports", False)

        self._config = None
        self._parsed_config = None
        self._config_interface = None

    @classmethod
    def make(cls, args):
        """Creates an element instance"""
        if isinstance(args, cls):
            return args

        if args is None:
            return cls()

        if isinstance(args, str):
            return cls(args)

        if isinstance(args, tuple):
            return cls(*args)

        if isinstance(args, dict):
            return cls(**args)

        raise ValueError(f"Invalid arguments: {args}")

    @classmethod
    def connect(cls, directory: Optional[str] = None):
        from machinable.element.element import Element

        instance = cls.make(directory)
        if (
            os.path.exists(instance.directory_path)
            and instance.directory_path not in sys.path
        ):
            if instance.is_root():
                sys.path.insert(0, instance.directory_path)
            else:
                sys.path.append(instance.directory_path)

        Element.__project__ = instance

        return instance

    @property
    def config_filepath(self) -> str:
        return os.path.join(self.directory, self._config_file)

    @property
    def directory_path(self) -> str:
        return os.path.abspath(self.directory)

    def path(self, *append) -> str:
        return os.path.join(self.directory_path, *append)

    @property
    def name(self) -> Optional[str]:
        if self._name is None:
            self._name = self.get_config().get("name", None)

        return self._name

    @property
    def directory_prefix(self):
        if self.directory == ".":
            return ""

        return self.directory

    @property
    def vendor_directory(self):
        return os.path.join(self.directory, "vendor")

    @property
    def vendor_path(self):
        return os.path.abspath(self.vendor_directory)

    @property
    def import_prefix(self):
        # find relative address to target import class
        prefix = os.path.relpath(
            self.directory_path, self.get_root().directory_path
        )

        if prefix == ".":
            return None

        assert "../" not in prefix

        return prefix.replace("/", ".")

    def serialize(self):
        return {
            "directory": self.directory,
        }

    @classmethod
    def unserialize(cls, serialized):
        return cls(serialized)

    def is_root(self):
        return self._parent is None

    def get_root(self):
        if self.is_root():
            return self

        p = self._parent
        while not p.is_root():
            p = p.parent

        return p

    def has_config_file(self):
        return os.path.isfile(
            os.path.join(self.directory_path, self._config_file)
        )

    def has_registration(self):
        return os.path.isfile(
            os.path.join(self.directory_path, "_machinable.py")
        ) or os.path.isfile(
            os.path.join(self.directory_path, "_machinable", "__init__.py")
        )

    def exists(self):
        return os.path.isfile(self.directory_path)

    @property
    def registration(self):
        registration = None
        try:
            registration_module = import_module_from_directory(
                "_machinable", self.directory_path
            )
            registration_class = getattr(registration_module, "Project", False)
            if registration_class:
                registration = registration_class()
                registration.project = self
            else:
                msg(
                    f"Project registration module does not define a Project(Registration) object",
                    level="warn",
                    color="fail",
                )
        except ImportError as e:
            if not (e.args and e.args[0] == "No module named '_machinable'"):
                # emit warning that existing registration could not be imported
                msg(
                    f"Could not import project registration. {e}\n{exception_to_str(e)}",
                    level="error",
                    color="fail",
                )

        return registration

    def set_config(self, config=None) -> "Project":
        """Set configuration for this project

        This allows to manually override the file-based configuration
        of this project"""
        if isinstance(config, str):
            self._config = load_config_from_string(config)
        else:
            self._config = config
        if not isinstance(self._config, dict):
            raise ValueError(f"Invalid project configuration: '{config}'")
        return self

    def get_config(self, cached=None):
        if cached is None:
            # in future, we could compute a hash that includes vendors to determine changes
            #  and reload more efficiently
            cached = False

        if cached is not False and self._config is not None:
            return self._config

        # load config
        self._parsed_config = None
        if self.has_config_file():
            self._config = load_config_file(self.config_filepath, default={})
        else:
            self._config = {}

        # validate and set defaults
        self._config.setdefault("_evaluate", True)

        self._config.setdefault("+", [])
        assert isinstance(
            self._config["+"], (tuple, list)
        ), "Invalid import definition: " + str(self._config["+"])

        self._config.setdefault("mixins", [])

        return self._config

    def backup_source_code(
        self, filepath="code.zip", opener=None, exclude=None, echo=None
    ) -> bool:
        """Writes all files in project (excluding those in .gitignore) to zip file

        # Arguments
        filepath: String, target file
        opener: Optional file opener object. Defaults to built-in `open`
        exclude: Optional list of gitignore-style rules to exclude files from the backup

        # Returns
        True if backup of all files was sucessful
        """
        import igittigitt
        from fs.zipfs import WriteZipFS

        if opener is None:
            opener = open

        msg(
            f"\nCreating code backup ...",
            color="green",
        )

        # Get stream in the PyFS to create zip file with
        zip_stream = opener(filepath, "wb")

        status = True
        counter = 0
        t = time.time()

        # Parse .gitignore
        class GitIgnoreParser(igittigitt.IgnoreParser):
            def match(self, file_path) -> bool:
                # overwrite parent to prevent premature symlink resolution
                str_file_path = os.path.abspath(file_path)
                is_file = os.path.isfile(str_file_path)
                match = self._match_rules(str_file_path, is_file)
                if match:
                    match = self._match_negation_rules(str_file_path)
                return match

        gitignore = GitIgnoreParser()
        gitignore.parse_rule_files(self.directory_path)

        if exclude is not None:
            for rule in exclude:
                gitignore.add_rule(rule, self.directory_path)

        with WriteZipFS(file=zip_stream) as zip_fs:
            for folder, subfolders, filenames in os.walk(
                self.directory_path, followlinks=True
            ):

                # Remove subfolders that are listed in .gitignore, so they won't be explored later
                subfolders[:] = [
                    sub
                    for sub in subfolders
                    if sub != ".git"
                    and not gitignore.match(os.path.join(folder, sub))
                ]

                for file_name in filenames:
                    # Find absolute path of file for .gitignore checking
                    abspath_file = os.path.join(folder, file_name)

                    # Ignore binary file types
                    file_type = mimetypes.guess_type(abspath_file)[0]
                    if (
                        file_type is None or not file_type.startswith("text/")
                    ) and not file_name.endswith(".yaml"):
                        continue

                    if gitignore.match(abspath_file):
                        # Skip file if it is listed in .gitignore
                        continue

                    # Get relative paths (which will be replicated in zip)
                    relpath_folder = os.path.relpath(
                        folder, self.directory_path
                    )
                    relpath_file = os.path.join(relpath_folder, file_name)

                    # Make directories in zip if necessary
                    if not zip_fs.exists(relpath_folder):
                        # Need to use makedirs (not makedir) in case file in nested folders
                        zip_fs.makedirs(relpath_folder)

                    # Read file contents
                    try:
                        file_content = open(
                            os.path.join(self.directory_prefix, relpath_file),
                        ).read()
                    except UnicodeDecodeError as ex:
                        msg(
                            f"Code backup failed for file {relpath_file}. {exception_to_str(ex)}",
                            color="fail",
                        )
                        status = False
                        continue

                    # Add file to zip
                    zip_fs.writetext(relpath_file, file_content)

                    if echo is True:
                        msg(relpath_file, color="green")

                    counter += 1

            # Add zip to PyFS
            zip_fs.write_zip()

        took = pendulum.duration(seconds=time.time() - t).in_words()
        msg(
            f" >>> Code backup of {counter} files completed in {took}\n",
            color="green",
        )

        return status

    def get_code_version(self):
        return {
            "id": get_root_commit(self.config_filepath),
            "project": get_commit(self.config_filepath),
            "vendor": {
                vendor: get_commit(
                    os.path.join(
                        self.directory_path, "vendor", vendor, "machinable.yaml"
                    )
                )
                for vendor in [next(iter(d)) for d in self.get_config()["+"]]
            },
        }

    def get_diff(self):
        return (
            get_diff(self.config_filepath, search_parent_directories=False)
            or ""
        )

    def reload_imports(self):
        vendor_caching = self._vendor_caching
        self._vendor_caching = False
        self.parse_imports()
        self._vendor_caching = vendor_caching

    def parse_imports(self, cached=None):
        if cached is None:
            cached = self.get_root()._vendor_caching

        config = self.get_config()["+"]

        if len(config) == 0:
            return {"components": None, "mixins": None}

        import_names = fetch_imports(self, config)

        imports = {"components": {}, "mixins": {}}

        for import_name in import_names:
            # use pickled import cache if existing
            import_cache = os.path.join(
                self.directory_path, "vendor", ".cache", import_name + ".p"
            )
            if cached and os.path.isfile(import_cache):
                with open(import_cache, "rb") as f:
                    import_config = pickle.load(f)
            else:
                # use project abstraction to resolve imports
                import_project = Project(
                    os.path.join(self.directory, "vendor", import_name),
                    parent=self,
                    schema_validation=self._schema_validation,
                )

                if not import_project.has_config_file():
                    continue

                import_config = import_project.parse_config()

                # write pickle-cache
                os.makedirs(os.path.dirname(import_cache), exist_ok=True)
                with open(import_cache, "wb") as f:
                    pickle.dump(import_config, f)

            # merge into global imports collection
            for section in ("components", "mixins"):
                for k, v in import_config[section].items():
                    imports[section][import_name + "." + k] = v

        return imports

    def parse_config(self, reference=True, cached=None):
        if cached is None:
            cached = False

        if not cached and self._parsed_config is not None:
            return self._parsed_config

        config = self.get_config(cached)

        imports = self.parse_imports()

        if reference:
            # pass in the full config as $ root reference
            reference = config

        collections = [k for k in config.keys() if k.startswith("components")]
        components = {}
        top_level_alias = {}
        for collection in collections:
            if config[collection] is None:
                continue

            scope = collection.replace("components:", "")
            if scope.find("=") != -1:
                scope, alias = scope.split("=")
                if alias in top_level_alias:
                    raise ValueError(
                        f"Alias '{alias}' of 'components:{collection}' is ambiguous"
                    )
            else:
                alias = scope
                if alias in top_level_alias:
                    raise ValueError(
                        f"'components:{collection}' already exists"
                    )

            if not is_valid_variable_name(alias):
                raise ValueError(
                    f"Alias '{alias}' of 'components:{collection}' is not a valid Python variable name"
                )

            top_level_alias[alias] = collection

            parse_module_list(
                config[collection],
                scope=scope if scope != "components" else None,
                kind="component",
                modules=components,
                imports=imports["components"],
                reference=reference,
                import_prefix=self.import_prefix,
                auto_alias=scope if scope != "components" else None,
            )

        mixins = parse_module_list(
            config.get("mixins"),
            scope=None,
            kind="mixin",
            imports=[imports["mixins"], imports["components"]],
            reference=reference,
            import_prefix=self.import_prefix,
            auto_alias="mixins",
        )

        self._parsed_config = {
            "imports": imports,
            "mixins": mixins,
            "components": components,
            # globals
            "_evaluate": config["_evaluate"],
        }

        return self._parsed_config

    def has_component(self, name: str, or_fail=False) -> bool:
        data = self.parse_config()

        for kind in ["imports", "mixins", "components"]:
            if name in data[kind]:
                return True

        if not or_fail:
            return False

        # todo: display richer error message with list of available components
        raise ValueError(f"Project {self.directory} has no component '{name}'")

    def parse_component(self, name: str, config=None, flags=None) -> dict:
        data = self.parse_config()

        if name not in data["components"]:
            raise ValueError(
                f"Component '{name}' not found. Is it registered in the machinable.yaml?\n"
                "Registered components:\n\t- "
                + "\n\t- ".join(
                    filter(lambda x: x != "@", data["components"].keys())
                )
            )

        # de-reference
        config = copy.deepcopy(data["components"][name])

        # flags
        config["flags"]["__version"] = copy.deepcopy(flags)

        if not isinstance(flags, (list, tuple)):
            flags = [flags]

        for f in flags:
            if f is None:
                continue
            config["flags"] = update_dict(config["flags"], f)

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
            config["config"]["_evaluate"] = data["_evaluate"]

        # un-alias
        origin = data["components"]["@"][name]

        # collect versions
        versions = []

        version_updates = []
        for update in versions:
            arguments = update["arguments"]

            if not isinstance(arguments, tuple):
                arguments = (arguments,)

            version_updates.extend(
                [
                    a["components"]
                    if isinstance(a["components"], tuple)
                    else (a["components"],)
                    for a in arguments
                    if "components" in a
                ]
            )

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
                    if isinstance(m, str):
                        m = dict(name=m, overrides=True)
                    if isinstance(m, dict):
                        m["overrides"] = m.get("overrides", True)
                    merged.append(m)
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
                        data["imports"]["mixins"][vendor + "." + mixin["name"]]
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
                    + data["imports"]["mixins"][vendor + ".@"].get(
                        mixin["name"]
                    )
                )
            else:
                if "vendor" in mixin:
                    try:
                        mixin_args = copy.deepcopy(
                            data["imports"]["mixins"][
                                mixin["vendor"] + "." + mixin["name"]
                            ]
                        )
                        mixin_spec["origin"] = (
                            "+."
                            + mixin["vendor"]
                            + "."
                            + data["imports"]["mixins"][mixin["vendor"] + ".@"][
                                mixin["name"]
                            ]
                        )
                    except KeyError:
                        raise KeyError(
                            f"Dependent mixin '{mixin['vendor'] + '.' + mixin['name']}' not found."
                        )
                else:
                    try:
                        mixin_args = copy.deepcopy(
                            data["mixins"][mixin["name"]]
                        )
                        mixin_spec["origin"] = data["mixins"]["@"].get(
                            mixin["name"]
                        )
                    except KeyError:
                        raise KeyError(
                            f"Mixin '{mixin['name']}' not found. Is it registered in the machinable.yaml?\n"
                            "Registered mixins:\n\t- "
                            + "\n\t- ".join(
                                filter(
                                    lambda x: x != "@",
                                    data["mixins"].keys(),
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

                    if name.startswith("_") and name.endswith("_"):
                        try:
                            return copy.deepcopy(
                                data["mixins"][name[1:-1]]["config"]
                            )
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
                preserve_schema=self._schema_validation,
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

    def __repr__(self) -> str:
        return f"Project({self.directory})"
