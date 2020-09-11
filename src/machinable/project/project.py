import copy
import importlib
import inspect
import mimetypes
import os
import pickle
import sys

from ..config.loader import from_callable as load_config_from_callable
from ..config.loader import from_file as load_config_file
from ..config.loader import from_string as load_config_from_string
from ..config.parser import parse_module_list
from ..core import Component as BaseComponent
from ..core import Mixin as BaseMixin
from ..core.component import FunctionalComponent
from ..core.settings import get_settings
from ..registration import Registration
from ..utils.dicts import update_dict
from ..utils.formatting import msg
from ..utils.traits import Jsonable
from ..utils.utils import is_valid_module_path, is_valid_variable_name
from ..utils.vcs import get_commit, get_diff, get_root_commit
from .manager import fetch_imports


class Project(Jsonable):
    def __init__(self, options=None, parent=None):
        if callable(options):
            if not inspect.isclass(options):
                options = FunctionalComponent(options)
            options = {"default_component": options}
        if isinstance(options, str):
            options = {"directory": options}

        self.options = update_dict(
            {
                "directory": os.getcwd(),
                "config_file": "machinable.yaml",
                "config": None,
                "vendor_caching": get_settings()["cache"].get("imports", False),
                "default_component": None,
                "name": None,
            },
            options,
        )
        self.parent = parent

        self.config = None
        self.parsed_config = None
        self._registration = None
        self._name_exception = None

        if os.path.exists(self.directory_path) and self.directory_path not in sys.path:
            if self.is_root():
                sys.path.insert(0, self.directory_path)
            else:
                sys.path.append(self.directory_path)

    def __repr__(self):
        r = "Project"
        r += f" <{self.directory_path}>"
        if self.name is not None:
            r += f" ({self.name})"
        return r

    def __str__(self):
        return self.__repr__()

    @classmethod
    def create(cls, args=None):
        """Creates a project instance"""
        if isinstance(args, cls):
            return args

        if args is None:
            return cls()

        if callable(args):
            return cls({"default_component": args})

        if isinstance(args, str):
            return cls({"directory": args})

        if isinstance(args, tuple):
            return cls(*args)

        raise ValueError(f"Invalid project: {args}")

    @property
    def name(self):
        if self.options["name"] is None:
            self.options["name"] = self.get_config().get("name", None)

        if self.options["name"] is not None and not is_valid_module_path(
            self.options["name"]
        ):
            if not self._name_exception:
                msg(
                    f"Invalid project name: '{self.options['name']}'.\n"
                    f"Name must be a valid Python name or path, e.g. `valid_name.example`.",
                    level="warning",
                    color="fail",
                )
                self._name_exception = True
            self.options["name"] = None

        return self.options["name"]

    @property
    def config_filepath(self):
        return os.path.join(self.options["directory"], self.options["config_file"])

    @property
    def directory_path(self):
        return os.path.abspath(self.options["directory"])

    @property
    def directory_prefix(self):
        if self.options["directory"] == ".":
            return ""

        return self.options["directory"]

    @property
    def vendor_directory(self):
        return os.path.join(self.options["directory"], "vendor")

    @property
    def vendor_path(self):
        return os.path.abspath(self.vendor_directory)

    @property
    def import_prefix(self):
        # find relative address to target import class
        prefix = os.path.relpath(self.directory_path, os.getcwd())

        if prefix == ".":
            return None

        # todo: support for relative directory that contain ../

        return prefix.replace("/", ".")

    @property
    def default_component(self):
        return self.options["default_component"]

    @default_component.setter
    def default_component(self, value):
        if callable(value) and not inspect.isclass(value):
            value = FunctionalComponent(value)

        self.options["default_component"] = value

    def serialize(self):
        return copy.deepcopy(self.options)

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
            os.path.join(self.directory_path, self.options["config_file"])
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
        if self._registration is None:
            self._registration = Registration.get()

        return self._registration

    def get_config(self, cached="auto"):
        if cached == "auto":
            # todo: reliably compute hash including vendors to determine changes
            cashed = False

        if cached is not False and self.config is not None:
            return self.config

        # load config
        self.parsed_config = None
        if self.options["config"] is not None:
            # direct specification
            if isinstance(self.options["config"], str):
                self.config = load_config_from_string(self.options["config"])
            else:
                self.config = self.options["config"]
            if not isinstance(self.config, dict):
                raise ValueError(
                    f"Invalid project configuration: '{self.options['options']}'"
                )
        # elif isinstance(self.default_component, FunctionalComponent):
        #     config = load_config_from_callable(self.default_component.function)
        #     if config is None:
        #         config = load_config_file(self.config_filepath, default={})
        #     self.config = config
        elif self.has_config_file():
            self.config = load_config_file(self.config_filepath, default={})
        else:
            self.config = {}

        # validate and set defaults
        self.config.setdefault("_evaluate", True)

        self.config.setdefault("+", [])
        assert isinstance(
            self.config["+"], (tuple, list)
        ), "Invalid import definition: " + str(self.config["+"])

        self.config.setdefault("mixins", [])

        return self.config

    def backup_source_code(self, filepath="code.zip", opener=None) -> bool:
        """Writes all files in project (excluding those in .gitignore) to zip file

        # Arguments
        filepath: String, target file
        opener: Optional file opener object. Defaults to built-in `open`

        # Returns
        True on completion
        """
        import gitignore_parser
        from fs.zipfs import WriteZipFS

        if opener is None:
            opener = open

        # Get stream in the PyFS to create zip file with
        zip_stream = opener(filepath, "wb")

        # Get object to test whether files are in .gitignore
        try:
            gitignore = gitignore_parser.parse_gitignore(
                os.path.join(self.directory_prefix, ".gitignore")
            )
        except FileNotFoundError:

            def gitignore(*args, **kwargs):
                return False

        with WriteZipFS(file=zip_stream) as zip_fs:
            for folder, subfolders, filenames in os.walk(self.directory_path):

                # Remove subfolders that are listed in .gitignore, so they won't be explored later
                subfolders[:] = [
                    sub
                    for sub in subfolders
                    if sub != ".git" and not gitignore(os.path.join(folder, sub))
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

                    if gitignore(abspath_file):
                        # Skip file if it is listed in .gitignore
                        continue

                    # Get relative paths (which will be replicated in zip)
                    relpath_folder = os.path.relpath(folder, self.directory_path)
                    relpath_file = os.path.join(relpath_folder, file_name)

                    # Make directories in zip if necessary
                    if not zip_fs.exists(relpath_folder):
                        # Need to use makedirs (not makedir) in case file in nested folders
                        zip_fs.makedirs(relpath_folder)

                    # Read file contents
                    file_content = open(
                        os.path.join(self.directory_prefix, relpath_file), "r"
                    ).read()

                    # Add file to zip
                    zip_fs.writetext(relpath_file, file_content)

            # Add zip to PyFS
            zip_fs.write_zip()

        return True

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
        return get_diff(self.config_filepath) or ""

    def reload_imports(self):
        vendor_caching = self.options["vendor_caching"]
        self.options["vendor_caching"] = False
        self.parse_imports()
        self.options["vendor_caching"] = vendor_caching

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
                    os.path.join(self.options["directory"], "vendor", import_name),
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

    def parse_config(self, reference=True, cached="auto"):
        if cached == "auto":
            # todo: detect from hash
            cached = False

        if not cached and self.parsed_config is not None:
            return self.parsed_config

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
                    raise ValueError(f"'components:{collection}' already exists")

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

        self.parsed_config = {
            "imports": imports,
            "mixins": mixins,
            "components": components,
            # globals
            "_evaluate": config["_evaluate"],
        }

        return self.parsed_config
