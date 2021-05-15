from typing import Any, Optional

import os

import machinable
from machinable.config import from_file as load_config_from_file


class Provider:
    """See registration"""

    def __init__(self, mode: Optional[str] = None):
        self._mode = mode

    def get_component_class(self, kind: str) -> Optional[Any]:
        """Returns the component base class for the component kind"""
        # todo: make extendable
        return getattr(machinable, kind[:-1].capitalize(), None)

    def load_config(self, directory: str) -> dict:
        """Returns the configuration of the given project directory

        By default this will load a machinable.yaml file. You may
        overwrite this method to support other configuration formats
        in your project. Note that this method should return the raw
        configuration that will be parsed at a later stage
        """
        return load_config_from_file(
            os.path.join(directory, "machinable.yaml"), default={}
        )
