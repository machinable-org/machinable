from machinable.utils.traits import Discoverable


class Repository(Discoverable):
    def __init__(self, name: str = None):
        self.name = name
