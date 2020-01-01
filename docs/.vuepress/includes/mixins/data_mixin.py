import tensorflow_datasets as tfds
from machinable import Mixin

class DataMixin(Mixin):

    def load_data(self):
        self.data = tfds.load(name=self.config.dataset.name)\
                        .batch(self.config.dataset.batch_size)