from machinable import Mixin


class NestedMixin(Mixin):
    def hello(self):
        return self.flags.BOUND
