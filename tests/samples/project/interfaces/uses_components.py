from machinable import Interface


class UsesComponents(Interface):
    def on_init(self, test, dummy, optional=None):
        self.test = test
        self.dummy = dummy
        self.optional = optional
