import re

from .mapping import ConfigMethod
from ..utils.strings import is_valid_variable_name


def bind_config_methods(obj, config):
    if isinstance(config, list):
        return [bind_config_methods(obj, v) for v in config]

    if isinstance(config, tuple):
        return (bind_config_methods(obj, v) for v in config)

    if isinstance(config, dict):
        for k, v in config.items():
            if k == '_mixins_':
                continue
            config[k] = bind_config_methods(obj, v)
        return config

    if isinstance(config, str):
        # config method
        fn_match = re.match(r"(?P<method>\w+)\s?\((?P<args>.*)\)", config)
        if fn_match is not None:
            definition = config
            method = 'config_' + fn_match.groupdict()['method']
            args = fn_match.groupdict()['args']
            if getattr(obj, method, False) is False:
                msg = "Config method %s specified but %s.%s() does not exist." % \
                      (definition, type(obj).__name__, method)
                raise AttributeError(msg)
            else:
                return ConfigMethod(obj, method, args, definition)

    return config


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

        if 'name' not in mixin:
            raise ValueError(f"Mixin definition '{mixin}' must specify a name")

        if 'attribute' not in mixin:
            mixin['attribute'] = '_' + mixin['name'].replace('+.', '').replace('.', '_') + '_'

        mixin['valid_attribute'] = is_valid_variable_name(mixin['attribute'])

        if valid_only and not mixin['valid_attribute']:
            continue

        mixins.append(mixin)

    return mixins
