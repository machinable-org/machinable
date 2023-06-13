from machinable import Component

class Fail(Component):
    def __call__(self):
        if not self.load_file("repaired", False):
            raise Exception("Fail")
