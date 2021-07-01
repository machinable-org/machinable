from machinable import Component


class SlotUse(Component):
    class Config:
        nested: str
        manipulate: bool

    def on_configure(self, config):
        if config.manipulate and self.parent.config.c == 1:
            config.nested = "manipulated"
