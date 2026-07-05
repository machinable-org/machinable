from machinable import Interface


class Streamer(Interface):
    def stream(self):
        yield 1
        yield 2
