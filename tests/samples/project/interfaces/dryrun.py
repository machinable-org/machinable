from machinable import Interface


class DryRun(Interface):
    def on_create(self):
        # Should never be executed
        assert False
