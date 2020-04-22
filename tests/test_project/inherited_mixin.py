from machinable import Component


class InheritedMixin(Component):
    def on_execute(self):
        assert self._hidden_.functionality() == "works"
