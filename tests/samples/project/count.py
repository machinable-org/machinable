from machinable import Execution


class Counter(Execution):
    def __call__(self):
        self.save_file("count", self.count + 1)

    @property
    def count(self):
        return int(self.load_file("count", 0))
