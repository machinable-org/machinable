from .engine import Engine


class DryEngine(Engine):
    def __init__(self):
        Engine.set_latest(self)

    def __repr__(self):
        return "Dry run"

    def _submit(self, execution):
        return execution
