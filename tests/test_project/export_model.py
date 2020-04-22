from machinable import Component


class ExportModel(Component):
    def on_after_create(self):
        # use mixins
        print("Mixin " + self._mixin_module_.static_method("model"))
