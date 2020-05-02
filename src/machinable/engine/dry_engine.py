from .engine import Engine


class DryEngine(Engine):
    def __repr__(self):
        return "Dry run"

    def submit(self, execution):
        return execution
