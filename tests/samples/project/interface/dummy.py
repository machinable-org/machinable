from machinable import Interface


class Dummy(Interface):
    def __call__(self):
        print("Hello world!")

    def hello(self) -> str:
        return "world"
