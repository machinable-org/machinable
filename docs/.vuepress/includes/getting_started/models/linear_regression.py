from machinable import Component


class LinearRegressionDummy(Component):

    def on_create(self):
        self.alpha = 0

    def train(self, x):
        self.alpha = 1 / x

    def on_destroy(self):
        print('Training finished')
