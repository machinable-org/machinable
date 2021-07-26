import types
from typing import TYPE_CHECKING, Any, Optional, Union

import getpass
import os
import platform
import socket
import sys

import machinable
from machinable.component import Component
from machinable.config import from_file as load_config_from_file
from machinable.types import VersionType
from machinable.utils import get_machinable_version

if TYPE_CHECKING:
    from machinable.project import Project


class Provider(Component):
    """See registration"""

    def __init__(self, version: VersionType = None):
        super().__init__(config={}, version=version)

    def get_component_class(self, kind: str) -> Optional[Any]:
        """Returns the component base class for the component kind"""
        return getattr(machinable, kind[:-1].capitalize(), None)

    def get_host_info(self) -> dict:
        """Returned dictionary will be recorded as host information"""
        return {
            "network_name": platform.node(),
            "hostname": socket.gethostname(),
            "machine": platform.machine(),
            "python_version": platform.python_version(),
            "user": getpass.getuser(),
            "environ": os.environ.copy(),
            "argv": sys.argv,
            "machinable_version": get_machinable_version(),
        }

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

    def on_component_import(
        self, module: str, project: "Project"
    ) -> Union[None, str, types.ModuleType]:
        """Event triggered before a component is imported from a module

        You can prevent the import and return a component or an alternative module import path
        from this method to be used instead.

        # Arguments
        module: The module that is about to be imported
        project: The machinable project
        """
