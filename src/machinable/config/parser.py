import importlib
import inspect
import regex

from .config import parse_mixins
from .mapping import _reserved_keys, _used_keys
from ..utils.strings import is_valid_variable_name
from ..utils.dicts import get_or_fail, update_dict, read_path_dict
from ..utils.formatting import msg


class ModuleClass(object):

    def __init__(self, module_name, args=None, baseclass=None):
        self.module_name = module_name
        self.args = args
        self.baseclass = baseclass

    def load(self, instantiate=True, default=None):
        module_class = default
        try:
            module = importlib.import_module(self.module_name)

            for candidate, class_ in inspect.getmembers(module, inspect.isclass):
                if self.baseclass is not None and not issubclass(class_, self.baseclass):
                    continue

                if class_.__module__ == self.module_name:
                    module_class = class_
                    break

            if module_class is None:
                raise AttributeError(f"Could not load module class from module '{self.module_name}'. "
                                     f"Make sure the module contains a class that inherits from "
                                     f"the baseclass 'machinable.{self.baseclass.__name__}'")
        except ImportError as e:
            if default is None:
                raise ImportError(f"Could not import module '{self.module_name}' "
                                  f"that is specified in the machinable.yaml. Error message: \"{str(e)}\". "
                                  f"If the module is a directory, consider creating an __init__.py.")

        if not instantiate:
            return module_class

        if self.args is None:
            return module_class()

        return module_class(**self.args)

    def __call__(self, *args, **kwargs):
        class_ = self.load(instantiate=False)
        return class_(*args, **kwargs)

    def __repr__(self):
        return f'<machinable.ModuleClass(module_name={self.module_name}, args={self.args} baseclass={self.baseclass})>'


def parse_reference(reference, root, this, wrapped=False):
    result = regex.sub(r'''
    (?<rec> #capturing group rec
     \[ #open parenthesis
     (?: #non-capturing group
      [^\[\]]++ #anyting but parenthesis one or more times without backtracking
      | #or
       (?&rec) #recursive substitute of group rec
     )*
     \] #close parenthesis
    )
    ''', lambda m: parse_reference(m.group()[1:-1], root, this, wrapped=True), reference, flags=regex.VERBOSE)

    if result.startswith('$.'):
        try:
            r = read_path_dict(root, result[2:])
        except KeyError:
            raise KeyError(f'Could not resolve global reference {result}')
    elif result.startswith('$self.'):
        try:
            r = read_path_dict(this, result[6:])
        except KeyError:
            raise KeyError(f'Could not resolve local reference {result}')
    else:
        r = result

    if wrapped:
        return '[' + str(r) + ']'

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
                    raise ValueError(f"'{k}' is a reserved name and cannot be used in machinable configuration keys")
                if k in _used_keys:
                    msg(f"The configuration key '{k}' is a build-in mapping name and should not be used"
                        f"in machinable configuration keys as any dot-notation will become ambiguous.",
                        level='warning', color='fail')

            config[k] = parse_references(v, root, this, validate)
        return config

    if isinstance(config, str) and (config.startswith('$.') or config.startswith('$self.')):
        return parse_reference(config, root, this)

    return config


def auto_scope(key, scope):
    if key is None:
        return None

    if scope is None:
        return key

    # ignore imports
    if key.startswith('+.'):
        return key

    # skip if already scoped
    if key.startswith(scope + '.'):
        return key

    return scope + '.' + key


def parse_module_list(collection, scope, baseclass,
                      modules=None, imports=None, reference=None, import_prefix=None, auto_alias=None):
    if collection is None:
        return {}

    if modules is None:
        modules = {}

    if imports is None:
        imports = {}

    if '@' not in modules:
        modules['@'] = {}

    if isinstance(collection, (list, tuple)):
        for element in collection:
            modules.update(parse_module_list(element, scope,
                                             baseclass, modules, imports, reference, import_prefix, auto_alias))

        return modules

    for module, args in collection.items():

        # copy the default import prefix
        module_import_prefix = import_prefix

        # add scope to module
        module = auto_scope(module, scope)

        # parse alias
        if module.find('=') != -1:
            module, alias = module.split('=')
        else:
            alias = None

        # parse parent
        parent = None
        if module.find('^') != -1:
            module, parent = module.split('^')

            if parent.startswith('+.'):
                inherited = get_or_fail(imports, parent.replace('+.', ''),
                                        error="Dependency '^+.{}'  not found. Did you register it under '+'?")

                if '_mixins_' in inherited['args']:
                    inherited['args']['_mixins_'] = [{'name': m['name'],
                                                      'vendor': parent.replace('+.', '').split('.')[0]}
                                                     for m in parse_mixins(inherited['args']['_mixins_'])]
            else:
                inherited = get_or_fail(modules, auto_scope(parent, scope),
                                        error="Parent module '^{}' of " + module + " does not exist.")

            # inherit the parent's config
            args = update_dict(inherited['args'], args, copy=True)
            # if no module name specified, use same as parent
            if module == '':
                module = inherited['module']
                # disable import path as import modules already incorporate import prefixes
                module_import_prefix = None

        # module specification
        if args is None:
            args = {}

        # if import module, check if existing
        if module.startswith('+.'):
            import_config = get_or_fail(imports, module.replace('+.', ''),
                                        error="Dependency '+.{}' not found. Did you register it under '+'?")

            d = import_config['args'].copy()
            if import_config['args'].get('_mixins_'):
                d['_mixins_'] = [{'name': m['name'], 'vendor': module.replace('+.', '').split('.')[0]}
                                 for m in parse_mixins(d['_mixins_'])]

            # inherit the imports' config
            args = update_dict(d, args, copy=True)

        # parse references
        if reference is not None:
            args = parse_references(args, root=reference, this=args, validate=True)

        # get actual module import path location
        module_import = module.replace('+.', 'vendor.')
        if module_import_prefix:
            module_import = module_import_prefix + '.' + module_import

        if module in modules:
            cls = modules[module]['class']
        else:
            cls = ModuleClass(module_import, baseclass=baseclass)

        modules[module] = {
            'module': module_import,
            'class': cls,
            'args': args
        }

        # add alias lookup identity
        modules['@'][module] = module

        # add module alias
        scoped_alias = auto_scope(alias, scope)
        if scoped_alias is not None and scoped_alias != module:
            if not is_valid_variable_name(alias):
                raise ValueError(f"Alias '{alias}' of '{module}' is not a valid Python variable name")
            if alias in modules:
                raise ValueError(f"Alias '{alias}' of '{module}' is ambiguous")
            modules['@'][scoped_alias] = module
            modules[scoped_alias] = modules[module]

        # automatic alias
        aliased = module
        if auto_alias:
            prefix = auto_alias + '.'
            if aliased.startswith(prefix):
                aliased = aliased[len(prefix):]
                if aliased not in modules:
                    modules['@'][aliased] = module
                    modules[aliased] = modules[module]

        # make sure mixin have valid attribute name if not aliased
        if baseclass.__name__ == 'Mixin' and not is_valid_variable_name(module):
            if not (is_valid_variable_name(alias) or is_valid_variable_name(aliased)):
                raise ValueError(f"Mixin '{module}' has to be a valid Python variable name, please provide an alias"
                                 f" e.g. '{module}=my_alias'")

    return modules
