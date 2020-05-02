from .engine import Engine


class DryEngine(Engine):
    def __repr__(self):
        return "Dry run"

    def init(self):
        pass

    def shutdown(self):
        pass

    def join(self):
        pass

    def execute(self, promise):
        pass
