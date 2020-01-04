from machinable import Component


class MyBaseModel(Component):

    def on_create(self):
        self.epoch = None

    def on_execute(self):
        for epoch in range(5):
            self.epoch = epoch
            print(epoch, self.config.learning_rate)

    def config_learning_rate(self, base=0.1):
        if not self.epoch:
            return base  # default learning rate

        return base * self.epoch
