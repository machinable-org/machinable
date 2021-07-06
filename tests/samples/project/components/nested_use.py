from machinable import Component


class NestedUse(Component):
    def on_configure(self) -> None:
        assert self.parent.config.top_level.const == 1
