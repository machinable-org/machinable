from machinable import Engine, Execution


class Example(Execution):
    @property
    def is_extended(self) -> bool:
        return True


class DummyEngine(Engine):
    is_dummy = True
