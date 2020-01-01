from machinable import Component


class MyComponent(Component):

    def on_create(self):
        print(self.config.config_value)
        print(self.config.nested.value)
        print(self.config['nested']['value'])
