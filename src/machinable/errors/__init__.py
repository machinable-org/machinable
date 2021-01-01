class MachinableError(Exception):
    """All of machinable exception inherit from this baseclass"""


class DependencyMissing(MachinableError, ImportError):
    """Missing optional dependency

    Bases: ImportError"""


class ExecutionFailed(MachinableError):
    def __init__(self, message, reason=None):
        super().__init__(message)
        self.reason = reason


class ExecutionInterrupt(ExecutionFailed):
    """Execution was interrupted

    Bases: ExecutionFailed"""

    def __init__(self, message):
        super().__init__(message, reason="interrupt")
