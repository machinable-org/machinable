from typing import Optional

import os

import yaml
from machinable.errors import ConfigurationError
from pydantic import BaseModel


class Settings(BaseModel):
    default_storage: str = "./storage"
    default_repository: Optional[str] = None


def get_settings():
    # todo: look up local environment
    system_config = "~/.machinable/settings.yaml"
    try:
        with open(os.path.expanduser(system_config)) as f:
            data = yaml.load(f, Loader=yaml.SafeLoader)
    except FileNotFoundError:
        data = {}
    except yaml.parser.ParserError as _e:
        raise ConfigurationError(
            f"Could not parse settings file at {system_config}"
        ) from _e

    return Settings(**data)