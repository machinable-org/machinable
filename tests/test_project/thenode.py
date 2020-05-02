import time

from machinable import Component


class TheNode(Component):
    def on_create(self):
        if self.config.timeout > 0:
            print("sleeping for a while")
            time.sleep(self.config.timeout)
        print("hello from the node")

    def config_through_config_method(self, arg):
        return arg
