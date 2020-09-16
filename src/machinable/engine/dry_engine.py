from .engine import Engine


class DryEngine(Engine):
    def __init__(self):
        Engine.set_latest(self)

    def __repr__(self):
        return "Engine <dry>"

    @staticmethod
    def supports_resources():
        return False

    def storage_middleware(self, storage):
        storage["url"] = "mem://"
        return storage

    def _submit(self, execution):
        return execution
