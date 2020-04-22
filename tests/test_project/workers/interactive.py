from machinable import Component


class InteractiveComponent(Component):
    def on_create(self):
        assert self.node.config.alpha == 0
