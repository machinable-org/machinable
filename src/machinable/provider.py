from typing import Optional

from machinable.config import Config


class Provider:
    """See registration"""

    def __init__(self, mode: Optional[str] = None):
        self._mode = mode

    def get_container_types(self):
        """Registers core and custom container types"""

    def get_config(self) -> Config:
        """Registers project configuration parser"""
        return Config
