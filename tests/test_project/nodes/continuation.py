from machinable import Component


class ContinuationComponent(Component):
    def on_create(self):
        assert self.flags.get("DERIVED_FROM_STORAGE", None) is not None
