from machinable.engine.engine import Engine


class DryEngine(Engine):
    def __repr__(self):
        return "Engine <dry>"

    @staticmethod
    def supports_resources():
        return False

    def on_before_storage_creation(self, execution):
        execution.storage.config["url"] = "mem://"

    def _dispatch(self, execution):
        return execution
