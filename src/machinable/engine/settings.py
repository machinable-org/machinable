import os
import yaml

from ..utils.dicts import update_dict

_settings = None


def get_settings(reload=False, file='~/.machinable/settings.yaml'):
    global _settings
    if _settings is None or reload:
        try:
            with open(os.path.expanduser(file), 'r') as f:
                _settings = yaml.load(f)
        except FileNotFoundError:
            _settings = {}

        # defaults
        _settings = update_dict({
            'cache': {
                'imports': False
            },
            'imports': {},
            'database': {
                'default': 'sqlite',
                'mysql': {
                    'driver': 'mysql',
                    'host': 'localhost',
                    'database': 'database',
                    'user': 'root',
                    'password': '',
                    'prefix': ''
                },
                'sqlite': {
                    'driver': 'sqlite',
                    'database': '~/.machinable/database.sqlite'
                }
            }
        }, _settings)

    return _settings
