from typing import Dict

from machinable.element import Element
from machinable.settings import get_settings


class Scope(Element):
    kind = "Scope"
    default = get_settings().default_scope

    def __call__(self) -> Dict:
        return self._kwargs
