from typing import List, Optional, Union

import json
import os

from machinable.errors import ConfigurationError
from machinable.schema import Execution, Experiment
from machinable.types import ElementType
from pydantic import BaseModel


class Settings(BaseModel):
    default_predicate: Optional[str] = "config,*"
    default_execution: Optional[ElementType] = None
    default_experiment: Optional[ElementType] = None
    default_schedule: Optional[ElementType] = None
    default_group: Optional[str] = "%Y_%U_%a/"
    default_storage: List[Union[str, dict]] = [
        "machinable.storage.filesystem",
        {"directory": "./storage"},
    ]


def get_settings(file="~/.machinable/settings.json"):
    try:
        with open(os.path.expanduser(file)) as f:
            data = json.load(f)
    except FileNotFoundError:
        data = {}
    except json.decoder.JSONDecodeError as _e:
        raise ConfigurationError(
            f"Could not parse settings file at {file}"
        ) from _e

    return Settings(**data)
