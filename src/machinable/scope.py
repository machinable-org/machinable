from typing import Dict

from machinable.config import to_dict
from machinable.interface import Interface


class Scope(Interface):
    kind = "Scope"
    default = None

    def __call__(self) -> Dict:
        return to_dict(self.config._update_)
