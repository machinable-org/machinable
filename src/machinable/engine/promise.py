from ..core.exceptions import ExecutionException
from ..utils.formatting import msg


class Promise:
    def __init__(self, component, components, storage, resources):
        self._then = []
        self.component = component
        self.components = components
        self.storage = storage
        self.resources = resources

    def then(self, *handlers):
        if handlers is None:
            self._then = []
            return

        self._then.extend(handlers)

    def resolve(self, result):
        for callback in self._then:
            callback(result)

        if isinstance(result, ExecutionException):
            self.failure(str(result))
        else:
            self.success()

    def failure(self, message=""):
        flags = self.component["flags"]
        msg(
            f"{flags['UID']} of experiment {flags['EXPERIMENT_ID']} failed "
            f"({flags['EXECUTION_INDEX'] + 1}/{flags['EXECUTION_CARDINALITY']}). "
            f"{message}",
            color="fail",
        )

    def success(self, message=""):
        flags = self.component["flags"]
        msg(
            f"{flags['UID']} of experiment {flags['EXPERIMENT_ID']} has finished "
            f"({flags['EXECUTION_INDEX'] + 1}/{flags['EXECUTION_CARDINALITY']}). "
            f"{message}",
            color="green",
        )
