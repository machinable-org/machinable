from machinable import Component


class DryRun(Component):
    def on_before_create(self):
        # Should never be executed
        assert False
