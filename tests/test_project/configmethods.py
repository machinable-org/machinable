from machinable import Component


class ConfMethods(Component):
    def on_create(self):
        assert self.config.method == "test"
        assert self.config.argmethod == "world"
        assert self.config.nested.method == "test"
        assert self.config.global_method is True

    def config_hello(self):
        return "test"

    def config_arghello(self, arg):
        return arg
