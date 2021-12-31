from typing import List, Optional, Union

import os

import json
from machinable.errors import ConfigurationError
from pydantic import BaseModel


class Settings(BaseModel):
    default_execution: List[Union[str, dict]] = [
        "machinable.execution.local_execution"
    ]
    default_storage: List[Union[str, dict]] = [
        "machinable.storage.filesystem_storage",
        {"directory": "./storage"},
    ]
    default_experiment: Optional[str] = None
    default_group: Optional[str] = "%Y_%U_%a/"


def get_settings():
    # todo: look up local environment
    system_config = "~/.machinable/settings.json"
    try:
        with open(os.path.expanduser(system_config)) as f:
            data = json.load(f)
    except FileNotFoundError:
        data = {}
    except json.parser.ParserError as _e:
        raise ConfigurationError(
            f"Could not parse settings file at {system_config}"
        ) from _e

    return Settings(**data)
