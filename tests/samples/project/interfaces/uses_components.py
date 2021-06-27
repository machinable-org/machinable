from machinable import Interface


class UsesComponents(Interface):
    def on_dispatch(self):
        self.test = self.components["test"]
        self.dummy = self.components["dummy"]
        self.optional = self.components.get("optional", None)
