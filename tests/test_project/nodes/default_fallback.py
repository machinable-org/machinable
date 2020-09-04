from machinable import Component


class DefaultFallback(Component):
    def on_execute(self):
        print("Default component", self.config)
