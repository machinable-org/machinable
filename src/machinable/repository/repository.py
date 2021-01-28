from machinable.element.element import Element
from machinable.utils.traits import Discoverable


class Repository(Element, Discoverable):
    def __init__(self, name: str = None):
        self.name = name
