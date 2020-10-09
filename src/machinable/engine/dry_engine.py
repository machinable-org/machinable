from .engine import Engine


class DryEngine(Engine):
    def __init__(self):
        Engine.set_latest(self)

    def __repr__(self):
        return "Engine <dry>"

    @staticmethod
    def supports_resources():
        return False

    def on_before_storage_creation(self, execution):
        execution.storage.config["url"] = "mem://"

    def _submit(self, execution):
        return execution
