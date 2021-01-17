from typing import Optional

import copy
import inspect
import mimetypes
import os
import pickle
import sys
import time

import pendulum
from machinable.component.component import Component as BaseComponent
from machinable.component.mixin import Mixin as BaseMixin
from machinable.config.interface import ConfigInterface
from machinable.config.loader import from_callable as load_config_from_callable
from machinable.config.loader import from_file as load_config_file
from machinable.config.loader import from_string as load_config_from_string
from machinable.config.parser import parse_module_list
from machinable.project.manager import fetch_imports
from machinable.settings import get_settings
from machinable.utils.dicts import update_dict
from machinable.utils.formatting import exception_to_str, msg
from machinable.utils.importing import import_module_from_directory
from machinable.utils.traits import Discoverable, Jsonable
from machinable.utils.utils import is_valid_module_path, is_valid_variable_name
from machinable.utils.vcs import get_commit, get_diff, get_root_commit


class Project(Jsonable, Discoverable):
    def __init__(self, directory: Optional[str] = None, parent=None):
        if directory is None:
            directory = os.getcwd()
        self.directory: str = directory
        self.parent = parent

        self.config_file: str = "machinable.yaml"
        self.vendor_caching = get_settings()["cache"].get("imports", False)

        self._config = None
        self._parsed_config = None

        if (
            os.path.exists(self.directory_path)
            and self.directory_path not in sys.path
        ):
            if self.is_root():
                sys.path.insert(0, self.directory_path)
            else:
                sys.path.append(self.directory_path)

    def configuration(self) -> ConfigInterface:
        return ConfigInterface(self.parse_config())

    def parse_experiment(self, experiment):
        return self.configuration().experiment(experiment)

    def __repr__(self):
        r = "Project"
        r += f" <{self.directory_path}>"
        return r

    def __str__(self):
        return self.__repr__()

    @property
    def config_filepath(self):
        return os.path.join(self.directory, self.config_file)

    @property
    def directory_path(self):
        return os.path.abspath(self.directory)

    def path(self, *append):
        return os.path.join(self.directory_path, *append)

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
        prefix = os.path.relpath(self.directory_path, os.getcwd())

        if prefix == ".":
            return None

        if "../" in prefix:
            # Attempted import beyond project top-level. Consider changing your current working directory.
            return None

        return prefix.replace("/", ".")

    def serialize(self):
        return {
            "directory": self.directory,
        }

    @classmethod
    def unserialize(cls, serialized):
        return cls(serialized)

    def is_root(self):
        return self.parent is None

    def get_root(self):
        if self.is_root():
            return self

        p = self.parent
        while not p.is_root():
            p = p.parent

        return p

    def has_config_file(self):
        return os.path.isfile(
            os.path.join(self.directory_path, self.config_file)
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
        vendor_caching = self.vendor_caching
        self.vendor_caching = False
        self.parse_imports()
        self.vendor_caching = vendor_caching

    def parse_imports(self, cached=None):
        if cached is None:
            cached = self.get_root().options["vendor_caching"]

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
                baseclass=BaseComponent,
                modules=components,
                imports=imports["components"],
                reference=reference,
                import_prefix=self.import_prefix,
                auto_alias=scope if scope != "components" else None,
            )

        mixins = parse_module_list(
            config.get("mixins"),
            scope=None,
            baseclass=BaseMixin,
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
