from typing import Dict

from machinable.collection import InterfaceCollection
from machinable.config import to_dict
from machinable.element import Element
from machinable.index import Index
from machinable.interface import Interface


class Scope(Element):
    kind = "Scope"
    default = None

    def __call__(self) -> Dict:
        return to_dict(self.config._update_)

    def all(self) -> "InterfaceCollection":
        return InterfaceCollection(
            [
                Interface.find(interface.uuid)
                for interface in Index.get().find_by_context(
                    {"predicate": self.__call__()}
                )
            ]
        )
