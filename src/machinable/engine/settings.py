import os
import configparser


_settings = None


def get_settings(reload=False):
    global _settings
    if _settings is None or reload:
        _settings = configparser.ConfigParser()
        _settings.read(os.path.expanduser('~/.machinablerc'))
        # default values
        if not _settings.has_section('cache'):
            _settings['cache'] = {}
        if not _settings.has_section('imports'):
            _settings['imports'] = {}
        if not _settings.has_section('observations'):
            _settings['observations'] = {}

    return _settings
