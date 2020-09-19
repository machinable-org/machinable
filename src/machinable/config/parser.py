import importlib
import inspect

import regex
from flatten_dict import unflatten

from ..registration import Registration
from ..utils.dicts import get_or_fail, read_path_dict, update_dict
from ..utils.formatting import exception_to_str, msg
from ..utils.utils import is_valid_variable_name
from .mapping import _reserved_keys, _used_keys


class ModuleClass:
    def __init__(self, module_name, args=None, baseclass=None, allow_overrides=True):
        self.module_name = module_name
        self.args = args
        self.baseclass = baseclass
        self.default_class = None
        self.allow_overrides = allow_overrides

    def load(self, instantiate=True, default=None):
        if default is None:
            default = self.default_class

        if self.allow_overrides:
            registration = Registration.get()
            on_before_component_import = registration.on_before_component_import(
                module=self.module_name, baseclass=self.baseclass, default=default
            )
            if on_before_component_import is not None:
                return on_before_component_import

        module_class = None
        try:
            module = importlib.import_module(self.module_name)
            try:
                # reload if we are in interactive environments like jupyter
                get_ipython().__class__.__name__
                importlib.reload(module)
            except NameError:
                pass

            for candidate, class_ in inspect.getmembers(module, inspect.isclass):
                if self.baseclass is not None and not issubclass(
                    class_, self.baseclass
                ):
                    continue

                if class_.__module__ == self.module_name:
                    module_class = class_
                    break

            if module_class is None:
                module_class = AttributeError(
                    f"Could not load module class from module '{self.module_name}'. "
                    f"Make sure the module contains a class that inherits from "
                    f"the baseclass 'machinable.{self.baseclass.__name__}'"
                )
        except ImportError as e:
            if default is None:
                module_class = ImportError(
                    f"Could not import module '{self.module_name}' "
                    f"that is specified in the machinable.yaml. "
                    f"The following exception occurred: {exception_to_str(e)}. "
                    f"If the module is a directory, consider creating an __init__.py."
                )

        if self.allow_overrides:
            on_component_import = registration.on_component_import(
                component_candidate=module_class,
                module=self.module_name,
                baseclass=self.baseclass,
                default=default,
            )
            if on_component_import is not None:
                return on_component_import

        if isinstance(module_class, (ImportError, AttributeError)):
            raise module_class

        if module_class is None:
            module_class = default

        if not instantiate:
            return module_class

        if self.args is None:
            return module_class()

        return module_class(**self.args)

    def name(self):
        class_ = self.load(instantiate=False)
        return class_.__name__

    def __call__(self, *args, **kwargs):
        class_ = self.load(instantiate=False)
        return class_(*args, **kwargs)

    def __repr__(self):
        return f"<machinable.config.ModuleClass(module_name={self.module_name}, args={self.args} baseclass={self.baseclass})>"


def parse_mixins(config, valid_only=False):
    if config is None:
        return []

    if isinstance(config, str):
        config = [config]

    if not isinstance(config, (tuple, list)):
        raise ValueError(f"_mixins_ has to be a list. '{config}' given.")

    mixins = []
    for mixin in config:
        if isinstance(mixin, str):
            mixin = dict(name=mixin)

        if "name" not in mixin:
            raise ValueError(f"Mixin definition '{mixin}' must specify a name")

        if "attribute" not in mixin:
            mixin["attribute"] = (
                "_" + mixin["name"].replace("+.", "").replace(".", "_") + "_"
            )

        mixin["valid_attribute"] = is_valid_variable_name(mixin["attribute"])

        if valid_only and not mixin["valid_attribute"]:
            continue

        mixins.append(mixin)

    return mixins


def parse_reference(reference, root, this, wrapped=False):
    result = regex.sub(
        r"""
    (?<rec> #capturing group rec
     \[ #open parenthesis
     (?: #non-capturing group
      [^\[\]]++ #anyting but parenthesis one or more times without backtracking
      | #or
       (?&rec) #recursive substitute of group rec
     )*
     \] #close parenthesis
    )
    """,
        lambda m: parse_reference(m.group()[1:-1], root, this, wrapped=True),
        reference,
        flags=regex.VERBOSE,
    )

    if result.startswith("$."):
        try:
            r = read_path_dict(root, result[2:])
        except KeyError:
            raise KeyError(f"Could not resolve global reference {result}")
    elif result.startswith("$self."):
        try:
            r = read_path_dict(this, result[6:])
        except KeyError:
            raise KeyError(f"Could not resolve local reference {result}")
    else:
        r = result

    if wrapped:
        return "[" + str(r) + "]"

    return r


def parse_references(config, root=None, this=None, validate=False):
    """
    Preprocesses the configuration to resolve internal references

    - resolve $.x paths
    - resolves $self.y
    - resolves $.x[0]
    - resolves $.x[$.y[0]
    """
    if root is None:
        root = config

    if isinstance(config, list):
        return [parse_references(v, root, this, validate) for v in config]

    if isinstance(config, tuple):
        return (parse_references(v, root, this, validate) for v in config)

    if isinstance(config, dict):
        for k, v in config.items():
            if validate:
                # error if reserved keywords are being used
                if k in _reserved_keys:
                    raise ValueError(
                        f"'{k}' is a reserved name and cannot be used in machinable configuration keys"
                    )
                if k in _used_keys:
                    msg(
                        f"The configuration key '{k}' is a build-in mapping name and should not be used "
                        f"in machinable configuration keys since dot-notation will become ambiguous.",
                        level="warning",
                        color="fail",
                    )

            config[k] = parse_references(v, root, this, validate)
        return config

    if isinstance(config, str) and (
        config.startswith("$.") or config.startswith("$self.")
    ):
        return parse_reference(config, root, this)

    return config


def auto_scope(key, scope):
    if key is None:
        return None

    if scope is None:
        return key

    # ignore imports
    if key.startswith("+."):
        return key

    # skip if already scoped
    if key.startswith(scope + "."):
        return key

    return scope + "." + key


def parse_module_list(
    collection,
    scope,
    baseclass,
    modules=None,
    imports=None,
    reference=None,
    import_prefix=None,
    auto_alias=None,
):
    if collection is None:
        return {}

    if modules is None:
        modules = {}

    if imports is None:
        imports = {}

    if "@" not in modules:
        modules["@"] = {}

    if isinstance(collection, (list, tuple)):
        for element in collection:
            modules.update(
                parse_module_list(
                    element,
                    scope,
                    baseclass,
                    modules,
                    imports,
                    reference,
                    import_prefix,
                    auto_alias,
                )
            )

        return modules

    for module, args in collection.items():

        if isinstance(args, dict) and args.get("_unflatten", True):
            args = unflatten(args, splitter="dot")

        # copy the default import prefix
        module_import_prefix = import_prefix

        # add scope to module
        module = auto_scope(module, scope)

        # parse alias
        if module.find("=") != -1:
            module, alias = module.split("=")
        else:
            alias = None

        # parse parent
        parent = None
        if module.find("^") != -1:
            module, parent = module.split("^")

            if parent.startswith("+."):
                inherited = get_or_fail(
                    imports,
                    parent.replace("+.", ""),
                    error="Dependency '^+.{}'  not found. Did you register it under '+'?",
                )

                if "_mixins_" in inherited["args"]:
                    inherited["args"]["_mixins_"] = [
                        {
                            "name": m["name"],
                            "vendor": parent.replace("+.", "").split(".")[0],
                        }
                        for m in parse_mixins(inherited["args"]["_mixins_"])
                    ]
            else:
                if auto_scope(parent, scope) in modules:
                    # use immediate parent in current scope
                    inherited = modules[auto_scope(parent, scope)]
                elif parent in modules:
                    # otherwise fall back on global scope
                    inherited = modules[parent]
                else:
                    raise KeyError(
                        f"Parent module '^{parent}' of {module} does not exist."
                    )

            # inherit the parent's config
            args = update_dict(inherited["args"], args, copy=True)
            # if no module name specified, use same as parent
            if module == "":
                module = inherited["module"]
                # disable import path as import modules already incorporate import prefixes
                module_import_prefix = None

        # module specification
        if args is None:
            args = {}

        # if import module, check if existing
        if module.startswith("+."):
            import_config = get_or_fail(
                imports,
                module.replace("+.", ""),
                error="Dependency '+.{}' not found. Did you register it under '+'?",
            )

            d = import_config["args"].copy()
            if import_config["args"].get("_mixins_"):
                d["_mixins_"] = [
                    {
                        "name": m["name"],
                        "vendor": module.replace("+.", "").split(".")[0],
                    }
                    for m in parse_mixins(d["_mixins_"])
                ]

            # inherit the imports' config
            args = update_dict(d, args, copy=True)

        # parse references
        if reference is not None:
            args = parse_references(args, root=reference, this=args, validate=True)

        # get actual module import path location
        module_import = module.replace("+.", "vendor.")
        if module_import_prefix:
            module_import = module_import_prefix + "." + module_import

        if module in modules:
            cls = modules[module]["class"]
        else:
            cls = ModuleClass(module_import, baseclass=baseclass)

        modules[module] = {"module": module_import, "class": cls, "args": args}

        # add alias lookup identity
        modules["@"][module] = module

        # add module alias
        scoped_alias = auto_scope(alias, scope)
        if scoped_alias is not None and scoped_alias != module:
            if not is_valid_variable_name(alias):
                raise ValueError(
                    f"Alias '{alias}' of '{module}' is not a valid Python variable name"
                )
            if alias in modules:
                raise ValueError(f"Alias '{alias}' of '{module}' is ambiguous")
            modules["@"][scoped_alias] = module
            modules[scoped_alias] = modules[module]

        # automatic alias
        aliased = module
        if auto_alias:
            prefix = auto_alias + "."
            if aliased.startswith(prefix):
                aliased = aliased[len(prefix) :]
                if aliased not in modules:
                    modules["@"][aliased] = module
                    modules[aliased] = modules[module]

        # make sure mixin have valid attribute name if not aliased
        if baseclass.__name__ == "Mixin" and not is_valid_variable_name(module):
            if not (is_valid_variable_name(alias) or is_valid_variable_name(aliased)):
                raise ValueError(
                    f"Mixin '{module}' has to be a valid Python variable name, please provide an alias"
                    f" e.g. '{module}=my_alias'"
                )

    return modules
