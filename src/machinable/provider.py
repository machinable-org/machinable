from typing import Any, List, Optional, Union

import os

import machinable
from machinable.component import Component
from machinable.config import from_file as load_config_from_file
from machinable.types import Version


class Provider(Component):
    """See registration"""

    def __init__(self, version: Version = None):
        super().__init__(
            spec={
                "name": self.__class__.__module__,
                "module": self.__class__.__module__,
                "kind": "providers",
                "prefix": "",
                "key": self.__class__.__module__,
                "alias": None,
                "parent": None,
                "lineage": [],
                "config": {},
            },
            version=version,
        )

    def get_component_class(self, kind: str) -> Optional[Any]:
        """Returns the component base class for the component kind"""
        # todo: make extendable
        return getattr(machinable, kind[:-1].capitalize(), None)

    def get_component_defaults(self, kind: str) -> List[Union[str, dict]]:
        pass

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

    def on_resolve_vendor(
        self, name: str, source: str, target: str
    ) -> Optional[bool]:
        """Event triggered when vendor is resolved

        # Arguments
        name: The name of the vendor
        source: The source configuration
        target: The target directory (may or may not exists yet)

        Return False to prevent the default automatic resolution
        """
