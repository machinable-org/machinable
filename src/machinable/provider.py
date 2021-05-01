from typing import Optional


class Provider:
    """See registration"""

    def __init__(self, mode: Optional[str] = None):
        self._mode = mode

    def get_container_types(self):
        """Registers core and custom container types"""

    def get_config_provider(self):
        return None
