from typing import Dict

from machinable.config import to_dict
from machinable.element import Element
from machinable.settings import get_settings


class Scope(Element):
    kind = "Scope"
    default = get_settings().default_scope

    def __call__(self) -> Dict:
        version = to_dict(self.config._update_)
        if not version:
            return {"unique_id": self.uuid}

        return version
