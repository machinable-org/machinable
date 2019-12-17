import copy

import yaml

from .parser import ModuleClass
from ..engine.functional import FunctionalCallback
from .config import parse_mixins
from ..utils.dicts import update_dict
from ..task import TaskComponent


def collect_updates(version):
    collection = []
    for update in version:
        arguments = update['arguments']

        if not isinstance(arguments, tuple):
            arguments = (arguments, )

        collection.extend(arguments)

    return collection


class ConfigInterface:

    def __init__(self, parsed_config, version=None, default_class=None):
        self.data = parsed_config
        if version is None:
            version = []
        self.version = version
        self.default_class = default_class

    def _get_version(self, name, config, current=None):
        # from yaml string
        if not name.startswith('~') and not (name.startswith('_') and name.endswith('_')):
            return yaml.load(name)

        # from mixin
        if name.startswith('_') and name.endswith('_'):
            try:
                return copy.deepcopy(self.data['mixins'][name[1:-1]]['args'])
            except KeyError:
                raise KeyError(f"Mixin '{name}' not available.\n"
                               f"Did you register it under 'mixins'?\n")

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

        raise KeyError(f"Version '{name}' could not be found.\n"
                       f"Available versions: {[f for f in config.keys() if f.startswith('~')]}\n")

    def get_component(self, name, version=None, flags=None):
        if name is None:
            return None

        if name not in self.data['components']:
            raise ValueError(f"Component '{name}' not found. Is it registered in the machinable.yaml?")

        if isinstance(self.default_class, FunctionalCallback):
            self.data['components'][name]['class'] = self.default_class

        # load lazy modules
        if isinstance(self.data['components'][name]['class'], ModuleClass):
            self.data['components'][name]['class'] = \
                self.data['components'][name]['class'].load(instantiate=False, default=self.default_class)

        # de-reference
        config = copy.deepcopy(self.data['components'][name])

        # flags
        config['flags'] = flags if flags is not None else {}

        # name
        config['name'] = name

        # introspection
        config['flags']['NAME'] = name
        config['flags']['MODULE'] = config['module']

        # carry over global evaluation config
        if '_evaluate' not in config['args']:
            config['args']['_evaluate'] = self.data['_evaluate']

        # un-alias
        origin = self.data['components']['@'][name]

        # mixins
        for i, mixin in enumerate(parse_mixins(config['args'].get('_mixins_'))):
            mixin_info = {
                'name': mixin['name']
            }

            if mixin['name'].startswith('+.'):
                raise AttributeError(f"Mixin import '{mixin['name']}' is ambiguous. "
                                     f"Please register it in the mixins section and use a unique alias.")

            if origin.startswith('+.'):
                vendor = origin.split('.')[1]

                # consider import mixins
                try:
                    mixin_args = copy.deepcopy(self.data['imports']['mixins'][vendor + '.' + mixin['name']])
                except KeyError:
                    raise KeyError(f"Dependent mixin '{vendor + '.' + mixin['name']}' of '{origin}' not found.")

                # un-alias
                mixin_info['origin'] = '+.' + vendor + '.' + \
                                       self.data['imports']['mixins'][vendor + '.@'].get(mixin['name'])
            else:
                if 'vendor' in mixin:
                    try:
                        mixin_args = copy.deepcopy(self.data['imports']['mixins'][mixin['vendor'] + '.' +
                                                                                  mixin['name']])
                        mixin_info['origin'] = '+.' + mixin['vendor'] + '.' + \
                                               self.data['imports']['mixins'][mixin['vendor'] + '.@'][mixin['name']]
                    except KeyError:
                        raise KeyError(f"Dependent mixin '{mixin['vendor'] + '.' + mixin['name']}' not found.")
                else:
                    try:
                        mixin_args = copy.deepcopy(self.data['mixins'][mixin['name']])
                        mixin_info['origin'] = self.data['mixins']['@'].get(mixin['name'])
                    except KeyError:
                        raise KeyError(f"Mixin '{mixin['name']}' not found. Is it registered under 'mixins'?")

            # the mixin config can be overwritten by the local config so we update the mixin arg and write it back
            config['args'] = update_dict(mixin_args['args'], config['args'], copy=True)

            # write information
            config['args']['_mixins_'][i] = mixin_info

        # parse updates

        # merge local update to global updates
        config['versions'] = []
        versions = copy.deepcopy(self.version)
        if version is not None:
            versions.append({
                'arguments': {'component': copy.deepcopy(version)}
            })

        version = {}
        for updates in collect_updates(versions):
            # select children/node subsection
            update = updates.get('component', None)
            if update is None:
                continue

            if not isinstance(update, tuple):
                update = (update,)

            for k in update:
                # load arguments from machinable.yaml
                if isinstance(k, str):
                    config['versions'].append(k)
                    k = self._get_version(k, config['args'], version)

                # merge with version
                version = update_dict(version, k)

        config['args'] = update_dict(config['args'], version)

        # remove unused versions
        config['args'] = {k: v for k, v in config['args'].items() if not k.startswith('~') or k in config['versions']}

        return config

    def get(self, component):
        component = TaskComponent.create(component)

        return self.get_component(component.name, component.version, component.flags)
