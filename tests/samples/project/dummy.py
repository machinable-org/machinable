from machinable import Component


class Dummy(Component):
    class Config:
        a: int = 1
        ignore_me_: int = -1

    def name(self):
        return "dummy"
