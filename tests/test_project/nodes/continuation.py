from machinable import Component


class ContinuationComponent(Component):
    def on_create(self):
        assert "parent" in self.store.config
