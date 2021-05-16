from machinable import Component


class Dummy(Component):
    def config_through_config_method(self, arg):
        return arg
