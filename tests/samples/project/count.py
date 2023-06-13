from machinable import Component


class Counter(Component):
    def __call__(self):
        self.save_file("count", self.count + 1)

    @property
    def count(self):
        return int(self.load_file("count", 0))
