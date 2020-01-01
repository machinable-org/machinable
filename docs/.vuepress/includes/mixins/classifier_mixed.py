from machinable import Component

class Classifier(Component):

    def train(self):
        self._data_.load_data()
        self.network.fit(self.data)
