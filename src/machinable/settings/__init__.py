import os

import yaml
from machinable.config.mapping import config_map
from machinable.utils.dicts import update_dict

_settings = None


def get_settings(reload=False, file="~/.machinable/settings.yaml"):
    global _settings
    if _settings is None or reload:
        try:
            with open(os.path.expanduser(file)) as f:
                _settings = yaml.load(f, Loader=yaml.SafeLoader)
        except FileNotFoundError:
            _settings = {}
        except yaml.parser.ParserError as e:
            _settings = {"_errors": f"Invalid configuration file: {e}"}

        # defaults
        _settings = config_map(
            update_dict(
                {
                    "cache": {"imports": False},
                    "imports": {},
                    "schema_validation": True,
                    "tmp_directory": "userdata://machinable:machinable/tmp",
                    "default_storage": "./storage",
                    "default_engine": None,
                    "default_repository": None,
                    "default_project": None,
                    "default_code_backup": None,
                },
                _settings,
            )
        )

    return _settings
