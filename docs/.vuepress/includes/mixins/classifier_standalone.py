import tensorflow_datasets as tfds
from machinable import Component

class Classifier(Component):

    def load_data(self):
        self.data = tfds.load(name=self.config.dataset.name)\
                        .batch(self.config.dataset.batch_size)

    def train(self):
        self.load_data()
        self.network.fit(self.data)
