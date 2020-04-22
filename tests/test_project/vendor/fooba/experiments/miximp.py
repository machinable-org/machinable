from machinable import Component


class MixinImportTestNode(Component):
    def on_create(self):
        self._hidden_.functionality()
