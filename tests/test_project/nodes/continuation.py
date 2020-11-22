from machinable import Component


class ContinuationComponent(Component):
    def on_create(self):
        assert self.flags.get("DERIVED_FROM_SUBMISSION", None) is not None
