from machinable import Component


class ConfMethods(Component):
    def config_hello(self):
        return "test"

    def config_arghello(self, arg):
        return arg

    def config_recursive_call(self, arg):
        return self.config.method + str(arg)
