from machinable import Execution


class Fail(Execution):
    def __call__(self):
        if not self.load_file("repaired", False):
            raise Exception("Fail")
