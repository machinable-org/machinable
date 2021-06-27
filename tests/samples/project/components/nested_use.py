from machinable import Component


class NestedUse(Component):
    def on_configure(self, config) -> None:
        assert self.parent.config.top_level.const == 1
